import { supabaseAdmin } from '../config/supabase.js';

/**
 * Process document with OCR (simulated AI extraction)
 */
export async function processDocument(req, res) {
  try {
    const file = req.file;
    const { document_type, asset_id } = req.body;

    if (!file) {
      return res.status(400).json({
        error: 'No file provided',
        message: 'Please upload a document'
      });
    }

    // Upload to storage
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `ocr/${document_type || 'general'}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return res.status(400).json({
        error: 'Upload failed',
        message: uploadError.message
      });
    }

    // Simulate OCR extraction (in production, use actual OCR service like Tesseract, Google Vision API, etc.)
    const extractedData = simulateOCRExtraction(file.originalname, document_type);

    // Save to processed documents table
    const { data: document, error: docError } = await supabaseAdmin
      .from('processed_documents')
      .insert([{
        file_name: file.originalname,
        file_type: file.mimetype,
        file_size: file.size,
        storage_path: uploadData.path,
        document_type: document_type || 'unknown',
        asset_id: asset_id || null,
        extracted_data: extractedData,
        confidence_score: extractedData.confidence || 0.75,
        status: extractedData.confidence >= 0.7 ? 'approved' : 'pending_review',
        processed_by: req.user.id,
        uploaded_by: req.user.id
      }])
      .select()
      .single();

    if (docError) {
      return res.status(400).json({
        error: 'Document record failed',
        message: docError.message
      });
    }

    return res.status(201).json({
      message: 'Document processed successfully',
      document,
      extracted_data: extractedData,
      needs_review: extractedData.confidence < 0.7
    });

  } catch (error) {
    console.error('Process document error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process document'
    });
  }
}

/**
 * Get all processed documents
 */
export async function getAllDocuments(req, res) {
  try {
    const { limit = 50, offset = 0, status, document_type, asset_id } = req.query;
    
    let query = supabaseAdmin
      .from('processed_documents')
      .select(`
        *,
        assets(asset_name, registration_number),
        user_profiles!processed_documents_uploaded_by_fkey(full_name)
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (document_type) {
      query = query.eq('document_type', document_type);
    }

    if (asset_id) {
      query = query.eq('asset_id', asset_id);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      return res.status(400).json({
        error: 'Fetch failed',
        message: error.message
      });
    }

    return res.status(200).json({
      documents: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get documents error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch documents'
    });
  }
}

/**
 * Get document by ID
 */
export async function getDocumentById(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('processed_documents')
      .select(`
        *,
        assets(asset_name, registration_number),
        user_profiles!processed_documents_uploaded_by_fkey(full_name, email)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'The requested document does not exist'
      });
    }

    // Get signed URL for download
    const { data: signedUrl } = await supabaseAdmin.storage
      .from('documents')
      .createSignedUrl(data.storage_path, 3600);

    return res.status(200).json({
      document: data,
      download_url: signedUrl?.signedUrl
    });

  } catch (error) {
    console.error('Get document error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch document'
    });
  }
}

/**
 * Approve document and create expense/maintenance record
 */
export async function approveDocument(req, res) {
  try {
    const { id } = req.params;
    const { create_expense, create_maintenance, corrections } = req.body;

    // Get document
    const { data: document, error: docError } = await supabaseAdmin
      .from('processed_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (docError || !document) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'The requested document does not exist'
      });
    }

    // Apply any corrections
    let extractedData = document.extracted_data;
    if (corrections) {
      extractedData = { ...extractedData, ...corrections };
    }

    // Update document status
    const { error: updateError } = await supabaseAdmin
      .from('processed_documents')
      .update({
        status: 'approved',
        extracted_data: extractedData,
        approved_by: req.user.id,
        approved_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      return res.status(400).json({
        error: 'Approval failed',
        message: updateError.message
      });
    }

    let createdRecords = {};

    // Create expense if requested
    if (create_expense && extractedData.amount) {
      const { data: expense } = await supabaseAdmin
        .from('expenses')
        .insert([{
          asset_id: document.asset_id,
          expense_date: extractedData.date || new Date().toISOString().split('T')[0],
          vendor: extractedData.vendor || 'Unknown',
          amount: parseFloat(extractedData.amount),
          currency: extractedData.currency || 'USD',
          invoice_number: extractedData.invoice_number,
          description: extractedData.description,
          category: extractedData.category || 'miscellaneous',
          created_by: req.user.id
        }])
        .select()
        .single();

      createdRecords.expense = expense;
    }

    // Create maintenance record if requested
    if (create_maintenance && extractedData.maintenance_type) {
      const { data: maintenance } = await supabaseAdmin
        .from('maintenance_logs')
        .insert([{
          asset_id: document.asset_id,
          maintenance_type: extractedData.maintenance_type,
          maintenance_date: extractedData.date || new Date().toISOString().split('T')[0],
          description: extractedData.description,
          cost: extractedData.amount ? parseFloat(extractedData.amount) : null,
          vendor: extractedData.vendor,
          created_by: req.user.id
        }])
        .select()
        .single();

      createdRecords.maintenance = maintenance;
    }

    return res.status(200).json({
      message: 'Document approved successfully',
      document_id: id,
      created_records: createdRecords
    });

  } catch (error) {
    console.error('Approve document error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to approve document'
    });
  }
}

/**
 * Reject document
 */
export async function rejectDocument(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const { error } = await supabaseAdmin
      .from('processed_documents')
      .update({
        status: 'rejected',
        rejection_reason: reason || 'Quality or accuracy issues',
        rejected_by: req.user.id,
        rejected_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      return res.status(400).json({
        error: 'Rejection failed',
        message: error.message
      });
    }

    return res.status(200).json({
      message: 'Document rejected successfully'
    });

  } catch (error) {
    console.error('Reject document error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to reject document'
    });
  }
}

/**
 * Simulate OCR extraction (placeholder for actual AI/OCR service)
 */
function simulateOCRExtraction(fileName, documentType) {
  // In production, this would call actual OCR services like:
  // - Google Cloud Vision API
  // - AWS Textract
  // - Azure Computer Vision
  // - Tesseract.js for client-side
  
  const randomConfidence = 0.7 + Math.random() * 0.25; // 0.7 to 0.95

  // Simulate extracted data based on document type
  if (documentType === 'invoice' || fileName.toLowerCase().includes('invoice')) {
    return {
      document_type: 'invoice',
      vendor: 'Sample Aviation Services',
      amount: (Math.random() * 10000 + 500).toFixed(2),
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      invoice_number: `INV-${Math.floor(Math.random() * 100000)}`,
      description: 'Aircraft maintenance service',
      category: 'maintenance',
      confidence: randomConfidence
    };
  } else if (documentType === 'maintenance' || fileName.toLowerCase().includes('maintenance')) {
    return {
      document_type: 'maintenance_report',
      maintenance_type: 'a_check',
      date: new Date().toISOString().split('T')[0],
      description: '100-hour inspection completed',
      technician_name: 'John Doe',
      technician_license: 'A&P-12345',
      components_replaced: 'Oil filter, spark plugs',
      confidence: randomConfidence
    };
  } else {
    return {
      document_type: 'general',
      content_summary: 'Document processed successfully',
      confidence: randomConfidence
    };
  }
}
