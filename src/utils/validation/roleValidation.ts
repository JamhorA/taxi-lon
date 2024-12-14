import { z } from 'zod';

export const roleSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum(['admin', 'user']),
  company_id: z.string().uuid().nullable(),
  is_active: z.boolean(),
  created_at: z.string().datetime()
});

export function validateRole(role: unknown): boolean {
  try {
    roleSchema.parse(role);
    return true;
  } catch {
    return false;
  }
}

export function validateRoleUpdate(role: string): boolean {
  return ['admin', 'user'].includes(role);
}