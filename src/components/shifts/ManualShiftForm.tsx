import React, { useState } from 'react';
import { useCompany } from '../../hooks/useCompany';
import { supabase } from '../../lib/supabase';
import { saveShiftData } from '../../services/shifts';
import toast from 'react-hot-toast';
import BasicInfoForm from './forms/BasicInfoForm';
import FinancialDetailsForm from './forms/FinancialDetailsForm';
import VatDetailsForm from './forms/VatDetailsForm';

interface ManualShiftFormProps {
  onSuccess?: () => void;
}

export default function ManualShiftForm({ onSuccess }: ManualShiftFormProps) {
  const { companies } = useCompany();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    org_nr: '',
    regnr: '',
    forarid: '',
    starttid: '',
    sluttid: '',
    taxitrafik_km: 0,
    betalda_km: 0,
    turer: 0,
    drosknr: '',
    rapportnr: '',
    kontant_details: {
      kontant: 0,
      moms_details: []
    },
    kredit_details: {
      kredit: 0,
      moms_details: []
    },
    total_inkort_details: {
      total_inkort: 0,
      moms_details: []
    },
    varav_bom_avbest_details: {
      moms_details: []
    },
    lonegr_ex_moms: 0,
    kontant: 0,
    drikskredit: 0,
    att_redovisa: 0,
    total_kredit: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveShiftData(formData);
      toast.success('Skift har sparats');
      onSuccess?.();
    } catch (error) {
      console.error('Error saving shift:', error);
      toast.error('Kunde inte spara skiftet');
    }
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Lägg till nytt skift</h2>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center ${
                stepNumber < 3 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm">Grundinformation</span>
          <span className="text-sm">Ekonomiska Detaljer</span>
          <span className="text-sm">Momsdetaljer</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <BasicInfoForm
            data={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
          />
        )}

        {step === 2 && (
          <FinancialDetailsForm
            data={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {step === 3 && (
          <VatDetailsForm
            data={formData}
            onUpdate={updateFormData}
            onPrev={prevStep}
            onSubmit={handleSubmit}
          />
        )}
      </form>
    </div>
  );
}