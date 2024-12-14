import { useState, useEffect, useCallback } from 'react';
import { UserWithRole } from '../types/user';
import { getUsers, updateStatus } from '../services/userService';
import toast from 'react-hot-toast';

export function useUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    const toastId = toast.loading('Updating user status...');
    try {
      await updateStatus(userId, isActive);
      await fetchUsers();
      toast.success('User status updated successfully', { id: toastId });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user status';
      toast.error(message, { id: toastId });
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, fetchUsers, updateUserStatus };
}