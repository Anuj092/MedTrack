/*
  # Create medications table

  1. New Tables
    - `medications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, medication name)
      - `dose` (text, dosage information)
      - `frequency_per_day` (integer, how many times per day)
      - `category` (text, medication category)
      - `family_member` (text, optional family member name)
      - `start_date` (date, when medication started)
      - `end_date` (date, optional end date)
      - `reminder_times` (text array, times for reminders)
      - `color` (text, color for UI display)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `medications` table
    - Add policies for authenticated users to manage their own medications
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create medications table
CREATE TABLE IF NOT EXISTS public.medications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  dose text NOT NULL,
  frequency_per_day integer NOT NULL,
  category text NOT NULL,
  family_member text,
  start_date date NOT NULL,
  end_date date,
  reminder_times text[] NOT NULL DEFAULT '{}',
  color text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for medications
CREATE POLICY "Users can view their own medications" 
  ON public.medications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medications" 
  ON public.medications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications" 
  ON public.medications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medications" 
  ON public.medications 
  FOR DELETE 
  USING (auth.uid() = user_id);