-- =============================================
-- WordIQ 数据库结构
-- =============================================

-- 0. 必要扩展 (gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. 系统配置表 (存储API密钥等)
CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入默认配置
INSERT INTO system_config (key, value) VALUES 
  ('anthropic_api_key', ''),
  ('free_daily_limit', '10'),
  ('pro_daily_limit', '100')
ON CONFLICT (key) DO NOTHING;

-- 2. 用户资料表 (扩展 Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  native_lang TEXT DEFAULT 'zh',
  subscription_tier TEXT DEFAULT 'free', -- free, pro, premium
  subscription_expires_at TIMESTAMPTZ,
  daily_usage INTEGER DEFAULT 0,
  last_usage_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 词汇表
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original TEXT NOT NULL,
  phonetic TEXT,
  part_of_speech TEXT,
  example_sentence TEXT,
  source_language TEXT DEFAULT 'en',
  translations JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  starred BOOLEAN DEFAULT FALSE,
  mastery_points INTEGER DEFAULT 0,
  mastery_level INTEGER DEFAULT 10,
  correct_count INTEGER DEFAULT 0,
  wrong_count INTEGER DEFAULT 0,
  srs_level INTEGER DEFAULT 0,
  last_review TIMESTAMPTZ,
  next_review TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 测验历史表
CREATE TABLE quiz_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  languages TEXT[] NOT NULL,
  mode TEXT DEFAULT 'choice',
  difficulty TEXT DEFAULT 'medium',
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  duration INTEGER NOT NULL, -- 秒
  lang_stats JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 订阅记录表
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL, -- pro, premium
  status TEXT DEFAULT 'active', -- active, cancelled, expired
  payment_provider TEXT, -- stripe, paddle, etc.
  payment_id TEXT,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. API 使用记录表 (用于统计和限流)
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL, -- analyze, translate
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 索引
-- =============================================

CREATE INDEX idx_vocabulary_user_id ON vocabulary(user_id);
CREATE INDEX idx_vocabulary_created_at ON vocabulary(created_at);
CREATE INDEX idx_quiz_history_user_id ON quiz_history(user_id);
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_api_usage_created_at ON api_usage(created_at);

-- =============================================
-- RLS (行级安全策略)
-- =============================================

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Profiles 策略
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Vocabulary 策略
CREATE POLICY "Users can view own vocabulary" ON vocabulary
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vocabulary" ON vocabulary
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary" ON vocabulary
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vocabulary" ON vocabulary
  FOR DELETE USING (auth.uid() = user_id);

-- Quiz History 策略
CREATE POLICY "Users can view own quiz history" ON quiz_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz history" ON quiz_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions 策略
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- API Usage 策略
CREATE POLICY "Users can view own api usage" ON api_usage
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- 触发器: 自动创建用户资料
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 触发器: 自动更新 updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_vocabulary_updated_at
  BEFORE UPDATE ON vocabulary
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_system_config_updated_at
  BEFORE UPDATE ON system_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- RPC: 记录每日使用次数 (用于限流)
-- =============================================

CREATE OR REPLACE FUNCTION public.increment_daily_usage(user_id UUID, usage_date DATE)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET
    daily_usage = CASE
      WHEN last_usage_date = usage_date THEN daily_usage + 1
      ELSE 1
    END,
    last_usage_date = usage_date,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;
