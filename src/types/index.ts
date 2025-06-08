export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dose: string;
  frequency_per_day: number;
  category: string;
  family_member?: string;
  start_date: string;
  end_date?: string;
  reminder_times: string[];
  color: string;
  created_at: string;
}

export interface DoseLog {
  id: string;
  medication_id: string;
  scheduled_time: string;
  taken_time?: string;
  status: 'taken' | 'missed' | 'late';
  created_at: string;
}

export interface AdherenceStats {
  overall_percentage: number;
  weekly_percentage: number;
  streak_days: number;
  total_doses: number;
  taken_doses: number;
  missed_doses: number;
}

export interface Reminder {
  id: string;
  medication_id: string;
  time: string;
  is_active: boolean;
}