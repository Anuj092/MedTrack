import { useState, useEffect } from 'react';
import { DoseLog } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const useDoseLogs = () => {
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadDoseLogs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('dose_logs')
        .select(`
          *,
          medications (
            name,
            dose,
            color
          )
        `)
        .order('scheduled_time', { ascending: false });

      if (error) throw error;
      setDoseLogs(data || []);
    } catch (error) {
      console.error('Error loading dose logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const logDose = async (medicationId: string, scheduledTime: string, status: 'taken' | 'missed' | 'late') => {
    try {
      const { data, error } = await supabase
        .from('dose_logs')
        .insert({
          medication_id: medicationId,
          scheduled_time: scheduledTime,
          taken_time: status === 'taken' ? new Date().toISOString() : null,
          status,
        })
        .select()
        .single();

      if (error) throw error;
      setDoseLogs(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error logging dose:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadDoseLogs();
  }, [user]);

  return {
    doseLogs,
    loading,
    logDose,
    refetch: loadDoseLogs
  };
};