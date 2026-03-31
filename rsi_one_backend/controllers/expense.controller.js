import { supabaseAdmin } from '../config/supabase.js';
import { EXPENSE_CATEGORIES } from '../config/constants.js';

/**
 * Create expense
 */
export async function createExpense(req, res) {
  try {
    const {
      asset_id,
      expense_date,
      vendor,
      category,
      amount,
      currency,
      invoice_number,
      description,
      payment_method,
      notes
    } = req.body;

    if (!asset_id || !expense_date || !vendor || !amount || !currency) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'asset_id, expense_date, vendor, amount, and currency are required'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('expenses')
      .insert([{
        asset_id,
        expense_date,
        vendor,
        category: category || EXPENSE_CATEGORIES.MISC,
        amount,
        currency,
        invoice_number,
        description,
        payment_method,
        notes,
        created_by: req.user.id
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Expense creation failed',
        message: error.message
      });
    }

    // Check for anomalies (simple threshold-based)
    const anomaly = await detectAnomalies(asset_id, category, amount);
    if (anomaly) {
      await supabaseAdmin
        .from('expenses')
        .update({ is_flagged: true, flag_reason: anomaly })
        .eq('id', data.id);
    }

    return res.status(201).json({
      message: 'Expense created successfully',
      expense: data,
      anomaly_detected: !!anomaly
    });

  } catch (error) {
    console.error('Create expense error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create expense'
    });
  }
}

/**
 * Get all expenses
 */
export async function getAllExpenses(req, res) {
  try {
    const { limit = 50, offset = 0, asset_id, category, start_date, end_date, is_flagged } = req.query;
    
    let query = supabaseAdmin
      .from('expenses')
      .select(`
        *,
        assets(asset_name, registration_number),
        user_profiles!expenses_created_by_fkey(full_name)
      `, { count: 'exact' });

    if (asset_id) {
      query = query.eq('asset_id', asset_id);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (start_date) {
      query = query.gte('expense_date', start_date);
    }

    if (end_date) {
      query = query.lte('expense_date', end_date);
    }

    if (is_flagged !== undefined) {
      query = query.eq('is_flagged', is_flagged === 'true');
    }

    const { data, error, count } = await query
      .order('expense_date', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      return res.status(400).json({
        error: 'Fetch failed',
        message: error.message
      });
    }

    return res.status(200).json({
      expenses: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get expenses error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch expenses'
    });
  }
}

/**
 * Get expense by ID
 */
export async function getExpenseById(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('expenses')
      .select(`
        *,
        assets(asset_name, registration_number, asset_type),
        user_profiles!expenses_created_by_fkey(full_name, email),
        expense_attachments(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Expense not found',
        message: 'The requested expense does not exist'
      });
    }

    return res.status(200).json({
      expense: data
    });

  } catch (error) {
    console.error('Get expense error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch expense'
    });
  }
}

/**
 * Update expense
 */
export async function updateExpense(req, res) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    delete updates.id;
    delete updates.created_at;
    delete updates.created_by;
    
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Update failed',
        message: error.message
      });
    }

    return res.status(200).json({
      message: 'Expense updated successfully',
      expense: data
    });

  } catch (error) {
    console.error('Update expense error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update expense'
    });
  }
}

/**
 * Delete expense
 */
export async function deleteExpense(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({
        error: 'Delete failed',
        message: error.message
      });
    }

    return res.status(200).json({
      message: 'Expense deleted successfully'
    });

  } catch (error) {
    console.error('Delete expense error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete expense'
    });
  }
}

/**
 * Upload expense attachment (invoice, receipt)
 */
export async function uploadExpenseAttachment(req, res) {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: 'No file provided',
        message: 'Please upload a file'
      });
    }

    // Upload to storage
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `expenses/${id}/${fileName}`;

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

    // Save attachment record
    const { data: attachment, error: attachmentError } = await supabaseAdmin
      .from('expense_attachments')
      .insert([{
        expense_id: id,
        file_name: file.originalname,
        file_type: file.mimetype,
        file_size: file.size,
        storage_path: uploadData.path,
        uploaded_by: req.user.id
      }])
      .select()
      .single();

    if (attachmentError) {
      return res.status(400).json({
        error: 'Attachment record failed',
        message: attachmentError.message
      });
    }

    return res.status(201).json({
      message: 'File uploaded successfully',
      attachment
    });

  } catch (error) {
    console.error('Upload expense attachment error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to upload attachment'
    });
  }
}

/**
 * Get expense summary by category
 */
export async function getExpenseSummary(req, res) {
  try {
    const { asset_id, start_date, end_date } = req.query;

    let query = supabaseAdmin
      .from('expenses')
      .select('category, amount, currency');

    if (asset_id) {
      query = query.eq('asset_id', asset_id);
    }

    if (start_date) {
      query = query.gte('expense_date', start_date);
    }

    if (end_date) {
      query = query.lte('expense_date', end_date);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        error: 'Fetch failed',
        message: error.message
      });
    }

    // Group by category
    const summary = {};
    data.forEach(expense => {
      const category = expense.category || 'uncategorized';
      if (!summary[category]) {
        summary[category] = { total: 0, count: 0, currency: expense.currency };
      }
      summary[category].total += expense.amount;
      summary[category].count += 1;
    });

    const totalAmount = data.reduce((sum, exp) => sum + exp.amount, 0);

    return res.status(200).json({
      period: {
        start: start_date || 'inception',
        end: end_date || 'now'
      },
      total_expenses: data.length,
      total_amount: totalAmount.toFixed(2),
      by_category: summary
    });

  } catch (error) {
    console.error('Get expense summary error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch expense summary'
    });
  }
}

/**
 * Detect duplicate expenses
 */
export async function detectDuplicates(req, res) {
  try {
    const { asset_id } = req.query;

    let query = supabaseAdmin
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false });

    if (asset_id) {
      query = query.eq('asset_id', asset_id);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        error: 'Fetch failed',
        message: error.message
      });
    }

    // Simple duplicate detection logic
    const duplicates = [];
    const seen = new Map();

    data.forEach(expense => {
      const key = `${expense.vendor}-${expense.amount}-${expense.invoice_number}`;
      if (seen.has(key)) {
        duplicates.push({
          original: seen.get(key),
          duplicate: expense
        });
      } else {
        seen.set(key, expense);
      }
    });

    return res.status(200).json({
      duplicate_count: duplicates.length,
      duplicates
    });

  } catch (error) {
    console.error('Detect duplicates error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to detect duplicates'
    });
  }
}

/**
 * Helper function to detect cost anomalies
 */
async function detectAnomalies(assetId, category, amount) {
  try {
    const { data } = await supabaseAdmin
      .from('expenses')
      .select('amount')
      .eq('asset_id', assetId)
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!data || data.length < 5) return null;

    const amounts = data.map(e => e.amount);
    const avg = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
    const threshold = avg * 2; // 200% of average

    if (amount > threshold) {
      return `Amount (${amount}) is significantly higher than average (${avg.toFixed(2)})`;
    }

    return null;
  } catch (error) {
    console.error('Anomaly detection error:', error);
    return null;
  }
}
