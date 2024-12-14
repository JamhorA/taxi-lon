import { supabase } from '../../lib/supabase';
import { AuthError } from '../../types/auth';
import { AUTH_ERRORS } from '../../constants/auth';
import { validateAuthCredentials } from '../../utils/validation/authValidation';

export async function signIn(email: string, password: string): Promise<void> {
  try {
    validateAuthCredentials(email, password);

    const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;
    if (!session?.user) throw new Error(AUTH_ERRORS.SIGNIN_FAILED);

    // Check user role and status using the view
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles_with_email')
      .select('is_active')
      .eq('user_id', session.user.id)
      .single();

    if (roleError) throw roleError;
    if (!userRole?.is_active) {
      await supabase.auth.signOut();
      throw new Error(AUTH_ERRORS.INACTIVE_ACCOUNT);
    }
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signUp(email: string, password: string): Promise<void> {
  try {
    validateAuthCredentials(email, password);

    // Check if first user using the view
    const { data: existingUsers } = await supabase
      .from('user_roles_with_email')
      .select('id')
      .limit(1);

    const isFirstUser = !existingUsers || existingUsers.length === 0;

    // Create auth user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;
    if (!user) throw new Error(AUTH_ERRORS.SIGNUP_FAILED);

    // Create user role
    const { error: roleError } = await supabase
      .from('User_Roles')
      .insert({
        user_id: user.id,
        role: isFirstUser ? 'admin' : 'user',
        is_active: isFirstUser
      });

    if (roleError) throw roleError;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}