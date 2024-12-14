import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { updateEmail } from '../../services/auth/profileService';
import { validateEmail } from '../../utils/validation/authValidation';
import toast from 'react-hot-toast';

export default function EmailChangeForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    newEmail: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      validateEmail(formData.newEmail);
      await updateEmail(formData.newEmail, formData.password);
      toast.success('E-post uppdaterad! Kontrollera din inkorg för verifiering.');
      setFormData({ newEmail: '', password: '' });
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error(error instanceof Error ? error.message : 'Kunde inte uppdatera e-post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="current-email" className="block text-sm font-medium text-gray-700">
          Nuvarande E-post
        </label>
        <input
          type="email"
          id="current-email"
          value={user?.email || ''}
          disabled
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="new-email" className="block text-sm font-medium text-gray-700">
          Ny E-post
        </label>
        <input
          type="email"
          id="new-email"
          name="newEmail"
          value={formData.newEmail}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Bekräfta med Lösenord
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uppdaterar...
          </>
        ) : (
          'Uppdatera E-post'
        )}
      </button>
    </form>
  );
}