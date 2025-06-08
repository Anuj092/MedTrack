import { useState, useEffect } from 'react';
import { Medication } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadMedications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error('Error loading medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMedication = async (medicationData: Omit<Medication, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('medications')
        .insert({
          ...medicationData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setMedications(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding medication:', error);
      throw error;
    }
  };

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setMedications(prev => prev.map(med => med.id === id ? data : med));
      return data;
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMedications(prev => prev.filter(med => med.id !== id));
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadMedications();
  }, [user]);

  return {
    medications,
    loading,
    addMedication,
    updateMedication,
    deleteMedication,
    refetch: loadMedications
  };
};