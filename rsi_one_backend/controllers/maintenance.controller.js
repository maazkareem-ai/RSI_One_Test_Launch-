import { supabaseAdmin } from '../config/supabase.js';
import { MAINTENANCE_TYPES } from '../config/constants.js';

/**
 * Create maintenance log
 */
export async function createMaintenanceLog(req, res) {
  try {
    const {
      asset_id,
      maintenance_type,
      maintenance_date,
      flight_hours_at_maintenance,
      cycles_at_maintenance,
      next_due_hours,
      next_due_cycles,
      next_due_date,
      components_replaced,
      technician_name,
      technician_license,
      cost,
      vendor,
      description,
      notes
    } = req.body;

    if (!asset_id || !maintenance_type || !maintenance_date) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'asset_id, maintenance_type, and maintenance_date are required'
      });
    }

    if (!Object.values(MAINTENANCE_TYPES).includes(maintenance_type)) {
      return res.status(400).json({
        error: 'Invalid maintenance type',
        message: `Maintenance type must be one of: ${Object.values(MAINTENANCE_TYPES).join(', ')}`
      });
    }

    const { data, error } = await supabaseAdmin
      .from('maintenance_logs')
      .insert([{
        asset_id,
        maintenance_type,
        maintenance_date,
        flight_hours_at_maintenance,
        cycles_at_maintenance,
        next_due_hours,
        next_due_cycles,
        next_due_date,
        components_replaced,
        technician_name,
        technician_license,
        cost,
        vendor,
        description,
        notes,
        created_by: req.user.id
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Maintenance log creation failed',
        message: error.message
      });
    }

    return res.status(201).json({
      message: 'Maintenance log created successfully',
      maintenance_log: data
    });

  } catch (error) {
    console.error('Create maintenance log error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create maintenance log'
    });
  }
}

/**
 * Get all maintenance logs
 */
export async function getAllMaintenanceLogs(req, res) {
  try {
    const { limit = 50, offset = 0, asset_id, maintenance_type, start_date, end_date } = req.query;
    
    let query = supabaseAdmin
      .from('maintenance_logs')
      .select(`
        *,
        assets(asset_name, registration_number),
        user_profiles!maintenance_logs_created_by_fkey(full_name)
      `, { count: 'exact' });

    if (asset_id) {
      query = query.eq('asset_id', asset_id);
    }

    if (maintenance_type) {
      query = query.eq('maintenance_type', maintenance_type);
    }

    if (start_date) {
      query = query.gte('maintenance_date', start_date);
    }

    if (end_date) {
      query = query.lte('maintenance_date', end_date);
    }

    const { data, error, count } = await query
      .order('maintenance_date', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      return res.status(400).json({
        error: 'Fetch failed',
        message: error.message
      });
    }

    return res.status(200).json({
      maintenance_logs: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get maintenance logs error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch maintenance logs'
    });
  }
}

/**
 * Get maintenance log by ID
 */
