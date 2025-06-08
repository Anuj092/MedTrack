/*
  # Create dose logs table

  1. New Tables
    - `dose_logs`
      - `id` (uuid, primary key)
      - `medication_id` (uuid, foreign key to medications)
      - `scheduled_time` (timestamp, when dose was scheduled)
      - `taken_time` (timestamp, when dose was actually taken)
      - `status` (text, 'taken', 'missed', or 'late')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `dose_logs` table
    - Add policies for users to manage dose logs for their own medications
*/

-- Create dose_logs table
CREATE TABLE IF NOT EXISTS public.dose_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id uuid REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  scheduled_time timestamp with time zone NOT NULL,
  taken_time timestamp with time zone,
  status text NOT NULL CHECK (status IN ('taken', 'missed', 'late')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.dose_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for dose_logs
CREATE POLICY "Users can view their own dose logs" 
  ON public.dose_logs 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.medications 
    WHERE id = medication_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own dose logs" 
  ON public.dose_logs 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.medications 
    WHERE id = medication_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own dose logs" 
  ON public.dose_logs 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.medications 
    WHERE id = medication_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own dose logs" 
  ON public.dose_logs 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.medications 
    WHERE id = medication_id AND user_id = auth.uid()
  ));