import { NextResponse } from 'next/server';
import { createAdminClient, getSystemConfig, setSystemConfig } from '@/lib/supabase';

// 验证管理员密码
const verifyAdmin = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const password = authHeader.replace('Bearer ', '');
  return password === process.env.ADMIN_PASSWORD;
};

// GET - 获取所有配置
export async function GET(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('system_config')
      .select('*')
      .order('key');
    
    if (error) throw error;
    
    // 隐藏 API 密钥的部分内容
    const safeData = data.map(item => ({
      ...item,
      value: item.key === 'anthropic_api_key' && item.value 
        ? `${item.value.substring(0, 10)}...${item.value.substring(item.value.length - 4)}`
        : item.value
    }));
    
    return NextResponse.json({ config: safeData });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - 更新配置
export async function POST(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { key, value } = await request.json();
    
    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }
    
    const success = await setSystemConfig(key, value);
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Config updated' });
    } else {
      return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