export async function getMaintenanceLogById(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('maintenance_logs')
      .select(`
        *,
        assets(asset_name, registration_number, asset_type, total_flight_hours, total_cycles),
        user_profiles!maintenance_logs_created_by_fkey(full_name, email)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Maintenance log not found',
        message: 'The requested maintenance log does not exist'
      });
    }

    return res.status(200).json({
      maintenance_log: data
    });

  } catch (error) {
    console.error('Get maintenance log error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch maintenance log'
    });
  }
}

/**
 * Update maintenance log
 */
export async function updateMaintenanceLog(req, res) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    delete updates.id;
    delete updates.created_at;
    delete updates.created_by;
    
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('maintenance_logs')
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
      message: 'Maintenance log updated successfully',
      maintenance_log: data
    });

  } catch (error) {
    console.error('Update maintenance log error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update maintenance log'
    });
  }
}

/**
 * Delete maintenance log
 */
export async function deleteMaintenanceLog(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('maintenance_logs')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({
        error: 'Delete failed',
        message: error.message
      });
    }

    return res.status(200).json({
      message: 'Maintenance log deleted successfully'
    });

  } catch (error) {
    console.error('Delete maintenance log error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete maintenance log'
    });
  }
}

/**
 * Get overdue maintenance
 */
export async function getOverdueMaintenance(req, res) {
  try {
    const { asset_id } = req.query;
    const today = new Date().toISOString().split('T')[0];

    let query = supabaseAdmin
      .from('maintenance_logs')
      .select(`
        *,
        assets(asset_name, registration_number, total_flight_hours, total_cycles)
      `)
      .not('next_due_date', 'is', null);

    if (asset_id) {
      query = query.eq('asset_id', asset_id);
    }

    const { data, error } = await query.order('next_due_date', { ascending: true });

    if (error) {
      return res.status(400).json({
        error: 'Fetch failed',
        message: error.message
      });
    }

    // Filter overdue items
    const overdue = data.filter(log => {
      const dueDate = new Date(log.next_due_date);
      const todayDate = new Date(today);
      
      // Check date
      if (dueDate < todayDate) return true;
      
      // Check hours
      if (log.next_due_hours && log.assets.total_flight_hours >= log.next_due_hours) return true;
      
      // Check cycles
      if (log.next_due_cycles && log.assets.total_cycles >= log.next_due_cycles) return true;
      
      return false;
    });

    return res.status(200).json({
      overdue_count: overdue.length,
      overdue_maintenance: overdue
    });

  } catch (error) {
    console.error('Get overdue maintenance error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch overdue maintenance'
    });
  }
}

/**
 * Get upcoming maintenance
 */
export async function getUpcomingMaintenance(req, res) {
  try {
    const { asset_id, days = 30 } = req.query;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    let query = supabaseAdmin
      .from('maintenance_logs')
      .select(`
        *,
        assets(asset_name, registration_number, total_flight_hours, total_cycles)
      `)
      .not('next_due_date', 'is', null)
      .gte('next_due_date', today.toISOString().split('T')[0])
      .lte('next_due_date', futureDate.toISOString().split('T')[0]);

    if (asset_id) {
      query = query.eq('asset_id', asset_id);
    }

    const { data, error } = await query.order('next_due_date', { ascending: true });

    if (error) {
      return res.status(400).json({
        error: 'Fetch failed',
        message: error.message
      });
    }

    return res.status(200).json({
      upcoming_count: data.length,
      days_range: parseInt(days),
      upcoming_maintenance: data
    });

  } catch (error) {
    console.error('Get upcoming maintenance error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch upcoming maintenance'
    });
  }
}

/**
 * Predict next maintenance (AI simulation)
 */
export async function predictMaintenance(req, res) {
  try {
    const { asset_id } = req.params;

    // Get asset details
    const { data: asset, error: assetError } = await supabaseAdmin
      .from('assets')
      .select('*')
      .eq('id', asset_id)
      .single();

    if (assetError || !asset) {
      return res.status(404).json({
        error: 'Asset not found',
        message: 'The specified asset does not exist'
      });
    }

    // Get maintenance history
    const { data: history } = await supabaseAdmin
      .from('maintenance_logs')
      .select('*')
      .eq('asset_id', asset_id)
      .order('maintenance_date', { ascending: false })
      .limit(10);

    // Simple prediction algorithm (can be replaced with actual AI model)
    const predictions = [];
    
    if (history && history.length > 0) {
      const avgInterval = 100; // Default 100 hours between maintenance
      const currentHours = asset.total_flight_hours || 0;
      
      predictions.push({
        maintenance_type: 'a_check',
        predicted_hours: currentHours + avgInterval,
        predicted_cycles: (asset.total_cycles || 0) + 50,
        predicted_date: estimateDate(avgInterval, 5), // 5 hours per day average
        confidence: 0.85
      });
    }

    return res.status(200).json({
      asset_id,
      current_hours: asset.total_flight_hours,
      current_cycles: asset.total_cycles,
      predictions
    });

  } catch (error) {
    console.error('Predict maintenance error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to predict maintenance'
    });
  }
}

/**
 * Helper to estimate future date
 */
function estimateDate(hoursUntil, avgHoursPerDay) {
  const daysUntil = Math.ceil(hoursUntil / avgHoursPerDay);
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysUntil);
  return futureDate.toISOString().split('T')[0];
}
