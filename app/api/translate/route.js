import { NextResponse } from 'next/server';
import { getSystemConfig, checkUsageLimit, incrementUsage } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request) {
  try {
    // 获取用户会话
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();
    
    const userId = session?.user?.id;
    
    // 检查使用限制
    if (userId) {
      const usageCheck = await checkUsageLimit(userId);
      if (!usageCheck.allowed) {
        return NextResponse.json({ error: usageCheck.reason }, { status: 429 });
      }
    }
    
    // 获取 API 密钥
    const apiKey = await getSystemConfig('anthropic_api_key');
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured. Please contact admin.' }, { status: 500 });
    }
    
    // 获取请求数据
    const { words, targetLanguages } = await request.json();
    
    if (!words || !words.length || !targetLanguages || !targetLanguages.length) {
      return NextResponse.json({ error: 'Missing words or target languages' }, { status: 400 });
    }
    
    // 构建语言名称
    const langMap = {
      en: 'English', zh: 'Chinese', es: 'Spanish', ar: 'Arabic',
      hi: 'Hindi', pt: 'Portuguese', ru: 'Russian', ja: 'Japanese',
      fr: 'French', de: 'German', ko: 'Korean', it: 'Italian'
    };
    const langNames = targetLanguages.map(c => langMap[c] || c).join(', ');
    
    // 调用 Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `Translate these words into multiple languages.

Words to translate:
${words.map(w => `- "${w.original}" (${w.sourceLanguage})`).join('\n')}

Target languages: ${langNames}

Return a JSON array where each object has:
- original: the original word
- translations: { "langCode": "translation", ... }

Language codes to use: ${targetLanguages.join(', ')}

Return ONLY the JSON array.`,
        }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', errorData);
      return NextResponse.json({ error: `API Error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    
    // 解析 JSON
    let translations = [];
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        translations = JSON.parse(match[0]);
      } catch (e) {
        console.error('JSON parse error:', e);
      }
    }
    
    // 增加使用计数
    if (userId) {
      await incrementUsage(userId);
    }
    
    return NextResponse.json({ translations });
    
  } catch (error) {
    console.error('Translate API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
