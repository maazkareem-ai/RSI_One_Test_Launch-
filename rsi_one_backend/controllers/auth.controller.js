import { supabaseAdmin } from '../config/supabase.js';
import { USER_ROLES } from '../config/constants.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

/**
 * Register new user
 */
export async function register(req, res) {
  try {
    const { email, password, full_name, role, phone_number } = req.body;

    // Validate required fields
    if (!email || !password || !full_name || !role) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, password, full_name, and role are required'
      });
    }

    // Validate role
    if (!Object.values(USER_ROLES).includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: `Role must be one of: ${Object.values(USER_ROLES).join(', ')}`
      });
    }

    // Create user in Supabase Auth
    let authData;
    let authError;

    try {
      const result = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
          role
        }
      });
      authData = result.data;
      authError = result.error;
    } catch (error) {
      authError = error;
    }

    if (authError) {
      // Check if user already exists
      if (authError.message?.includes('already been registered') || authError.code === 'email_exists') {
        console.log('User already exists in Auth, checking for profile...');
        
        // Check if they have a profile
        const { data: existingProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (existingProfile) {
          // User exists with profile, return error
          return res.status(400).json({
            error: 'Registration failed',
            message: 'A user with this email address has already been registered'
          });
        } else {
          // Orphaned Auth user, clean it up and retry
          console.log('Found orphaned Auth user, cleaning up...');
          try {
            // Find the user by email
            const { data: users } = await supabaseAdmin.auth.admin.listUsers();
            const existingUser = users.users.find(u => u.email === email);
            
            if (existingUser) {
              await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
              console.log('Cleaned up orphaned Auth user');
            }
          } catch (cleanupError) {
            console.error('Error cleaning up orphaned user:', cleanupError);
          }

          // Retry creating the user
          try {
            const retryResult = await supabaseAdmin.auth.admin.createUser({
              email,
              password,
              email_confirm: true,
              user_metadata: {
                full_name,
                role
              }
            });
            authData = retryResult.data;
            authError = retryResult.error;
          } catch (retryError) {
            authError = retryError;
          }

          if (authError) {
            console.error('Auth createUser error after cleanup:', authError);
            return res.status(400).json({
              error: 'Registration failed',
              message: authError.message || JSON.stringify(authError)
            });
          }
        }
      } else {
        console.error('Auth createUser error:', authError);
        return res.status(400).json({
          error: 'Registration failed',
          message: authError.message || JSON.stringify(authError)
        });
      }
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        email,
        full_name,
        role,
        phone_number: phone_number || null,
        is_active: true
      }])
      .select()
      .single();

    if (profileError) {
      // Log full profile error for debugging, then rollback
      console.error('Profile creation error:', profileError);
      // Rollback: delete auth user if profile creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (delErr) {
        console.error('Error deleting auth user during rollback:', delErr);
      }
      return res.status(400).json({
        error: 'Profile creation failed',
        message: profileError.message || JSON.stringify(profileError)
      });
    }

    // Log activity
    await supabaseAdmin
      .from('user_activity_logs')
      .insert([{
        user_id: authData.user.id,
        action: 'register',
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      }]);

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        profile
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to register user'
    });
  }
}

/**
 * Login user
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        error: 'Login failed',
        message: error.message
      });
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'User profile does not exist'
      });
    }

    // Check if user is active
    if (!profile.is_active) {
      return res.status(403).json({
        error: 'Account disabled',
        message: 'Your account has been deactivated'
      });
    }

    // Log activity
    await supabaseAdmin
      .from('user_activity_logs')
      .insert([{
        user_id: data.user.id,
        action: 'login',
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      }]);

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        profile
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        expires_at: data.session.expires_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to login'
    });
  }
}

/**
 * Logout user
 */
export async function logout(req, res) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      // Log activity before logout
      await supabaseAdmin
        .from('user_activity_logs')
        .insert([{
          user_id: req.user.id,
          action: 'logout',
          ip_address: req.ip,
          user_agent: req.headers['user-agent']
        }]);

      // Sign out
      await supabaseAdmin.auth.admin.signOut(token);
    }

    return res.status(200).json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to logout'
    });
  }
}

/**
 * Get current user profile
 */
