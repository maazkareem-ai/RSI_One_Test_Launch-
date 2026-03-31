import { supabaseAdmin } from '../config/supabase.js';

/**
 * Create flight log
 */
export async function createFlightLog(req, res) {
  try {
    const {
      asset_id,
      flight_date,
      departure_icao,
      arrival_icao,
      flight_hours,
      cycles,
      fuel_consumed,
      notes
    } = req.body;

    if (!asset_id || !flight_date || !flight_hours) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'asset_id, flight_date, and flight_hours are required'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('flight_logs')
      .insert([{
        asset_id,
        pilot_id: req.user.id,
        flight_date,
        departure_icao,
        arrival_icao,
        flight_hours,
        cycles: cycles || 1,
        fuel_consumed,
        notes,
        created_by: req.user.id
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Flight log creation failed',
        message: error.message
      });
    }

    // Update asset total hours and cycles
    await updateAssetTotals(asset_id);

    return res.status(201).json({
      message: 'Flight log created successfully',
      flight_log: data
    });

  } catch (error) {
    console.error('Create flight log error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create flight log'
    });
  }
}

/**
 * Get all flight logs
 */
export async function getAllFlightLogs(req, res) {
  try {
    const { limit = 50, offset = 0, asset_id, start_date, end_date } = req.query;
    
    let query = supabaseAdmin
      .from('flight_logs')
      .select(`
        *,
        assets(asset_name, registration_number),
        user_profiles!flight_logs_pilot_id_fkey(full_name)
      `, { count: 'exact' });

    if (asset_id) {
      query = query.eq('asset_id', asset_id);
    }

    if (start_date) {
      query = query.gte('flight_date', start_date);
    }

    if (end_date) {
      query = query.lte('flight_date', end_date);
    }

    const { data, error, count } = await query
      .order('flight_date', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      return res.status(400).json({
        error: 'Fetch failed',
        message: error.message
      });
    }

    return res.status(200).json({
      flight_logs: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get flight logs error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch flight logs'
    });
  }
}

/**
 * Get flight log by ID
 */
