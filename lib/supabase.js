import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// 客户端组件使用
export const createBrowserClient = () => {
  return createClientComponentClient();
};

// 服务端组件使用
export const createServerClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
};

// API 路由使用 (带 Service Role 权限)
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

// 获取系统配置
export const getSystemConfig = async (key) => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('system_config')
    .select('value')
    .eq('key', key)
    .single();
  
  if (error) {
    console.error('Error fetching config:', error);
    return null;
  }
  return data?.value;
};

// 更新系统配置
export const setSystemConfig = async (key, value) => {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('system_config')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  
  if (error) {
    console.error('Error setting config:', error);
    return false;
  }
  return true;
};

// 检查用户使用限制
export const checkUsageLimit = async (userId) => {
  const supabase = createAdminClient();
  
  // 获取用户信息
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, daily_usage, last_usage_date')
    .eq('id', userId)
    .single();
  
  if (!profile) return { allowed: false, reason: 'User not found' };
  
  // 获取限制配置
  const tier = profile.subscription_tier || 'free';
  const limitKey = tier === 'free' ? 'free_daily_limit' : 'pro_daily_limit';
  const limitValue = await getSystemConfig(limitKey);
  const dailyLimit = parseInt(limitValue) || (tier === 'free' ? 10 : 100);
  
  // 检查是否是新的一天
  const today = new Date().toISOString().split('T')[0];
  const lastUsageDate = profile.last_usage_date;
  
  if (lastUsageDate !== today) {
    // 重置计数
    await supabase
      .from('profiles')
      .update({ daily_usage: 0, last_usage_date: today })
      .eq('id', userId);
    return { allowed: true, remaining: dailyLimit };
  }
  
  // 检查是否超过限制
  if (profile.daily_usage >= dailyLimit) {
    return { 
      allowed: false, 
      reason: tier === 'free' ? 'Free daily limit reached. Upgrade to Pro!' : 'Daily limit reached.',
      remaining: 0
    };
  }
  
  return { allowed: true, remaining: dailyLimit - profile.daily_usage };
};

// 增加使用计数
export const incrementUsage = async (userId) => {
  const supabase = createAdminClient();
  const today = new Date().toISOString().split('T')[0];
  
  await supabase.rpc('increment_daily_usage', { user_id: userId, usage_date: today });
};