export async function getProfile(req, res) {
  try {
    return res.status(200).json({
      user: req.user,
      profile: req.userProfile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch profile'
    });
  }
}

/**
 * Update user profile
 */
export async function updateProfile(req, res) {
  try {
    const { full_name, phone_number, avatar_url } = req.body;
    const userId = req.user.id;

    const updates = {};
    if (full_name) updates.full_name = full_name;
    if (phone_number) updates.phone_number = phone_number;
    if (avatar_url) updates.avatar_url = avatar_url;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Update failed',
        message: error.message
      });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile: data
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update profile'
    });
  }
}

/**
 * Get user activity logs
 */
export async function getActivityLogs(req, res) {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const { data, error, count } = await supabaseAdmin
      .from('user_activity_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(400).json({
        error: 'Fetch failed',
        message: error.message
      });
    }

    return res.status(200).json({
      logs: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get activity logs error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch activity logs'
    });
  }
}

/**
 * Delete user account (deletes both Auth user and profile)
 */
export async function deleteUser(req, res) {
  try {
    const userId = req.user.id; // From authenticated token

    // First, delete the profile (RLS disabled, so service_role can delete)
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Profile deletion error:', profileError);
      return res.status(400).json({
        error: 'Profile deletion failed',
        message: profileError.message
      });
    }

    // Then delete from Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Auth deletion error:', authError);
      // Profile is already deleted, but Auth failed - this is bad state
      // In production, you might want to restore the profile or handle this differently
      return res.status(400).json({
        error: 'Auth deletion failed',
        message: authError.message
      });
    }

    // Log the deletion
    console.log(`User ${userId} deleted successfully`);

    return res.status(200).json({
      message: 'User account deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete user account'
    });
  }
}

/**
 * Request OTP for forgot password
 */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Missing email',
        message: 'Email is required'
      });
    }

    // Find user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        message: 'If an account with this email exists, a password reset OTP has been sent.'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP for storage
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to database
    const { error: otpError } = await supabaseAdmin
      .from('otp')
      .insert([{
        user_id: user.id,
        otp: hashedOtp,
        expires_at: expiresAt.toISOString()
      }]);

    if (otpError) {
      console.error('OTP save error:', otpError);
      return res.status(500).json({
        error: 'Failed to generate OTP',
        message: 'Please try again later'
      });
    }

    // Send OTP via email
    const smtpPort = parseInt(process.env.EMAIL_PORT || '465');
    const smtpSecure = process.env.EMAIL_SECURE === 'true' || smtpPort === 465; // force secure for SSL port

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // For development - remove in production
      }
    });

    const mailOptions = {
      from: `"RSI One" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - RSI One',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested a password reset for your RSI One account.</p>
          <p>Your OTP (One-Time Password) is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #333; letter-spacing: 3px;">${otp}</span>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>RSI One Team</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${email}`);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't return error to user for security reasons
    }

    return res.status(200).json({
      message: 'If an account with this email exists, a password reset OTP has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process password reset request'
    });
  }
}

/**
 * Reset password with OTP
 */
export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        error: 'Missing fields',
        message: 'Email, OTP, and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Invalid email or OTP'
      });
    }

    // Find valid OTP
    const { data: otpRecord, error: otpError } = await supabaseAdmin
      .from('otp')
      .select('*')
      .eq('user_id', user.id)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpRecord) {
      return res.status(400).json({
        error: 'Invalid OTP',
        message: 'OTP not found or already used'
      });
    }

    // Check if OTP is expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({
        error: 'Expired OTP',
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValidOtp) {
      return res.status(400).json({
        error: 'Invalid OTP',
        message: 'Incorrect OTP. Please try again.'
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password in Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword // Supabase will hash it internally
    });

    if (authError) {
      console.error('Auth password update error:', authError);
      return res.status(500).json({
        error: 'Password update failed',
        message: 'Failed to update password'
      });
    }

    // Mark OTP as used
    await supabaseAdmin
      .from('otp')
      .update({ used: true })
      .eq('id', otpRecord.id);

    // Log the password reset
    await supabaseAdmin
      .from('user_activity_logs')
      .insert([{
        user_id: user.id,
        action: 'password_reset',
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      }]);

    return res.status(200).json({
      message: 'Password reset successful. You can now log in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to reset password'
    });
  }
}
