import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// 验证管理员密码
const verifyAdmin = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const password = authHeader.replace('Bearer ', '');
  return password === process.env.ADMIN_PASSWORD;
};

// GET - 获取统计数据
export async function GET(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const supabase = createAdminClient();
    
    // 用户统计
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    const { count: proUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_tier', 'pro');
    
    const { count: premiumUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_tier', 'premium');
    
    // 词汇统计
    const { count: totalVocabulary } = await supabase
      .from('vocabulary')
      .select('*', { count: 'exact', head: true });
    
    // 测验统计
    const { count: totalQuizzes } = await supabase
      .from('quiz_history')
      .select('*', { count: 'exact', head: true });
    
    // 今日 API 使用量
    const today = new Date().toISOString().split('T')[0];
    const { count: todayUsage } = await supabase
      .from('api_usage')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today);
    
    // 最近注册用户
    const { data: recentUsers } = await supabase
      .from('profiles')
      .select('id, email, display_name, subscription_tier, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        proUsers: proUsers || 0,
        premiumUsers: premiumUsers || 0,
        freeUsers: (totalUsers || 0) - (proUsers || 0) - (premiumUsers || 0),
        totalVocabulary: totalVocabulary || 0,
        totalQuizzes: totalQuizzes || 0,
        todayUsage: todayUsage || 0,
      },
      recentUsers: recentUsers || [],
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
