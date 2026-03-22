import { body, validationResult } from 'express-validator';
import * as authService from '../services/authService.js';
import User from '../models/User.js';

export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
];

export async function register(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password, firstName, lastName } = req.body;
    const result = await authService.register({ email, password, firstName, lastName });
    return res.status(201).json(result);
  } catch (err) {
    if (err.message === 'Email already registered') {
      return res.status(409).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Registration failed' });
  }
}

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.json(result);
  } catch (err) {
    if (err.message === 'Invalid email or password') {
      return res.status(401).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Login failed' });
  }
}

export async function refresh(req, res) {
  try {
    const token = req.body.refreshToken || req.body.refresh;
    const result = await authService.refresh(token);
    return res.json(result);
  } catch (err) {
    return res.status(401).json({ message: err.message || 'Invalid refresh token' });
  }
}

export async function logout(req, res) {
  try {
    await authService.logout(req.userId);
    return res.json({ message: 'Logged out' });
  } catch (err) {
    return res.status(500).json({ message: 'Logout failed' });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.userId).select('-passwordHash -emailVerifyToken -resetPasswordToken -refreshToken');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to get profile' });
  }
}