export async function getFlightLogById(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('flight_logs')
      .select(`
        *,
        assets(asset_name, registration_number, asset_type),
        user_profiles!flight_logs_pilot_id_fkey(full_name, email)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Flight log not found',
        message: 'The requested flight log does not exist'
      });
    }

    return res.status(200).json({
      flight_log: data
    });

  } catch (error) {
    console.error('Get flight log error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch flight log'
    });
  }
}

/**
 * Update flight log
 */
export async function updateFlightLog(req, res) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    delete updates.id;
    delete updates.created_at;
    delete updates.created_by;
    
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('flight_logs')
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

    // Recalculate asset totals
    if (data.asset_id) {
      await updateAssetTotals(data.asset_id);
    }

    return res.status(200).json({
      message: 'Flight log updated successfully',
      flight_log: data
    });

  } catch (error) {
    console.error('Update flight log error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update flight log'
    });
  }
}

/**
 * Delete flight log
 */
export async function deleteFlightLog(req, res) {
  try {
    const { id } = req.params;

    // Get asset_id before deletion
    const { data: log } = await supabaseAdmin
      .from('flight_logs')
      .select('asset_id')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('flight_logs')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({
        error: 'Delete failed',
        message: error.message
      });
    }

    // Recalculate asset totals
    if (log?.asset_id) {
      await updateAssetTotals(log.asset_id);
    }

    return res.status(200).json({
      message: 'Flight log deleted successfully'
    });

  } catch (error) {
    console.error('Delete flight log error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete flight log'
    });
  }
}

/**
 * Upload CSV flight logs
 */
export async function uploadCSV(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: 'No file provided',
        message: 'Please upload a CSV file'
      });
    }

    // Parse CSV
    const csvData = file.buffer.toString('utf-8');
    const rows = csvData.split('\n').map(row => row.split(','));
    
    // Skip header row
    const headers = rows[0].map(h => h.trim().toLowerCase());
    const logs = [];

    for (let i = 1; i < rows.length; i++) {
      if (rows[i].length < headers.length) continue;
      
      const log = {};
      headers.forEach((header, index) => {
        log[header] = rows[i][index]?.trim();
      });

      if (log.asset_id && log.flight_date && log.flight_hours) {
        logs.push({
          asset_id: log.asset_id,
          pilot_id: req.user.id,
          flight_date: log.flight_date,
          departure_icao: log.departure_icao || null,
          arrival_icao: log.arrival_icao || null,
          flight_hours: parseFloat(log.flight_hours),
          cycles: parseInt(log.cycles) || 1,
          fuel_consumed: parseFloat(log.fuel_consumed) || null,
          notes: log.notes || null,
          created_by: req.user.id
        });
      }
    }

    if (logs.length === 0) {
      return res.status(400).json({
        error: 'No valid logs found',
        message: 'CSV must contain asset_id, flight_date, and flight_hours'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('flight_logs')
      .insert(logs)
      .select();

    if (error) {
      return res.status(400).json({
        error: 'CSV import failed',
        message: error.message
      });
    }

    // Update asset totals for all affected assets
    const assetIds = [...new Set(logs.map(l => l.asset_id))];
    for (const assetId of assetIds) {
      await updateAssetTotals(assetId);
    }

    return res.status(201).json({
      message: 'CSV imported successfully',
      imported_count: data.length,
      flight_logs: data
    });

  } catch (error) {
    console.error('Upload CSV error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to import CSV'
    });
  }
}

/**
 * Get asset utilization statistics
 */
export async function getAssetUtilization(req, res) {
  try {
    const { asset_id, start_date, end_date } = req.query;

    if (!asset_id) {
      return res.status(400).json({
        error: 'Missing asset_id',
        message: 'asset_id query parameter is required'
      });
    }

    let query = supabaseAdmin
      .from('flight_logs')
      .select('flight_hours, cycles, fuel_consumed, flight_date')
      .eq('asset_id', asset_id);

    if (start_date) {
      query = query.gte('flight_date', start_date);
    }

    if (end_date) {
      query = query.lte('flight_date', end_date);
    }

    const { data, error } = await query.order('flight_date', { ascending: true });

    if (error) {
      return res.status(400).json({
        error: 'Fetch failed',
        message: error.message
      });
    }

    // Calculate statistics
    const totalFlightHours = data.reduce((sum, log) => sum + (log.flight_hours || 0), 0);
    const totalCycles = data.reduce((sum, log) => sum + (log.cycles || 0), 0);
    const totalFuel = data.reduce((sum, log) => sum + (log.fuel_consumed || 0), 0);
    const avgFlightHours = data.length > 0 ? totalFlightHours / data.length : 0;

    return res.status(200).json({
      asset_id,
      period: {
        start: start_date || 'inception',
        end: end_date || 'now'
      },
      statistics: {
        total_flights: data.length,
        total_flight_hours: totalFlightHours.toFixed(2),
        total_cycles: totalCycles,
        total_fuel_consumed: totalFuel.toFixed(2),
        average_flight_hours: avgFlightHours.toFixed(2)
      },
      logs: data
    });

  } catch (error) {
    console.error('Get utilization error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch utilization data'
    });
  }
}

/**
 * Helper function to update asset totals
 */
async function updateAssetTotals(assetId) {
  try {
    const { data: logs } = await supabaseAdmin
      .from('flight_logs')
      .select('flight_hours, cycles')
      .eq('asset_id', assetId);

    const totalHours = logs.reduce((sum, log) => sum + (log.flight_hours || 0), 0);
    const totalCycles = logs.reduce((sum, log) => sum + (log.cycles || 0), 0);

    await supabaseAdmin
      .from('assets')
      .update({
        total_flight_hours: totalHours,
        total_cycles: totalCycles,
        updated_at: new Date().toISOString()
      })
      .eq('id', assetId);

  } catch (error) {
    console.error('Update asset totals error:', error);
  }
}
