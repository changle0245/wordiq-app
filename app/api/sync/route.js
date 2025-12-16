import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

// GET - 获取用户所有数据
export async function GET(request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // 获取词汇
    const { data: vocabulary, error: vocabError } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (vocabError) throw vocabError;
    
    // 获取测验历史
    const { data: quizHistory, error: quizError } = await supabase
      .from('quiz_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (quizError) throw quizError;
    
    // 获取用户资料
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    return NextResponse.json({
      vocabulary: vocabulary || [],
      quizHistory: quizHistory || [],
      profile: profile,
      lastSync: new Date().toISOString(),
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - 同步用户数据
export async function POST(request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { vocabulary, quizHistory, profile } = await request.json();
    
    // 同步词汇 (upsert)
    if (vocabulary && vocabulary.length > 0) {
      const vocabWithUserId = vocabulary.map(v => ({
        ...v,
        user_id: userId,
      }));
      
      const { error: vocabError } = await supabase
        .from('vocabulary')
        .upsert(vocabWithUserId, { onConflict: 'id' });
      
      if (vocabError) throw vocabError;
    }
    
    // 同步测验历史 (insert new only)
    if (quizHistory && quizHistory.length > 0) {
      const historyWithUserId = quizHistory.map(h => ({
        ...h,
        user_id: userId,
      }));
      
      const { error: quizError } = await supabase
        .from('quiz_history')
        .upsert(historyWithUserId, { onConflict: 'id', ignoreDuplicates: true });
      
      if (quizError) throw quizError;
    }
    
    // 更新用户资料
    if (profile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          native_lang: profile.nativeLang,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (profileError) throw profileError;
    }
    
    return NextResponse.json({ success: true, synced_at: new Date().toISOString() });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - 删除词汇
export async function DELETE(request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { vocabIds } = await request.json();
    
    if (vocabIds && vocabIds.length > 0) {
      const { error } = await supabase
        .from('vocabulary')
        .delete()
        .eq('user_id', userId)
        .in('id', vocabIds);
      
      if (error) throw error;
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
