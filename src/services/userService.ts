import { supabase } from '../lib/supabase';
import { UserWithRole } from '../types/user';
import { handleError } from '../utils/error';
import { transformUserData } from '../utils/transforms/userTransforms';

export async function getUsers(): Promise<UserWithRole[]> {
  try {
    const { data, error } = await supabase
      .from('user_roles_with_email')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users with roles:', error);
      throw error;
    }

    return data.map(transformUserData);
  } catch (error) {
    throw handleError(error, 'Failed to fetch users');
  }
}

export async function updateStatus(userId: string, isActive: boolean): Promise<void> {
  try {
    const { data, error } = await supabase.rpc('update_user_status', {
      target_user_id: userId,
      new_status: isActive,
    });

    if (error) {
      console.error('RPC Error:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Failed to update user status: RPC returned no data');
    }
  } catch (error) {
    throw handleError(error, 'Failed to update user status');
  }
}



// export async function updateUserStatus(userId: string, isActive: boolean): Promise<void> {
//   try {
//     const { error } = await supabase
//       .from('User_Roles')
//       .update({ is_active: isActive })
//       .eq('user_id', userId);

//     if (error) throw error;
//   } catch (error) {
//     throw handleError(error, 'Failed to update user status');
//   }
// }

export async function checkAdminStatus(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_admin_base');
    if (error) throw error;
    return !!data;
  } catch (error) {
    throw handleError(error, 'Failed to check admin status');
  }
}