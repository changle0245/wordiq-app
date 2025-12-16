import { NextResponse } from 'next/server';
import { createServerClient, getSystemConfig, checkUsageLimit, incrementUsage } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request) {
  try {
    // 获取用户会话
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();
    
    // 检查用户是否登录 (允许未登录用户使用，但有更严格限制)
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
    const { image, mediaType = 'image/jpeg' } = await request.json();
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }
    
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
          content: [
            { 
              type: 'image', 
              source: { 
                type: 'base64', 
                media_type: mediaType, 
                data: image 
              } 
            },
            { 
              type: 'text', 
              text: `Identify ALL vocabulary words/phrases in this image.

Return a JSON array where each word object contains:
- original: the word/phrase exactly as shown
- phonetic: pronunciation guide (IPA, pinyin, romaji, etc.)
- partOfSpeech: part of speech (noun, verb, adj, etc.)
- exampleSentence: a simple example sentence
- sourceLanguage: language code (en/zh/ja/ko/es/fr/de/ru/pt/it/ar/hi)

If no vocabulary found, return [].
Return ONLY the JSON array, no other text.` 
            },
          ],
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
    let vocabulary = [];
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        vocabulary = JSON.parse(match[0]);
      } catch (e) {
        console.error('JSON parse error:', e);
      }
    }
    
    // 增加使用计数
    if (userId) {
      await incrementUsage(userId);
    }
    
    return NextResponse.json({ vocabulary });
    
  } catch (error) {
    console.error('Analyze API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
