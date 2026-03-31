import { supabaseAdmin } from '../config/supabase.js';
import { ASSET_TYPES } from '../config/constants.js';

/**
 * Create new asset
 */
export async function createAsset(req, res) {
  try {
    const {
      asset_name,
      asset_type,
      model,
      serial_number,
      registration_number,
      manufacture_date,
      base_location_icao,
      insurance_expiry,
      arc_expiry,
      cofa_expiry,
      description
    } = req.body;

    // Validate required fields
    if (!asset_name || !asset_type || !model) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'asset_name, asset_type, and model are required'
      });
    }

    // Validate asset type
    if (!Object.values(ASSET_TYPES).includes(asset_type)) {
      return res.status(400).json({
        error: 'Invalid asset type',
        message: `Asset type must be one of: ${Object.values(ASSET_TYPES).join(', ')}`
      });
    }

    const { data, error } = await supabaseAdmin
      .from('assets')
      .insert([{
        asset_name,
        asset_type,
        model,
        serial_number,
        registration_number,
        manufacture_date,
        base_location_icao,
        insurance_expiry,
        arc_expiry,
        cofa_expiry,
        description,
        created_by: req.user.id,
        owner_id: req.userProfile.role === 'owner' ? req.user.id : null
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Asset creation failed',
        message: error.message
      });
    }

    return res.status(201).json({
      message: 'Asset created successfully',
      asset: data
    });

  } catch (error) {
    console.error('Create asset error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create asset'
    });
  }
}

/**
 * Get all assets
 */
export async function getAllAssets(req, res) {
  try {
    const { limit = 50, offset = 0, asset_type, search } = req.query;
    
    let query = supabaseAdmin
      .from('assets')
      .select('*, user_profiles!assets_created_by_fkey(full_name, email)', { count: 'exact' });

    // Filter by asset type
    if (asset_type) {
      query = query.eq('asset_type', asset_type);
    }

    // Search by name or registration
    if (search) {
      query = query.or(`asset_name.ilike.%${search}%,registration_number.ilike.%${search}%`);
    }

    // Role-based filtering
    if (req.userProfile.role === 'owner') {
      query = query.eq('owner_id', req.user.id);
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
      assets: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get assets error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch assets'
    });
  }
}

/**
 * Get asset by ID
 */
