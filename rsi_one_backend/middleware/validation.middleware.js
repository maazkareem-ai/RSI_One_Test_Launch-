import { USER_ROLES } from '../config/constants.js';

export function validateSignup(req, res, next) {
  const { email, password, full_name, role } = req.body || {};

  if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email', message: 'Please provide a valid email address' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Invalid password', message: 'Password must be at least 6 characters' });
  }

  if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
    return res.status(400).json({ error: 'Invalid full_name', message: 'Full name is required' });
  }

  // If role provided, ensure it's valid; otherwise defaulting is handled in controller
  if (role && !Object.values(USER_ROLES).includes(role)) {
    return res.status(400).json({ error: 'Invalid role', message: `Role must be one of: ${Object.values(USER_ROLES).join(', ')}` });
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing credentials', message: 'Email and password are required' });
  }
  next();
}
