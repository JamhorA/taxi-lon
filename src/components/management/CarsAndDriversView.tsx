import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCompany } from '../../hooks/useCompany';
import toast from 'react-hot-toast';
import EditModal from './EditModal';

interface Car {
  id: string;
  regnr: string;
  drosknr: string;
}

interface Driver {
  id: string;
  name: string;
  forarid: string;
}

export default function CarsAndDriversView() {
  const [activeTab, setActiveTab] = useState<'cars' | 'drivers'>('cars');
  const [searchTerm, setSearchTerm] = useState('');
  const [cars, setCars] = useState<Car[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const { companies } = useCompany();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Car | Driver | null>(null);

  useEffect(() => {
    if (selectedCompany) {
      fetchData();
    }
  }, [selectedCompany, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'cars') {
        const { data, error } = await supabase
          .from('Cars')
          .select('*')
          .eq('company_id', selectedCompany)
          .order('drosknr', { ascending: true });
        
        if (error) throw error;
        setCars(data || []);
      } else {
        const { data, error } = await supabase
          .from('Drivers')
          .select('*')
          .eq('company_id', selectedCompany)
          .order('name', { ascending: true });
        
        if (error) throw error;
        setDrivers(data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Kunde inte hämta data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Car | Driver) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSave = async (formData: any) => {
    if (!editingItem || !selectedCompany) return;

    try {
      const table = activeTab === 'cars' ? 'Cars' : 'Drivers';
      let updateData;

      if (activeTab === 'cars') {
        if (!formData.regnr || !formData.drosknr) {
          toast.error('Registreringsnummer och drosknummer krävs');
          return;
        }
        updateData = {
          regnr: formData.regnr.trim().toUpperCase(),
          drosknr: formData.drosknr.trim()
        };
      } else {
        if (!formData.name || !formData.forarid) {
          toast.error('Namn och förar-ID krävs');
          return;
        }
        updateData = {
          name: formData.name.trim(),
          forarid: formData.forarid.trim()
        };
      }

      const { error: updateError } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', editingItem.id)
        .eq('company_id', selectedCompany);

      if (updateError) throw updateError;

      toast.success('Uppdateringen lyckades');
      await fetchData();
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating:', error);
      toast.error('Kunde inte uppdatera');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort detta?')) return;

    try {
      const { error } = await supabase
        .from(activeTab === 'cars' ? 'Cars' : 'Drivers')
        .delete()
        .eq('id', id)
        .eq('company_id', selectedCompany);

      if (error) throw error;
      
      toast.success('Borttaget');
      await fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Kunde inte ta bort');
    }
  };

  const getEditFields = () => {
    if (activeTab === 'cars') {
      return [
        { name: 'regnr', label: 'Registreringsnummer', type: 'text', value: (editingItem as Car)?.regnr || '' },
        { name: 'drosknr', label: 'Drosknummer', type: 'text', value: (editingItem as Car)?.drosknr || '' }
      ];
    } else {
      return [
        { name: 'name', label: 'Namn', type: 'text', value: (editingItem as Driver)?.name || '' },
        { name: 'forarid', label: 'Förar-ID', type: 'text', value: (editingItem as Driver)?.forarid || '' }
      ];
    }
  };

  const filteredData = activeTab === 'cars' 
    ? cars.filter(car => 
        car.regnr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.drosknr?.toString().includes(searchTerm)
      )
    : drivers.filter(driver =>
        driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.forarid?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="">Välj företag</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.name} ({company.org_nr})
            </option>
          ))}
        </select>

        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('cars')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'cars'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bilar
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'drivers'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Förare
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Sök..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-md"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Laddar...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {activeTab === 'cars' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reg.nr
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Drosknr
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Åtgärder
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((car: Car) => (
                  <tr key={car.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{car.regnr}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{car.drosknr}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(car)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Namn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Förar-ID
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Åtgärder
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((driver: Driver) => (
                  <tr key={driver.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{driver.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{driver.forarid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(driver)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(driver.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {isEditModalOpen && editingItem && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
          title={`Redigera ${activeTab === 'cars' ? 'Bil' : 'Förare'}`}
          fields={getEditFields()}
        />
      )}
    </div>
  );
}