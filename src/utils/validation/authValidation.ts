import { z } from 'zod';
import { AUTH_ERRORS } from '../../constants/auth';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const emailSchema = z.string().email('Invalid email format');

export function validatePassword(password: string): void {
  try {
    passwordSchema.parse(password);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
}

export function validateEmail(email: string): void {
  try {
    emailSchema.parse(email);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
}

export function validateAuthCredentials(email: string, password: string): void {
  validateEmail(email);
  validatePassword(password);
}