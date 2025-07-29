-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  subscription_status VARCHAR(20) DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium'))
);

-- Create reading_passages table
CREATE TABLE IF NOT EXISTS reading_passages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 16),
  translation TEXT NOT NULL,
  key_vocabulary TEXT[] NOT NULL DEFAULT '{}',
  grammar_points TEXT[] NOT NULL DEFAULT '{}',
  questions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  passage_id UUID REFERENCES reading_passages(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  answers JSONB NOT NULL DEFAULT '[]',
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 16),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reading_passages_difficulty ON reading_passages(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_passage_id ON test_results(passage_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for reading_passages table
CREATE POLICY "Anyone can view reading passages" ON reading_passages
  FOR SELECT USING (true);

-- Create policies for test_results table
CREATE POLICY "Users can view own test results" ON test_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test results" ON test_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to get user's difficulty level based on recent test results
CREATE OR REPLACE FUNCTION get_user_difficulty_level(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  avg_score NUMERIC;
  result_count INTEGER;
BEGIN
  -- Get average score from last 5 test results
  SELECT AVG(score), COUNT(*)
  INTO avg_score, result_count
  FROM test_results
  WHERE user_id = user_uuid
  ORDER BY completed_at DESC
  LIMIT 5;

  -- If no test results, return level 1
  IF result_count = 0 THEN
    RETURN 1;
  END IF;

  -- Return difficulty level based on average score (16 levels)
  CASE
    WHEN avg_score >= 97 THEN RETURN 16;
    WHEN avg_score >= 94 THEN RETURN 15;
    WHEN avg_score >= 91 THEN RETURN 14;
    WHEN avg_score >= 88 THEN RETURN 13;
    WHEN avg_score >= 85 THEN RETURN 12;
    WHEN avg_score >= 82 THEN RETURN 11;
    WHEN avg_score >= 79 THEN RETURN 10;
    WHEN avg_score >= 76 THEN RETURN 9;
    WHEN avg_score >= 73 THEN RETURN 8;
    WHEN avg_score >= 70 THEN RETURN 7;
    WHEN avg_score >= 67 THEN RETURN 6;
    WHEN avg_score >= 64 THEN RETURN 5;
    WHEN avg_score >= 61 THEN RETURN 4;
    WHEN avg_score >= 58 THEN RETURN 3;
    WHEN avg_score >= 55 THEN RETURN 2;
    ELSE RETURN 1;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create prompt_templates table for anti-pattern system
CREATE TABLE IF NOT EXISTS prompt_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name VARCHAR(255) NOT NULL,
  difficulty_range INTEGER[] NOT NULL DEFAULT '{}', -- e.g., [1,4] for levels 1-4
  topic_categories TEXT[] NOT NULL DEFAULT '{}',
  writing_styles TEXT[] NOT NULL DEFAULT '{}',
  perspectives TEXT[] NOT NULL DEFAULT '{}',
  question_focuses TEXT[] NOT NULL DEFAULT '{}',
  base_prompt_structure TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create passage_generation_log table to track patterns
CREATE TABLE IF NOT EXISTS passage_generation_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 16),
  topic_used VARCHAR(255),
  style_used VARCHAR(255),
  perspective_used VARCHAR(255),
  question_focus_used VARCHAR(255),
  template_id UUID REFERENCES prompt_templates(id),
  passage_id UUID REFERENCES reading_passages(id),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for prompt system
CREATE INDEX IF NOT EXISTS idx_prompt_templates_difficulty ON prompt_templates USING GIN(difficulty_range);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_active ON prompt_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_generation_log_difficulty ON passage_generation_log(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_generation_log_generated_at ON passage_generation_log(generated_at);

-- Function to get least used topic/style combinations for anti-pattern
CREATE OR REPLACE FUNCTION get_diverse_prompt_elements(target_difficulty INTEGER)
RETURNS TABLE(
  suggested_topic TEXT,
  suggested_style TEXT,
  suggested_perspective TEXT,
  suggested_question_focus TEXT
) AS $$
DECLARE
  recent_topics TEXT[];
  recent_styles TEXT[];
  recent_perspectives TEXT[];
  recent_focuses TEXT[];
BEGIN
  -- Get recently used elements (last 24 hours)
  SELECT 
    array_agg(DISTINCT topic_used),
    array_agg(DISTINCT style_used),
    array_agg(DISTINCT perspective_used),
    array_agg(DISTINCT question_focus_used)
  INTO recent_topics, recent_styles, recent_perspectives, recent_focuses
  FROM passage_generation_log
  WHERE difficulty_level = target_difficulty
    AND generated_at > NOW() - INTERVAL '24 hours';

  -- Return suggestions avoiding recent patterns
  -- This is a simplified version - you can make it more sophisticated
  RETURN QUERY
  SELECT 
    'science and technology'::TEXT,
    'informative article'::TEXT, 
    'expert commentary'::TEXT,
    'inference and interpretation'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;