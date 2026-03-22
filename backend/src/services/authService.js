import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from 'config';
import User from '../models/User.js';

const accessSecret = process.env.JWT_ACCESS_SECRET || config.get('jwt.accessSecret');
const refreshSecret = process.env.JWT_REFRESH_SECRET || config.get('jwt.refreshSecret');
const accessExpires = process.env.JWT_ACCESS_EXPIRES || config.get('jwt.accessExpiresIn');
const refreshExpires = process.env.JWT_REFRESH_EXPIRES || config.get('jwt.refreshExpiresIn');

export async function register({ email, password, firstName, lastName }) {
  const existing = await User.findOne({ email }).select('_id');
  if (existing) throw new Error('Email already registered');
  const passwordHash = await bcrypt.hash(password, 12);
  const emailVerifyToken = crypto.randomBytes(32).toString('hex');
  const user = await User.create({
    email,
    passwordHash,
    firstName,
    lastName,
    emailVerifyToken,
    emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000,
  });
  // TODO: send verification email with link containing emailVerifyToken
  return { user: toUserResponse(user), message: 'Check your email to verify your account' };
}

export function toUserResponse(user) {
  const u = user.toObject ? user.toObject() : user;
  delete u.passwordHash;
  delete u.emailVerifyToken;
  delete u.resetPasswordToken;
  delete u.refreshToken;
  return u;
}

export async function login(email, password) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw new Error('Invalid email or password');
  const ok = await user.comparePassword(password);
  if (!ok) throw new Error('Invalid email or password');
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    accessSecret,
    { expiresIn: accessExpires }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, type: 'refresh' },
    refreshSecret,
    { expiresIn: refreshExpires }
  );
  await User.updateOne({ _id: user._id }, { refreshToken });
  return {
    message: 'Login successful',
    accessToken,
    refreshToken,
    expiresIn: accessExpires,
    user: toUserResponse(user),
  };
}

export async function refresh(refreshToken) {
  if (!refreshToken) throw new Error('Refresh token required');
  const decoded = jwt.verify(refreshToken, refreshSecret);
  if (decoded.type !== 'refresh') throw new Error('Invalid token');
  const user = await User.findById(decoded.userId).select('role refreshToken');
  if (!user || user.refreshToken !== refreshToken) throw new Error('Invalid token');
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    accessSecret,
    { expiresIn: accessExpires }
  );
  return { accessToken, expiresIn: accessExpires };
}

export async function logout(userId) {
  await User.updateOne({ _id: userId }, { $unset: { refreshToken: 1 } });
}