export async function getAssetById(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('assets')
      .select(`
        *,
        user_profiles!assets_created_by_fkey(full_name, email),
        asset_attachments(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Asset not found',
        message: 'The requested asset does not exist'
      });
    }

    return res.status(200).json({
      asset: data
    });

  } catch (error) {
    console.error('Get asset error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch asset'
    });
  }
}

/**
 * Update asset
 */
export async function updateAsset(req, res) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.created_at;
    delete updates.created_by;
    
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('assets')
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
      message: 'Asset updated successfully',
      asset: data
    });

  } catch (error) {
    console.error('Update asset error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update asset'
    });
  }
}

/**
 * Delete asset
 */
export async function deleteAsset(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({
        error: 'Delete failed',
        message: error.message
      });
    }

    return res.status(200).json({
      message: 'Asset deleted successfully'
    });

  } catch (error) {
    console.error('Delete asset error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete asset'
    });
  }
}

/**
 * Upload asset attachment
 */
export async function uploadAttachment(req, res) {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: 'No file provided',
        message: 'Please upload a file'
      });
    }

    // Check if asset exists
    const { data: asset, error: assetError } = await supabaseAdmin
      .from('assets')
      .select('id')
      .eq('id', id)
      .single();

    if (assetError || !asset) {
      return res.status(404).json({
        error: 'Asset not found',
        message: 'The specified asset does not exist'
      });
    }

    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `assets/${id}/${fileName}`;

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
      .from('asset_attachments')
      .insert([{
        asset_id: id,
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
    console.error('Upload attachment error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to upload attachment'
    });
  }
}

/**
 * Get asset attachments
 */
export async function getAttachments(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('asset_attachments')
      .select('*, user_profiles!asset_attachments_uploaded_by_fkey(full_name)')
      .eq('asset_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        error: 'Fetch failed',
        message: error.message
      });
    }

    return res.status(200).json({
      attachments: data
    });

  } catch (error) {
    console.error('Get attachments error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch attachments'
    });
  }
}

/**
 * Download asset attachment
 */
export async function downloadAttachment(req, res) {
  try {
    const { attachmentId } = req.params;

    // Get attachment record
    const { data: attachment, error } = await supabaseAdmin
      .from('asset_attachments')
      .select('*')
      .eq('id', attachmentId)
      .single();

    if (error || !attachment) {
      return res.status(404).json({
        error: 'Attachment not found',
        message: 'The requested attachment does not exist'
      });
    }

    // Create signed URL
    const { data: signedUrl, error: urlError } = await supabaseAdmin.storage
      .from('documents')
      .createSignedUrl(attachment.storage_path, 3600); // 1 hour expiry

    if (urlError) {
      return res.status(400).json({
        error: 'Failed to generate download link',
        message: urlError.message
      });
    }

    return res.status(200).json({
      download_url: signedUrl.signedUrl,
      file_name: attachment.file_name,
      expires_in: 3600
    });

  } catch (error) {
    console.error('Download attachment error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to download attachment'
    });
  }
}

/**
 * Delete asset attachment
 */
export async function deleteAttachment(req, res) {
  try {
    const { attachmentId } = req.params;

    // Get attachment record
    const { data: attachment, error: fetchError } = await supabaseAdmin
      .from('asset_attachments')
      .select('*')
      .eq('id', attachmentId)
      .single();

    if (fetchError || !attachment) {
      return res.status(404).json({
        error: 'Attachment not found',
        message: 'The requested attachment does not exist'
      });
    }

    // Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('documents')
      .remove([attachment.storage_path]);

    if (storageError) {
      console.warn('Storage delete warning:', storageError);
    }

    // Delete record
    const { error: deleteError } = await supabaseAdmin
      .from('asset_attachments')
      .delete()
      .eq('id', attachmentId);

    if (deleteError) {
      return res.status(400).json({
        error: 'Delete failed',
        message: deleteError.message
      });
    }

    return res.status(200).json({
      message: 'Attachment deleted successfully'
    });

  } catch (error) {
    console.error('Delete attachment error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete attachment'
    });
  }
}

/**
 * Get upcoming reminders for asset
 */
export async function getReminders(req, res) {
  try {
    const { id } = req.params;
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const { data: asset, error } = await supabaseAdmin
      .from('assets')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !asset) {
      return res.status(404).json({
        error: 'Asset not found',
        message: 'The requested asset does not exist'
      });
    }

    const reminders = [];

    // Check insurance expiry
    if (asset.insurance_expiry) {
      const expiryDate = new Date(asset.insurance_expiry);
      if (expiryDate <= thirtyDaysFromNow) {
        reminders.push({
          type: 'insurance_expiry',
          date: asset.insurance_expiry,
          days_remaining: Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)),
          urgent: expiryDate <= today
        });
      }
    }

    // Check ARC expiry
    if (asset.arc_expiry) {
      const expiryDate = new Date(asset.arc_expiry);
      if (expiryDate <= thirtyDaysFromNow) {
        reminders.push({
          type: 'arc_expiry',
          date: asset.arc_expiry,
          days_remaining: Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)),
          urgent: expiryDate <= today
        });
      }
    }

    // Check CofA expiry
    if (asset.cofa_expiry) {
      const expiryDate = new Date(asset.cofa_expiry);
      if (expiryDate <= thirtyDaysFromNow) {
        reminders.push({
          type: 'cofa_expiry',
          date: asset.cofa_expiry,
          days_remaining: Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)),
          urgent: expiryDate <= today
        });
      }
    }

    return res.status(200).json({
      asset_id: id,
      asset_name: asset.asset_name,
      reminders
    });

  } catch (error) {
    console.error('Get reminders error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch reminders'
    });
  }
}
