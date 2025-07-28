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
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
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
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
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

  -- Return difficulty level based on average score
  CASE
    WHEN avg_score >= 90 THEN RETURN 5;
    WHEN avg_score >= 80 THEN RETURN 4;
    WHEN avg_score >= 70 THEN RETURN 3;
    WHEN avg_score >= 60 THEN RETURN 2;
    ELSE RETURN 1;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;