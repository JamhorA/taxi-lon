import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { updatePassword } from '../../services/auth/profileService';
import { validatePassword } from '../../utils/validation/authValidation';
import toast from 'react-hot-toast';

export default function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Nya lösenorden matchar inte');
      }

      validatePassword(newPassword);
      await updatePassword(currentPassword, newPassword);
      
      toast.success('Lösenord uppdaterat!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error instanceof Error ? error.message : 'Kunde inte uppdatera lösenord');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
          Nuvarande Lösenord
        </label>
        <input
          type="password"
          id="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
          Nytt Lösenord
        </label>
        <input
          type="password"
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
          Bekräfta Nytt Lösenord
        </label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="text-sm text-blue-700">
          <h4 className="font-medium">Lösenordskrav:</h4>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Minst 8 tecken</li>
            <li>Minst en stor bokstav</li>
            <li>Minst en liten bokstav</li>
            <li>Minst en siffra</li>
            <li>Minst ett specialtecken</li>
          </ul>
        </div>
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
          'Uppdatera Lösenord'
        )}
      </button>
    </form>
  );
}