-- =============================================
-- Eng4IT IELTS — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Vocabulary Progress (SRS)
CREATE TABLE vocabulary_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  word_id TEXT NOT NULL,
  ease_factor FLOAT DEFAULT 2.5,
  interval INTEGER DEFAULT 1,
  repetition INTEGER DEFAULT 0,
  next_review DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'learning', 'review', 'mastered')),
  last_reviewed TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

-- 2. Lesson Progress (Quiz Results)
CREATE TABLE lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  passed BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 3. Daily Stats
CREATE TABLE daily_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  words_reviewed INTEGER DEFAULT 0,
  words_new INTEGER DEFAULT 0,
  quizzes_taken INTEGER DEFAULT 0,
  time_spent_min INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 4. Indexes
CREATE INDEX idx_vocab_user ON vocabulary_progress(user_id);
CREATE INDEX idx_vocab_review ON vocabulary_progress(user_id, next_review);
CREATE INDEX idx_lesson_user ON lesson_progress(user_id);
CREATE INDEX idx_stats_user ON daily_stats(user_id, date);

-- 5. Row Level Security (RLS)
ALTER TABLE vocabulary_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own vocab" ON vocabulary_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vocab" ON vocabulary_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vocab" ON vocabulary_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own lessons" ON lesson_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lessons" ON lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lessons" ON lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own stats" ON daily_stats
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON daily_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON daily_stats
  FOR UPDATE USING (auth.uid() = user_id);
