'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// ============================================
// 配置与常量
// ============================================

// 生财有术绿色主题
const THEME = {
  primary: '#1DB954',      // 主绿色
  primaryDark: '#168D40',  // 深绿色
  primaryLight: '#2ECC71', // 浅绿色
  gold: '#D4AF37',         // 金色点缀
  bgDark: '#0A1F1A',       // 深色背景
  bgCard: '#0F2A23',       // 卡片背景
  bgHover: '#153D32',      // 悬停背景
  border: 'rgba(29, 185, 84, 0.2)',
  text: '#E8F5E9',
  textSecondary: '#81C784',
  textMuted: '#5A8F6E',
  success: '#4CAF50',
  error: '#E57373',
  warning: '#FFB74D',
};

const ALL_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', voice: 'en-US' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', voice: 'zh-CN' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', voice: 'es-ES' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', voice: 'ar-SA' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', voice: 'hi-IN' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', voice: 'pt-BR' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', voice: 'ru-RU' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', voice: 'ja-JP' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', voice: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', voice: 'de-DE' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', voice: 'ko-KR' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', voice: 'it-IT' },
];

// 界面多语言
const UI_TEXTS = {
  en: {
    appName: 'WordIQ',
    appDesc: 'AI-Powered Vocabulary Learning',
    upload: 'Upload',
    library: 'Library',
    quiz: 'Quiz',
    history: 'History',
    settings: 'Settings',
    uploadTitle: 'Upload Screenshot',
    uploadDesc: 'Auto-detect vocabulary in any language',
    analyzing: 'AI analyzing...',
    found: 'Found',
    words: 'words',
    addAll: 'Add All',
    cancel: 'Cancel',
    search: 'Search vocabulary...',
    all: 'All',
    starred: 'Starred',
    learning: 'Learning',
    wrong: 'Wrong',
    dueReview: 'Due Review',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    quizSettings: 'Quiz Settings',
    nativeLang: 'Your Native Language',
    targetLang: 'Languages to Learn',
    quizMode: 'Quiz Mode',
    modeChoice: 'Multiple Choice',
    modeListening: 'Listening',
    modeSpelling: 'Spelling',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    timeLimit: 'Time Limit',
    noLimit: 'No Limit',
    seconds: 'seconds',
    startQuiz: 'Start Quiz',
    generating: 'Generating translations...',
    question: 'Question',
    correct: 'Correct',
    submit: 'Submit',
    next: 'Next',
    seeResults: 'See Results',
    quizComplete: 'Quiz Complete!',
    tryAgain: 'Try Again',
    back: 'Back',
    share: 'Share',
    export: 'Export',
    import: 'Import',
    exportCSV: 'Export CSV',
    exportJSON: 'Export JSON',
    importData: 'Import Data',
    tags: 'Tags',
    addTag: 'Add tag...',
    noVocab: 'No vocabulary yet',
    needWords: 'Need at least 4 words',
    selectLang: 'Select at least one language',
    tutorial: 'How to use',
    step1: '1. Upload screenshots with vocabulary',
    step2: '2. Review and add words to library',
    step3: '3. Select languages and start quiz',
    step4: '4. Track your progress over time',
    gotIt: 'Got it!',
    reviewReminder: 'words due for review',
    overall: 'overall',
    accuracy: 'Accuracy',
    time: 'Time',
    grade: 'Grade',
    login: 'Login',
    logout: 'Logout',
    syncCloud: 'Sync to Cloud',
    syncing: 'Syncing...',
    synced: 'Synced',
    upgrade: 'Upgrade to Pro',
    dailyLimit: 'Daily limit reached',
  },
  zh: {
    appName: 'WordIQ',
    appDesc: 'AI驱动的多语言词汇学习',
    upload: '上传',
    library: '词库',
    quiz: '测验',
    history: '历史',
    settings: '设置',
    uploadTitle: '上传截图',
    uploadDesc: '自动识别任意语言的词汇',
    analyzing: 'AI 识别中...',
    found: '找到',
    words: '个词汇',
    addAll: '全部添加',
    cancel: '取消',
    search: '搜索词汇...',
    all: '全部',
    starred: '收藏',
    learning: '学习中',
    wrong: '错题',
    dueReview: '待复习',
    edit: '编辑',
    delete: '删除',
    save: '保存',
    quizSettings: '测验设置',
    nativeLang: '你的母语',
    targetLang: '学习语言',
    quizMode: '测验模式',
    modeChoice: '选择题',
    modeListening: '听力',
    modeSpelling: '拼写',
    difficulty: '难度',
    easy: '简单',
    medium: '中等',
    hard: '困难',
    timeLimit: '时间限制',
    noLimit: '无限制',
    seconds: '秒',
    startQuiz: '开始测验',
    generating: '正在生成翻译...',
    question: '第',
    correct: '正确',
    submit: '提交',
    next: '下一题',
    seeResults: '查看成绩',
    quizComplete: '测验完成！',
    tryAgain: '再来一次',
    back: '返回',
    share: '分享',
    export: '导出',
    import: '导入',
    exportCSV: '导出CSV',
    exportJSON: '导出JSON',
    importData: '导入数据',
    tags: '标签',
    addTag: '添加标签...',
    noVocab: '暂无词汇',
    needWords: '需要至少4个词汇',
    selectLang: '请至少选择一种语言',
    tutorial: '使用教程',
    step1: '1. 上传包含词汇的截图',
    step2: '2. 预览并添加到词库',
    step3: '3. 选择语言开始测验',
    step4: '4. 追踪学习进度',
    gotIt: '知道了！',
    reviewReminder: '个词汇待复习',
    overall: '总体',
    accuracy: '正确率',
    time: '用时',
    grade: '等级',
    login: '登录',
    logout: '退出',
    syncCloud: '同步到云端',
    syncing: '同步中...',
    synced: '已同步',
    upgrade: '升级Pro',
    dailyLimit: '已达今日上限',
  },
};

// 间隔重复算法参数
const SRS_INTERVALS = [1, 3, 7, 14, 30, 60, 120]; // 复习间隔（天）

// ============================================
// 工具函数
// ============================================

const storage = {
  get: (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch { return defaultValue; }
  },
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
};

const speak = (text, langCode) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const lang = ALL_LANGUAGES.find(l => l.code === langCode);
    utterance.lang = lang?.voice || 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }
};

// 图片压缩
const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// 计算下次复习时间
const calculateNextReview = (vocab) => {
  const { srsLevel = 0, lastReview } = vocab;
  const interval = SRS_INTERVALS[Math.min(srsLevel, SRS_INTERVALS.length - 1)];
  const lastDate = lastReview ? new Date(lastReview) : new Date();
  return new Date(lastDate.getTime() + interval * 24 * 60 * 60 * 1000);
};

// 检查是否需要复习
const isDueForReview = (vocab) => {
  if (!vocab.lastReview) return true;
  const nextReview = calculateNextReview(vocab);
  return new Date() >= nextReview;
};

// 数据结构
const createVocabItem = (data) => ({
  id: crypto.randomUUID(),
  original: data.original || '',
  phonetic: data.phonetic || '',
  partOfSpeech: data.partOfSpeech || '',
  exampleSentence: data.exampleSentence || '',
  sourceLanguage: data.sourceLanguage || 'en',
  translations: data.translations || {}, // 缓存翻译 { langCode: "translation" }
  tags: data.tags || [],
  starred: false,
  masteryPoints: 0,
  masteryLevel: 10,
  correctCount: 0,
  wrongCount: 0,
  srsLevel: 0,
  lastReview: null,
  nextReview: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// ============================================
// 组件
// ============================================

// 熟练度进度条
const MasteryProgressBar = ({ points, level, compact = false }) => {
  const percentage = Math.min(100, (points / level) * 100);
  const getLevelInfo = () => {
    if (level >= 10000) return { label: 'Legend', color: THEME.gold };
    if (level >= 1000) return { label: 'Master', color: '#FF6B6B' };
    if (level >= 100) return { label: 'Expert', color: THEME.primaryLight };
    return { label: 'Beginner', color: THEME.primary };
  };
  const { label, color } = getLevelInfo();
  
  if (compact) {
    return (
      <div style={{ width: '100%', height: '4px', background: 'rgba(29, 185, 84, 0.2)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '2px' }} />
      </div>
    );
  }
  
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '10px', fontWeight: '600', color, padding: '1px 6px', background: `${color}20`, borderRadius: '4px' }}>{label}</span>
        <span style={{ fontSize: '10px', color: THEME.textMuted }}>{points}/{level}</span>
      </div>
      <div style={{ width: '100%', height: '6px', background: 'rgba(29, 185, 84, 0.2)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`, borderRadius: '3px', transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
};

// 标签组件
const TagInput = ({ tags, onChange, t }) => {
  const [input, setInput] = useState('');
  
  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      onChange([...tags, input.trim()]);
      setInput('');
    }
  };
  
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
      {tags.map(tag => (
        <span key={tag} style={{
          padding: '2px 8px', background: `${THEME.primary}30`, borderRadius: '4px',
          fontSize: '11px', color: THEME.primaryLight, display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          {tag}
          <button onClick={() => onChange(tags.filter(t => t !== tag))} style={{
            background: 'none', border: 'none', color: THEME.primaryLight, cursor: 'pointer', padding: 0, fontSize: '12px',
          }}>×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && addTag()}
        placeholder={t.addTag}
        style={{
          background: THEME.bgCard, border: `1px solid ${THEME.border}`,
          borderRadius: '4px', padding: '4px 8px', fontSize: '11px', color: THEME.text,
          outline: 'none', width: '80px',
        }}
      />
    </div>
  );
};

// 编辑词汇弹窗
const EditVocabModal = ({ vocab, onSave, onClose, t }) => {
  const [form, setForm] = useState({ ...vocab });
  
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: THEME.bgCard, borderRadius: '16px', padding: '24px',
        maxWidth: '500px', width: '90%', border: `1px solid ${THEME.border}`,
      }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '18px', color: THEME.text }}>{t.edit}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: THEME.textSecondary, marginBottom: '4px', display: 'block' }}>Original</label>
            <input
              value={form.original}
              onChange={e => setForm({ ...form, original: e.target.value })}
              style={{
                width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${THEME.border}`,
                background: THEME.bgDark, color: THEME.text, fontSize: '14px', outline: 'none',
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '12px', color: THEME.textSecondary, marginBottom: '4px', display: 'block' }}>Phonetic</label>
            <input
              value={form.phonetic}
              onChange={e => setForm({ ...form, phonetic: e.target.value })}
              style={{
                width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${THEME.border}`,
                background: THEME.bgDark, color: THEME.text, fontSize: '14px', outline: 'none',
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '12px', color: THEME.textSecondary, marginBottom: '4px', display: 'block' }}>Part of Speech</label>
            <input
              value={form.partOfSpeech}
              onChange={e => setForm({ ...form, partOfSpeech: e.target.value })}
              style={{
                width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${THEME.border}`,
                background: THEME.bgDark, color: THEME.text, fontSize: '14px', outline: 'none',
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '12px', color: THEME.textSecondary, marginBottom: '4px', display: 'block' }}>{t.tags}</label>
            <TagInput tags={form.tags || []} onChange={tags => setForm({ ...form, tags })} t={t} />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${THEME.border}`,
            background: 'transparent', color: THEME.textSecondary, cursor: 'pointer',
          }}>{t.cancel}</button>
          <button onClick={() => { onSave(form); onClose(); }} style={{
            flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
            background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`, color: '#fff', cursor: 'pointer',
          }}>{t.save}</button>
        </div>
      </div>
    </div>
  );
};

// 教程弹窗
const TutorialModal = ({ onClose, t }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  }}>
    <div style={{
      background: THEME.bgCard, borderRadius: '20px', padding: '32px',
      maxWidth: '450px', width: '90%', border: `1px solid ${THEME.border}`, textAlign: 'center',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
      <h2 style={{ margin: '0 0 24px', fontSize: '22px', color: THEME.text }}>{t.tutorial}</h2>
      
      <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {[t.step1, t.step2, t.step3, t.step4].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '600', flexShrink: 0, color: '#fff',
            }}>{i + 1}</div>
            <span style={{ fontSize: '14px', color: THEME.text }}>{step.substring(3)}</span>
          </div>
        ))}
      </div>
      
      <button onClick={onClose} style={{
        padding: '14px 48px', borderRadius: '12px', border: 'none',
        background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
        color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '600',
      }}>{t.gotIt}</button>
    </div>
  </div>
);

// 导出功能
const ExportModal = ({ vocabList, onClose, t }) => {
  const exportCSV = () => {
    const headers = ['Original', 'Language', 'Phonetic', 'Part of Speech', 'Tags', 'Correct', 'Wrong'];
    const rows = vocabList.map(v => [
      v.original, v.sourceLanguage, v.phonetic, v.partOfSpeech,
      (v.tags || []).join(';'), v.correctCount, v.wrongCount
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'snaplingo_export.csv';
    a.click();
  };
  
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(vocabList, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'snaplingo_backup.json';
    a.click();
  };
  
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: THEME.bgCard, borderRadius: '16px', padding: '24px',
        maxWidth: '350px', width: '90%', border: `1px solid ${THEME.border}`,
      }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '18px', color: THEME.text }}>{t.export}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={exportCSV} style={{
            padding: '14px', borderRadius: '10px', border: `1px solid ${THEME.border}`,
            background: THEME.bgDark, color: THEME.text, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>📄 {t.exportCSV}</button>
          
          <button onClick={exportJSON} style={{
            padding: '14px', borderRadius: '10px', border: `1px solid ${THEME.border}`,
            background: THEME.bgDark, color: THEME.text, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>💾 {t.exportJSON}</button>
        </div>
        
        <button onClick={onClose} style={{
          width: '100%', marginTop: '16px', padding: '12px', borderRadius: '8px',
          border: 'none', background: `${THEME.primary}30`, color: THEME.textSecondary, cursor: 'pointer',
        }}>{t.cancel}</button>
      </div>
    </div>
  );
};

// 导入功能
const ImportModal = ({ onImport, onClose, t }) => {
  const fileRef = useRef();
  
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) {
          onImport(data);
          onClose();
        }
      } catch {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: THEME.bgCard, borderRadius: '16px', padding: '24px',
        maxWidth: '350px', width: '90%', border: `1px solid ${THEME.border}`,
      }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '18px', color: THEME.text }}>{t.import}</h3>
        
        <input ref={fileRef} type="file" accept=".json" onChange={handleFile} style={{ display: 'none' }} />
        
        <button onClick={() => fileRef.current?.click()} style={{
          width: '100%', padding: '24px', borderRadius: '12px',
          border: `2px dashed ${THEME.border}`, background: THEME.bgDark,
          color: THEME.textSecondary, cursor: 'pointer', textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
          <div>{t.importData}</div>
          <div style={{ fontSize: '12px', color: THEME.textMuted, marginTop: '4px' }}>JSON format only</div>
        </button>
        
        <button onClick={onClose} style={{
          width: '100%', marginTop: '16px', padding: '12px', borderRadius: '8px',
          border: 'none', background: `${THEME.primary}30`, color: THEME.textSecondary, cursor: 'pointer',
        }}>{t.cancel}</button>
      </div>
    </div>
  );
};

// 成绩卡片
const LanguageResultCard = ({ langCode, stats }) => {
  const lang = ALL_LANGUAGES.find(l => l.code === langCode);
  const accuracy = stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0;
  
  const getGrade = () => {
    if (accuracy >= 100) return { grade: 'S+', color: THEME.gold, bg: `linear-gradient(135deg, ${THEME.gold} 0%, #B8860B 100%)` };
    if (accuracy >= 90) return { grade: 'S', color: THEME.primary, bg: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)` };
    if (accuracy >= 80) return { grade: 'A', color: '#4CAF50', bg: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' };
    if (accuracy >= 70) return { grade: 'B', color: '#2196F3', bg: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' };
    if (accuracy >= 60) return { grade: 'C', color: '#FF9800', bg: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' };
    return { grade: 'D', color: '#F44336', bg: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)' };
  };
  
  const { grade, color, bg } = getGrade();

  return (
    <div style={{
      background: `linear-gradient(180deg, ${THEME.bgCard} 0%, ${THEME.bgDark} 100%)`,
      borderRadius: '20px', overflow: 'hidden',
      border: `1px solid ${THEME.border}`, minWidth: '140px', flex: '1',
    }}>
      <div style={{ height: '60px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '20px' }}>{lang?.flag}</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{grade}</div>
        </div>
      </div>
      <div style={{ padding: '12px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: THEME.text, marginBottom: '4px' }}>{lang?.nativeName}</div>
        <div style={{ fontSize: '18px', fontWeight: '700', color }}>{accuracy}%</div>
        <div style={{ fontSize: '11px', color: THEME.textSecondary }}>{stats.correct}/{stats.total}</div>
      </div>
    </div>
  );
};

// 分享图片生成
const generateShareImage = async (langStats, duration, totalCorrect, totalQuestions, nativeLang) => {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  // 背景渐变 - 生财有术绿色
  const gradient = ctx.createLinearGradient(0, 0, 600, 400);
  gradient.addColorStop(0, '#0A1F1A');
  gradient.addColorStop(0.5, '#0F2A23');
  gradient.addColorStop(1, '#0A1F1A');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 400);
  
  // 标题
  ctx.fillStyle = '#E8F5E9';
  ctx.font = 'bold 28px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎉 SnapLingo Quiz Complete!', 300, 50);
  
  // 总成绩
  const accuracy = totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0;
  ctx.font = 'bold 64px -apple-system, sans-serif';
  ctx.fillStyle = accuracy >= 80 ? '#1DB954' : accuracy >= 60 ? '#D4AF37' : '#E57373';
  ctx.fillText(`${accuracy}%`, 300, 130);
  
  ctx.font = '16px -apple-system, sans-serif';
  ctx.fillStyle = '#81C784';
  ctx.fillText(`${totalCorrect}/${totalQuestions} correct · ${Math.floor(duration / 60)}m ${duration % 60}s`, 300, 160);
  
  // 各语言成绩
  const langs = Object.entries(langStats);
  const startX = 300 - (langs.length * 70) / 2;
  langs.forEach(([code, stats], i) => {
    const lang = ALL_LANGUAGES.find(l => l.code === code);
    const acc = stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0;
    const x = startX + i * 70 + 35;
    
    ctx.font = '28px -apple-system, sans-serif';
    ctx.fillText(lang?.flag || '', x, 220);
    
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.fillStyle = acc >= 80 ? '#1DB954' : acc >= 60 ? '#D4AF37' : '#E57373';
    ctx.fillText(`${acc}%`, x, 250);
  });
  
  // 水印
  ctx.font = '14px -apple-system, sans-serif';
  ctx.fillStyle = '#5A8F6E';
  ctx.fillText('Made with SnapLingo 拍词 📚', 300, 370);
  
  return canvas.toDataURL('image/png');
};

// 社交媒体分享
const SocialShareButtons = ({ accuracy, totalCorrect, totalQuestions, langStats, nativeLang, shareImage }) => {
  const shareText = nativeLang === 'zh' 
    ? `🎉 我在拍词 SnapLingo 完成了词汇测验！正确率 ${accuracy}%，学习了 ${Object.keys(langStats).length} 种语言！一起来学习吧！`
    : `🎉 Just completed a vocabulary quiz on SnapLingo! ${accuracy}% accuracy, learning ${Object.keys(langStats).length} languages! Join me!`;
  
  const shareUrl = 'https://snaplingo.app';
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);
  
  // Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        const blob = shareImage ? await (await fetch(shareImage)).blob() : null;
        const file = blob ? new File([blob], 'snaplingo_result.png', { type: 'image/png' }) : null;
        
        await navigator.share({
          title: 'SnapLingo Quiz Result',
          text: shareText,
          url: shareUrl,
          ...(file && navigator.canShare?.({ files: [file] }) ? { files: [file] } : {}),
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };
  
  const platforms = [
    {
      name: 'WeChat',
      icon: '💬',
      color: '#07C160',
      action: () => {
        alert(nativeLang === 'zh' 
          ? '请下载图片后在微信中分享' 
          : 'Please download the image and share in WeChat');
      },
    },
    {
      name: 'Weibo',
      icon: '🔴',
      color: '#E6162D',
      url: `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedText}`,
    },
    {
      name: 'X',
      icon: '𝕏',
      color: '#000000',
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: 'f',
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'WhatsApp',
      icon: '📱',
      color: '#25D366',
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: '#0088CC',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: 'Xiaohongshu',
      icon: '📕',
      color: '#FF2442',
      action: () => {
        alert(nativeLang === 'zh' 
          ? '请下载图片后在小红书中分享' 
          : 'Please download the image and share on Xiaohongshu');
      },
    },
  ];
  
  return (
    <div>
      {/* 系统原生分享（移动端） */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <button onClick={handleNativeShare} style={{
          width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px',
          border: 'none', background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
          color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          📤 {nativeLang === 'zh' ? '分享到...' : 'Share to...'}
        </button>
      )}
      
      {/* 社交平台按钮 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {platforms.map(platform => (
          <button
            key={platform.name}
            onClick={() => {
              if (platform.action) {
                platform.action();
              } else if (platform.url) {
                window.open(platform.url, '_blank', 'width=600,height=400');
              }
            }}
            style={{
              padding: '12px 8px', borderRadius: '10px',
              border: `1px solid ${THEME.border}`,
              background: THEME.bgDark,
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            }}
          >
            <span style={{ 
              fontSize: platform.icon.length === 1 ? '20px' : '14px', 
              fontWeight: platform.icon.length <= 2 ? '700' : '400',
              color: platform.color,
            }}>
              {platform.icon}
            </span>
            <span style={{ fontSize: '10px', color: THEME.textSecondary }}>{platform.name}</span>
          </button>
        ))}
      </div>
      
      {/* 复制链接 */}
      <button
        onClick={() => {
          navigator.clipboard?.writeText(`${shareText}\n${shareUrl}`);
          alert(nativeLang === 'zh' ? '已复制到剪贴板！' : 'Copied to clipboard!');
        }}
        style={{
          width: '100%', marginTop: '12px', padding: '10px', borderRadius: '8px',
          border: `1px solid ${THEME.border}`, background: THEME.bgCard,
          color: THEME.textSecondary, cursor: 'pointer', fontSize: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}
      >
        📋 {nativeLang === 'zh' ? '复制分享文案' : 'Copy Share Text'}
      </button>
    </div>
  );
};

// 结果海报
const ResultPoster = ({ onClose, onRetry, langStats, duration, totalCorrect, totalQuestions, nativeLang, t }) => {
  const [shareImage, setShareImage] = useState(null);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const overallAccuracy = totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0;
  const mins = Math.floor(duration / 60);
  const secs = duration % 60;
  
  const handleShare = async () => {
    const img = await generateShareImage(langStats, duration, totalCorrect, totalQuestions, nativeLang);
    setShareImage(img);
    setShowSharePanel(true);
  };
  
  const downloadShare = () => {
    if (!shareImage) return;
    const a = document.createElement('a');
    a.href = shareImage;
    a.download = 'snaplingo_result.png';
    a.click();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(10px)', padding: '20px', overflow: 'auto',
    }}>
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      
      <div style={{ maxWidth: '700px', width: '100%', animation: 'slideUp 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '700', color: THEME.text }}>🎉 {t.quizComplete}</h2>
          <p style={{ margin: 0, color: THEME.textMuted, fontSize: '14px' }}>
            {t.accuracy}: {overallAccuracy}% · {t.time}: {mins > 0 ? `${mins}m ` : ''}{secs}s
          </p>
        </div>

        {showSharePanel ? (
          <div style={{ marginBottom: '24px' }}>
            {/* 分享图片预览 */}
            {shareImage && (
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <img src={shareImage} alt="Share" style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '12px' }} />
                <button onClick={downloadShare} style={{
                  padding: '10px 20px', borderRadius: '8px', border: 'none',
                  background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
                  color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                }}>📥 {nativeLang === 'zh' ? '下载图片' : 'Download Image'}</button>
              </div>
            )}
            
            {/* 社交媒体分享 */}
            <div style={{
              background: THEME.bgCard, borderRadius: '16px', padding: '20px',
              border: `1px solid ${THEME.border}`,
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '14px', color: THEME.text, textAlign: 'center' }}>
                {nativeLang === 'zh' ? '分享到社交平台' : 'Share to Social Media'}
              </h3>
              <SocialShareButtons 
                accuracy={overallAccuracy}
                totalCorrect={totalCorrect}
                totalQuestions={totalQuestions}
                langStats={langStats}
                nativeLang={nativeLang}
                shareImage={shareImage}
              />
            </div>
            
            <button onClick={() => setShowSharePanel(false)} style={{
              width: '100%', marginTop: '12px', padding: '10px', borderRadius: '8px',
              border: `1px solid ${THEME.border}`, background: 'transparent',
              color: THEME.textSecondary, cursor: 'pointer', fontSize: '13px',
            }}>← {nativeLang === 'zh' ? '返回成绩' : 'Back to Results'}</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
            {Object.entries(langStats).map(([lang, stats]) => (
              <LanguageResultCard key={lang} langCode={lang} stats={stats} />
            ))}
          </div>
        )}

        {!showSharePanel && (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onClose} style={{
              padding: '14px 28px', borderRadius: '12px',
              border: `1px solid ${THEME.border}`, background: 'transparent',
              color: THEME.textSecondary, cursor: 'pointer', fontSize: '14px',
            }}>{t.back}</button>
            <button onClick={handleShare} style={{
              padding: '14px 28px', borderRadius: '12px', border: 'none',
              background: `${THEME.primary}30`, color: THEME.primaryLight, cursor: 'pointer', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>📤 {t.share}</button>
            <button onClick={onRetry} style={{
              padding: '14px 28px', borderRadius: '12px', border: 'none',
              background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
              color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
            }}>{t.tryAgain} 🎯</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// 主应用
// ============================================

export default function VocabLearner() {
  // Supabase 客户端
  const supabase = createClientComponentClient();
  
  // 用户状态
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  
  // 基础状态
  const [view, setView] = useState('upload');
  const [vocabList, setVocabList] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [nativeLang, setNativeLang] = useState(() => storage.get('nativeLang', 'zh'));
  
  // UI状态
  const [showTutorial, setShowTutorial] = useState(() => !storage.get('tutorialSeen', false));
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingVocab, setEditingVocab] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  
  // 上传状态
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [extractedVocab, setExtractedVocab] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  
  // 测验状态
  const [targetLangs, setTargetLangs] = useState([]);
  const [quizMode, setQuizMode] = useState('choice'); // choice, listening, spelling
  const [difficulty, setDifficulty] = useState('medium');
  const [timeLimit, setTimeLimit] = useState(0);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizState, setQuizState] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [showPoster, setShowPoster] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const [spellingInput, setSpellingInput] = useState({});
  
  // 多语言
  const t = UI_TEXTS[nativeLang] || UI_TEXTS.en;
  const nativeLangInfo = ALL_LANGUAGES.find(l => l.code === nativeLang);

  // 计算待复习词汇
  const dueForReviewCount = useMemo(() => vocabList.filter(isDueForReview).length, [vocabList]);
  
  // 所有标签
  const allTags = useMemo(() => {
    const tags = new Set();
    vocabList.forEach(v => (v.tags || []).forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [vocabList]);

  // 监听用户状态
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          // 获取用户资料
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUserProfile(profile);
          
          // 同步云端数据
          syncFromCloud();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 从云端同步数据
  const syncFromCloud = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/sync');
      if (response.ok) {
        const data = await response.json();
        if (data.vocabulary && data.vocabulary.length > 0) {
          // 合并本地和云端数据
          const localVocab = storage.get('vocabList', []);
          const mergedVocab = mergeVocabulary(localVocab, data.vocabulary);
          setVocabList(mergedVocab);
          storage.set('vocabList', mergedVocab);
        }
        if (data.quizHistory) {
          setQuizHistory(data.quizHistory);
          storage.set('quizHistory', data.quizHistory);
        }
        setLastSynced(new Date().toISOString());
      }
    } catch (err) {
      console.error('Sync from cloud failed:', err);
    }
  };

  // 合并词汇（以更新时间为准）
  const mergeVocabulary = (local, cloud) => {
    const merged = new Map();
    
    [...local, ...cloud].forEach(item => {
      const existing = merged.get(item.id);
      if (!existing || new Date(item.updatedAt) > new Date(existing.updatedAt)) {
        merged.set(item.id, item);
      }
    });
    
    return Array.from(merged.values());
  };

  // 同步到云端
  const syncToCloud = async () => {
    if (!user) return;
    
    setIsSyncing(true);
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vocabulary: vocabList,
          quizHistory: quizHistory,
          profile: { nativeLang },
        }),
      });
      
      if (response.ok) {
        setLastSynced(new Date().toISOString());
      }
    } catch (err) {
      console.error('Sync to cloud failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // 登出
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
  };

  // 加载数据
  useEffect(() => {
    setVocabList(storage.get('vocabList', []));
    setQuizHistory(storage.get('quizHistory', []));
  }, []);

  // 保存数据
  useEffect(() => { storage.set('vocabList', vocabList); }, [vocabList]);
  useEffect(() => { storage.set('quizHistory', quizHistory); }, [quizHistory]);
  useEffect(() => { storage.set('nativeLang', nativeLang); }, [nativeLang]);
  
  // 关闭教程
  const closeTutorial = () => {
    setShowTutorial(false);
    storage.set('tutorialSeen', true);
  };

  // 图片上传处理
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setErrorMsg('');
    setIsProcessing(true);
    
    try {
      // 压缩图片
      const compressedImage = await compressImage(file);
      setUploadedImage(compressedImage);
      
      const base64Data = compressedImage.split(',')[1];

      // 使用后端API代理
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data, mediaType: 'image/jpeg' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const vocabulary = data.vocabulary || [];

      if (Array.isArray(vocabulary) && vocabulary.length > 0) {
        setExtractedVocab(vocabulary.map(item => createVocabItem(item)));
        setShowPreview(true);
      } else {
        setErrorMsg('No vocabulary found in this image');
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 词汇操作
  const updateVocab = (id, updates) => {
    setVocabList(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    ));
  };
  
  const deleteVocab = (id) => setVocabList(prev => prev.filter(item => item.id !== id));
  const toggleStar = (id) => updateVocab(id, { starred: !vocabList.find(v => v.id === id)?.starred });
  const removeFromPreview = (id) => setExtractedVocab(prev => prev.filter(item => item.id !== id));
  
  const addAllToLibrary = () => {
    if (extractedVocab.length > 0) {
      setVocabList(prev => [...prev, ...extractedVocab]);
      setExtractedVocab([]);
      setShowPreview(false);
      setUploadedImage(null);
      setView('library');
    }
  };
  
  const cancelPreview = () => {
    setExtractedVocab([]);
    setShowPreview(false);
    setUploadedImage(null);
  };
  
  const handleImport = (data) => {
    const newItems = data.map(item => ({
      ...createVocabItem(item),
      ...item,
      id: crypto.randomUUID(),
    }));
    setVocabList(prev => [...prev, ...newItems]);
  };

  const toggleTargetLang = (code) => {
    if (code === nativeLang) return;
    setTargetLangs(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  // 过滤词汇
  const filteredVocab = useMemo(() => {
    return vocabList.filter(item => {
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchOriginal = item.original.toLowerCase().includes(query);
        const matchTrans = Object.values(item.translations || {}).some(t => t.toLowerCase().includes(query));
        if (!matchOriginal && !matchTrans) return false;
      }
      
      // 标签过滤
      if (selectedTag && !(item.tags || []).includes(selectedTag)) return false;
      
      // 状态过滤
      if (filter === 'starred') return item.starred;
      if (filter === 'learning') return item.masteryPoints < item.masteryLevel;
      if (filter === 'wrong') return item.wrongCount > 0;
      if (filter === 'due') return isDueForReview(item);
      
      return true;
    });
  }, [vocabList, searchQuery, selectedTag, filter]);

  // 开始测验
  const startQuiz = async () => {
    if (targetLangs.length === 0) {
      alert(t.selectLang);
      return;
    }
    if (vocabList.length < 4) {
      alert(t.needWords);
      return;
    }

    setIsGeneratingQuiz(true);

    try {
      // 根据难度选择词汇数量
      const wordCount = difficulty === 'easy' ? 5 : difficulty === 'hard' ? 15 : 10;
      
      // 优先选择需要复习和错题
      const sorted = [...vocabList].sort((a, b) => {
        const aScore = (isDueForReview(a) ? 10 : 0) + a.wrongCount * 2 + (a.masteryLevel - a.masteryPoints);
        const bScore = (isDueForReview(b) ? 10 : 0) + b.wrongCount * 2 + (b.masteryLevel - b.masteryPoints);
        return bScore - aScore + (Math.random() - 0.5);
      });
      const quizWords = sorted.slice(0, wordCount);

      // 检查需要翻译的词汇
      const needTranslation = quizWords.filter(w => {
        const hasAll = [nativeLang, ...targetLangs].every(lang => 
          w.translations?.[lang] || w.sourceLanguage === lang
        );
        return !hasAll;
      });

      // 批量获取翻译
      if (needTranslation.length > 0) {
        const langsToTranslate = [nativeLang, ...targetLangs].filter(l => l !== 'source');
        
        // 使用后端API代理
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            words: needTranslation,
            targetLanguages: langsToTranslate,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Translation failed');
        }

        const data = await response.json();
        const translations = data.translations || [];

        // 更新词汇库中的翻译缓存
        translations.forEach(trans => {
          const vocab = vocabList.find(v => v.original === trans.original);
          if (vocab) {
            updateVocab(vocab.id, {
              translations: { ...vocab.translations, ...trans.translations }
            });
          }
        });

        // 更新quizWords中的翻译
        quizWords.forEach(w => {
          const trans = translations.find(t => t.original === w.original);
          if (trans) {
            w.translations = { ...w.translations, ...trans.translations };
          }
        });
      }

      // 准备测验数据
      const quizData = quizWords.map(word => ({
        ...word,
        nativeTranslation: word.sourceLanguage === nativeLang ? word.original : (word.translations?.[nativeLang] || ''),
        targetTranslations: targetLangs.reduce((acc, lang) => {
          acc[lang] = word.sourceLanguage === lang ? word.original : (word.translations?.[lang] || '');
          return acc;
        }, {}),
      }));

      // 收集所有翻译用于生成干扰选项
      const allTranslations = {};
      targetLangs.forEach(lang => {
        allTranslations[lang] = quizData.map(w => w.targetTranslations[lang]).filter(Boolean);
      });

      const firstRound = generateQuizRound(quizData[0], targetLangs, allTranslations, quizMode);

      setQuizState({
        quizData,
        allTranslations,
        currentRound: firstRound,
        roundIndex: 0,
        answers: {},
        showResults: false,
        langStats: Object.fromEntries(targetLangs.map(l => [l, { correct: 0, total: 0, wrongWords: [] }])),
      });
      
      setQuizStartTime(Date.now());
      setTimer(timeLimit);
      setShowPoster(false);
      setSpellingInput({});
      setView('quiz');

      // 启动计时器
      if (timeLimit > 0) {
        const interval = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              // 时间到自动提交
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

    } catch (error) {
      alert('Failed to start quiz: ' + error.message);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // 生成一轮题目
  const generateQuizRound = (wordData, targetLangs, allTranslations, mode) => {
    const questions = {};
    
    targetLangs.forEach(lang => {
      const correctAnswer = wordData.targetTranslations[lang];
      
      if (mode === 'spelling') {
        questions[lang] = { correctAnswer, mode: 'spelling' };
      } else {
        // 选择更好的干扰项（同词性优先）
        const otherOptions = allTranslations[lang]
          .filter(t => t !== correctAnswer && t)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        const options = [
          { id: 'correct', text: correctAnswer, isCorrect: true },
          ...otherOptions.map((text, i) => ({ id: `wrong-${i}`, text, isCorrect: false }))
        ].sort(() => Math.random() - 0.5);

        questions[lang] = { correctAnswer, options, mode: mode === 'listening' ? 'listening' : 'choice' };
      }
    });
    
    return questions;
  };

  const selectAnswer = (lang, optionId) => {
    if (quizState.showResults) return;
    setQuizState(prev => ({ ...prev, answers: { ...prev.answers, [lang]: optionId } }));
  };

  const handleSpellingInput = (lang, value) => {
    setSpellingInput(prev => ({ ...prev, [lang]: value }));
  };

  const submitRound = () => {
    const { currentRound, answers, langStats, quizData, roundIndex } = quizState;
    const newLangStats = { ...langStats };
    const currentWord = quizData[roundIndex];

    Object.entries(currentRound).forEach(([lang, q]) => {
      let isCorrect = false;
      
      if (q.mode === 'spelling') {
        const userInput = (spellingInput[lang] || '').trim().toLowerCase();
        const correct = q.correctAnswer.toLowerCase();
        isCorrect = userInput === correct;
      } else {
        const selectedOption = q.options?.find(o => o.id === answers[lang]);
        isCorrect = selectedOption?.isCorrect || false;
      }
      
      newLangStats[lang] = {
        correct: langStats[lang].correct + (isCorrect ? 1 : 0),
        total: langStats[lang].total + 1,
        wrongWords: isCorrect ? langStats[lang].wrongWords : [...langStats[lang].wrongWords, currentWord.original],
      };
    });

    // 更新词汇熟练度和SRS
    const allCorrect = Object.entries(currentRound).every(([lang, q]) => {
      if (q.mode === 'spelling') {
        return (spellingInput[lang] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase();
      }
      const selected = q.options?.find(o => o.id === answers[lang]);
      return selected?.isCorrect;
    });

    let newPoints = currentWord.masteryPoints + (allCorrect ? 1 : -1);
    let newLevel = currentWord.masteryLevel;
    let newSrsLevel = currentWord.srsLevel || 0;
    
    if (newPoints < 0) newPoints = 0;
    if (newPoints >= newLevel) {
      newLevel = newLevel * 10;
      newSrsLevel = Math.min(newSrsLevel + 1, SRS_INTERVALS.length - 1);
    }
    if (!allCorrect && newSrsLevel > 0) newSrsLevel--;

    updateVocab(currentWord.id, {
      masteryPoints: newPoints,
      masteryLevel: newLevel,
      correctCount: currentWord.correctCount + (allCorrect ? 1 : 0),
      wrongCount: currentWord.wrongCount + (allCorrect ? 0 : 1),
      srsLevel: newSrsLevel,
      lastReview: new Date().toISOString(),
    });

    setQuizState(prev => ({ ...prev, showResults: true, langStats: newLangStats }));
  };

  const nextRound = () => {
    const { quizData, roundIndex, langStats, allTranslations } = quizState;

    if (roundIndex + 1 >= quizData.length) {
      const duration = Math.floor((Date.now() - quizStartTime) / 1000);
      const totalCorrect = Object.values(langStats).reduce((s, l) => s + l.correct, 0);
      const totalQuestions = Object.values(langStats).reduce((s, l) => s + l.total, 0);

      setQuizHistory(prev => [{
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        languages: targetLangs,
        totalQuestions,
        correct: totalCorrect,
        accuracy: totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0,
        duration,
        langStats,
        mode: quizMode,
        difficulty,
      }, ...prev]);

      setQuizResult({ langStats, duration, totalCorrect, totalQuestions, nativeLang });
      setShowPoster(true);
      return;
    }

    const nextWord = quizData[roundIndex + 1];
    const currentRound = generateQuizRound(nextWord, targetLangs, allTranslations, quizMode);

    setQuizState(prev => ({
      ...prev,
      currentRound,
      roundIndex: prev.roundIndex + 1,
      answers: {},
      showResults: false,
    }));
    setSpellingInput({});
    
    // 听力模式自动播放
    if (quizMode === 'listening') {
      setTimeout(() => speak(nextWord.original, nextWord.sourceLanguage), 500);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // ============================================
  // 渲染
  // ============================================

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${THEME.bgDark} 0%, ${THEME.bgCard} 50%, ${THEME.bgDark} 100%)`,
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      color: THEME.text,
    }}>
      {/* 弹窗 */}
      {showTutorial && <TutorialModal onClose={closeTutorial} t={t} />}
      {showExport && <ExportModal vocabList={vocabList} onClose={() => setShowExport(false)} t={t} />}
      {showImport && <ImportModal onImport={handleImport} onClose={() => setShowImport(false)} t={t} />}
      {editingVocab && <EditVocabModal vocab={editingVocab} onSave={(v) => updateVocab(v.id, v)} onClose={() => setEditingVocab(null)} t={t} />}
      {showPoster && quizResult && (
        <ResultPoster
          {...quizResult}
          onClose={() => { setShowPoster(false); setView('library'); }}
          onRetry={() => { setShowPoster(false); startQuiz(); }}
          t={t}
        />
      )}

      {/* 头部 */}
      <header style={{
        padding: '12px 20px',
        borderBottom: `1px solid ${THEME.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100,
        background: `${THEME.bgDark}ee`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
          }}>🧠</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: THEME.text }}>{t.appName}</h1>
            <p style={{ margin: 0, fontSize: '10px', color: THEME.textSecondary }}>{t.appDesc}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 复习提醒 */}
          {dueForReviewCount > 0 && view !== 'quiz' && (
            <button onClick={() => { setFilter('due'); setView('library'); }} style={{
              padding: '6px 12px', borderRadius: '20px', border: 'none',
              background: `${THEME.gold}30`, color: THEME.gold,
              cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              🔔 {dueForReviewCount} {t.reviewReminder}
            </button>
          )}
          
          <nav style={{ display: 'flex', gap: '4px' }}>
            {[
              { id: 'upload', label: t.upload, icon: '📷' },
              { id: 'library', label: `${t.library}(${vocabList.length})`, icon: '📖' },
              { id: 'start-quiz', label: t.quiz, icon: '🎯' },
              { id: 'history', label: t.history, icon: '📊' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                style={{
                  padding: '6px 10px', borderRadius: '8px', border: 'none',
                  background: view === tab.id ? `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)` : THEME.bgCard,
                  color: view === tab.id ? '#fff' : THEME.textSecondary,
                  cursor: 'pointer', fontSize: '11px', fontWeight: '500',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <span>{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
          
          {/* 语言切换 */}
          <select
            value={nativeLang}
            onChange={e => setNativeLang(e.target.value)}
            style={{
              padding: '6px 8px', borderRadius: '8px', border: 'none',
              background: THEME.bgCard, color: THEME.text,
              cursor: 'pointer', fontSize: '14px',
            }}
          >
            {ALL_LANGUAGES.slice(0, 6).map(lang => (
              <option key={lang.code} value={lang.code}>{lang.flag}</option>
            ))}
          </select>

          {/* 用户状态 */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* 同步按钮 */}
              <button onClick={syncToCloud} disabled={isSyncing} style={{
                padding: '6px 10px', borderRadius: '8px', border: 'none',
                background: THEME.bgCard, color: isSyncing ? THEME.textMuted : THEME.textSecondary,
                cursor: isSyncing ? 'default' : 'pointer', fontSize: '11px',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                {isSyncing ? '⏳' : '☁️'} {isSyncing ? t.syncing : t.syncCloud}
              </button>
              
              {/* 用户头像/退出 */}
              <div style={{ position: 'relative' }}>
                <button onClick={handleLogout} style={{
                  padding: '6px 10px', borderRadius: '8px', border: 'none',
                  background: THEME.bgCard, color: THEME.textSecondary,
                  cursor: 'pointer', fontSize: '11px',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  {userProfile?.avatar_url ? (
                    <img src={userProfile.avatar_url} alt="" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                  ) : '👤'}
                  {t.logout}
                </button>
              </div>
            </div>
          ) : (
            <a href="/auth" style={{
              padding: '6px 12px', borderRadius: '8px', border: 'none', textDecoration: 'none',
              background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
              color: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '500',
            }}>
              {t.login}
            </a>
          )}
        </div>
      </header>

      <main style={{ padding: '16px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* 上传页面 */}
        {view === 'upload' && (
          <div style={{ maxWidth: showPreview ? '900px' : '460px', margin: '20px auto' }}>
            {!showPreview ? (
              <div style={{
                background: THEME.bgCard, borderRadius: '20px',
                border: `2px dashed ${THEME.border}`, padding: '50px 30px', textAlign: 'center',
              }}>
                {isProcessing ? (
                  <div>
                    {uploadedImage && <img src={uploadedImage} alt="" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '10px', marginBottom: '16px', opacity: 0.7 }} />}
                    <div style={{ width: '40px', height: '40px', border: `3px solid ${THEME.primary}30`, borderTopColor: THEME.primary, borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: THEME.textSecondary, margin: 0, fontSize: '14px' }}>{t.analyzing}</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                ) : errorMsg ? (
                  <div>
                    <div style={{ padding: '14px', background: `${THEME.error}20`, borderRadius: '10px', marginBottom: '14px' }}>
                      <p style={{ color: THEME.error, margin: 0, fontSize: '13px' }}>❌ {errorMsg}</p>
                    </div>
                    <button onClick={() => { setUploadedImage(null); setErrorMsg(''); }} style={{
                      padding: '10px 20px', borderRadius: '8px', border: 'none',
                      background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
                      color: '#fff', cursor: 'pointer', fontSize: '13px',
                    }}>Try Again</button>
                  </div>
                ) : (
                  <label style={{ cursor: 'pointer', display: 'block' }}>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    <div style={{ fontSize: '56px', marginBottom: '14px' }}>📸</div>
                    <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600', color: THEME.text }}>{t.uploadTitle}</h3>
                    <p style={{ margin: 0, color: THEME.textSecondary, fontSize: '13px' }}>{t.uploadDesc}</p>
                  </label>
                )}
              </div>
            ) : (
              <div style={{
                background: THEME.bgCard, borderRadius: '20px',
                border: `1px solid ${THEME.border}`, overflow: 'hidden',
              }}>
                <div style={{
                  padding: '16px 20px', borderBottom: `1px solid ${THEME.border}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px',
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700' }}>✨ {t.found} {extractedVocab.length} {t.words}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={cancelPreview} style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${THEME.border}`, background: 'transparent', color: THEME.textSecondary, cursor: 'pointer', fontSize: '12px' }}>{t.cancel}</button>
                    <button onClick={addAllToLibrary} disabled={extractedVocab.length === 0} style={{
                      padding: '8px 20px', borderRadius: '8px', border: 'none',
                      background: extractedVocab.length > 0 ? `linear-gradient(135deg, ${THEME.success} 0%, ${THEME.primaryDark} 100%)` : THEME.border,
                      color: extractedVocab.length > 0 ? '#fff' : THEME.textMuted,
                      cursor: extractedVocab.length > 0 ? 'pointer' : 'not-allowed', fontSize: '12px', fontWeight: '600',
                    }}>✓ {t.addAll} ({extractedVocab.length})</button>
                  </div>
                </div>

                <div style={{ padding: '16px 20px', maxHeight: '450px', overflow: 'auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                    {extractedVocab.map(item => {
                      const lang = ALL_LANGUAGES.find(l => l.code === item.sourceLanguage);
                      return (
                        <div key={item.id} style={{
                          background: THEME.bgCard, borderRadius: '10px', padding: '12px',
                          border: `1px solid ${THEME.border}`, position: 'relative',
                        }}>
                          <button onClick={() => removeFromPreview(item.id)} style={{
                            position: 'absolute', top: '8px', right: '8px', width: '22px', height: '22px',
                            borderRadius: '6px', border: 'none', background: `${THEME.error}25`,
                            color: THEME.error, cursor: 'pointer', fontSize: '11px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>✕</button>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', paddingRight: '28px' }}>
                            <span style={{ fontSize: '12px' }}>{lang?.flag}</span>
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.original}</span>
                            <button onClick={() => speak(item.original, item.sourceLanguage)} style={{
                              padding: '2px 4px', borderRadius: '4px', border: 'none',
                              background: `${THEME.primary}30`, cursor: 'pointer', fontSize: '9px'
                            }}>🔊</button>
                          </div>

                          {item.phonetic && <div style={{ fontSize: '11px', color: THEME.primaryDark, marginBottom: '4px' }}>{item.phonetic}</div>}
                          {item.partOfSpeech && <span style={{ padding: '2px 6px', background: `${THEME.primary}25`, borderRadius: '4px', fontSize: '9px', color: THEME.primaryLight }}>{item.partOfSpeech}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 词汇库页面 */}
        {view === 'library' && (
          <div>
            {/* 工具栏 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* 搜索框 */}
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t.search}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', border: `1px solid ${THEME.border}`,
                    background: THEME.bgCard, color: THEME.text, fontSize: '12px',
                    outline: 'none', width: '160px',
                  }}
                />
                
                {/* 过滤器 */}
                {[
                  { id: 'all', label: t.all },
                  { id: 'starred', label: `⭐ ${t.starred}` },
                  { id: 'learning', label: `📖 ${t.learning}` },
                  { id: 'wrong', label: `❌ ${t.wrong}` },
                  { id: 'due', label: `🔔 ${t.dueReview}`, count: dueForReviewCount },
                ].map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id)} style={{
                    padding: '5px 10px', borderRadius: '6px', border: 'none',
                    background: filter === f.id ? `${THEME.primary}30` : THEME.bgCard,
                    color: filter === f.id ? THEME.primaryLight : THEME.textSecondary, cursor: 'pointer', fontSize: '11px',
                  }}>
                    {f.label}{f.count ? ` (${f.count})` : ''}
                  </button>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setShowImport(true)} style={{
                  padding: '6px 12px', borderRadius: '6px', border: `1px solid ${THEME.border}`,
                  background: 'transparent', color: THEME.textSecondary, cursor: 'pointer', fontSize: '11px',
                }}>📥 {t.import}</button>
                <button onClick={() => setShowExport(true)} style={{
                  padding: '6px 12px', borderRadius: '6px', border: `1px solid ${THEME.border}`,
                  background: 'transparent', color: THEME.textSecondary, cursor: 'pointer', fontSize: '11px',
                }}>📤 {t.export}</button>
              </div>
            </div>

            {/* 标签过滤 */}
            {allTags.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: THEME.textMuted, alignSelf: 'center' }}>{t.tags}:</span>
                <button onClick={() => setSelectedTag(null)} style={{
                  padding: '3px 8px', borderRadius: '4px', border: 'none',
                  background: !selectedTag ? `${THEME.primary}30` : THEME.bgCard,
                  color: !selectedTag ? THEME.primaryLight : THEME.textSecondary, cursor: 'pointer', fontSize: '10px',
                }}>{t.all}</button>
                {allTags.map(tag => (
                  <button key={tag} onClick={() => setSelectedTag(tag)} style={{
                    padding: '3px 8px', borderRadius: '4px', border: 'none',
                    background: selectedTag === tag ? `${THEME.primary}30` : THEME.bgCard,
                    color: selectedTag === tag ? THEME.primaryLight : THEME.textSecondary, cursor: 'pointer', fontSize: '10px',
                  }}>{tag}</button>
                ))}
              </div>
            )}

            {filteredVocab.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: THEME.textMuted }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                <h3 style={{ margin: '0 0 10px', color: THEME.textSecondary }}>{t.noVocab}</h3>
                <button onClick={() => setView('upload')} style={{
                  marginTop: '10px', padding: '10px 20px', borderRadius: '8px', border: 'none',
                  background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
                  color: '#fff', cursor: 'pointer', fontSize: '13px',
                }}>{t.upload}</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
                {filteredVocab.map(item => {
                  const lang = ALL_LANGUAGES.find(l => l.code === item.sourceLanguage);
                  const isDue = isDueForReview(item);
                  return (
                    <div key={item.id} style={{
                      background: THEME.bgCard, borderRadius: '12px', padding: '12px',
                      border: isDue ? `1px solid ${THEME.warning}50` : item.wrongCount > 0 ? `1px solid ${THEME.error}30` : `1px solid ${THEME.border}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px' }}>{lang?.flag}</span>
                          <span style={{ fontSize: '15px', fontWeight: '600' }}>{item.original}</span>
                          <button onClick={() => speak(item.original, item.sourceLanguage)} style={{
                            padding: '2px 4px', borderRadius: '4px', border: 'none',
                            background: `${THEME.primary}30`, cursor: 'pointer', fontSize: '9px'
                          }}>🔊</button>
                        </div>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          <button onClick={() => toggleStar(item.id)} style={{
                            padding: '2px', borderRadius: '4px', border: 'none',
                            background: 'transparent', cursor: 'pointer', fontSize: '11px', opacity: item.starred ? 1 : 0.4,
                          }}>⭐</button>
                          <button onClick={() => setEditingVocab(item)} style={{
                            padding: '2px 4px', borderRadius: '4px', border: 'none',
                            background: `${THEME.primary}20`, color: THEME.primaryLight, cursor: 'pointer', fontSize: '9px',
                          }}>✏️</button>
                          <button onClick={() => deleteVocab(item.id)} style={{
                            padding: '2px 4px', borderRadius: '4px', border: 'none',
                            background: `${THEME.error}20`, color: THEME.error, cursor: 'pointer', fontSize: '9px',
                          }}>🗑</button>
                        </div>
                      </div>

                      {item.phonetic && <div style={{ fontSize: '10px', color: THEME.primaryDark, marginBottom: '4px' }}>{item.phonetic}</div>}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        {item.partOfSpeech && <span style={{ padding: '1px 5px', background: `${THEME.primary}25`, borderRadius: '3px', fontSize: '9px', color: THEME.primaryLight }}>{item.partOfSpeech}</span>}
                        <span style={{ padding: '1px 5px', background: `${THEME.success}20`, borderRadius: '3px', fontSize: '9px', color: THEME.success }}>✓{item.correctCount}</span>
                        {item.wrongCount > 0 && <span style={{ padding: '1px 5px', background: `${THEME.error}20`, borderRadius: '3px', fontSize: '9px', color: THEME.error }}>✗{item.wrongCount}</span>}
                        {isDue && <span style={{ padding: '1px 5px', background: `${THEME.warning}25`, borderRadius: '3px', fontSize: '9px', color: THEME.warning }}>🔔</span>}
                      </div>

                      {(item.tags || []).length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          {item.tags.map(tag => (
                            <span key={tag} style={{ padding: '1px 5px', background: `${THEME.primary}20`, borderRadius: '3px', fontSize: '9px', color: THEME.primaryLight }}>{tag}</span>
                          ))}
                        </div>
                      )}

                      <MasteryProgressBar points={item.masteryPoints} level={item.masteryLevel} compact />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 测验设置页面 */}
        {view === 'start-quiz' && (
          <div style={{ maxWidth: '700px', margin: '20px auto' }}>
            <div style={{ background: THEME.bgCard, borderRadius: '20px', padding: '24px', border: `1px solid ${THEME.border}` }}>
              <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>🎯 {t.quizSettings}</h2>

              {vocabList.length < 4 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: THEME.textMuted }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📚</div>
                  <p>{t.needWords}</p>
                  <button onClick={() => setView('upload')} style={{
                    marginTop: '12px', padding: '10px 20px', borderRadius: '8px', border: 'none',
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
                    color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                  }}>{t.upload}</button>
                </div>
              ) : (
                <>
                  {/* 母语选择 */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: THEME.text, marginBottom: '10px' }}>🏠 {t.nativeLang}</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {ALL_LANGUAGES.slice(0, 8).map(lang => (
                        <button key={lang.code} onClick={() => { setNativeLang(lang.code); setTargetLangs(prev => prev.filter(c => c !== lang.code)); }} style={{
                          padding: '8px 12px', borderRadius: '8px',
                          border: nativeLang === lang.code ? `2px solid ${THEME.success}` : `2px solid ${THEME.border}`,
                          background: nativeLang === lang.code ? `${THEME.success}25` : THEME.bgCard,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                          <span style={{ fontSize: '16px' }}>{lang.flag}</span>
                          <span style={{ fontSize: '11px', color: nativeLang === lang.code ? THEME.success : THEME.textSecondary }}>{lang.nativeName}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 学习语言选择 */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: THEME.text, marginBottom: '10px' }}>🎓 {t.targetLang}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {ALL_LANGUAGES.filter(l => l.code !== nativeLang).slice(0, 8).map(lang => {
                        const isSelected = targetLangs.includes(lang.code);
                        return (
                          <button key={lang.code} onClick={() => toggleTargetLang(lang.code)} style={{
                            padding: '10px 6px', borderRadius: '10px',
                            border: isSelected ? `2px solid ${THEME.primary}` : `2px solid ${THEME.border}`,
                            background: isSelected ? `${THEME.primary}30` : THEME.bgCard,
                            cursor: 'pointer',
                          }}>
                            <div style={{ fontSize: '22px', marginBottom: '2px' }}>{lang.flag}</div>
                            <div style={{ fontSize: '10px', fontWeight: '600', color: isSelected ? THEME.primaryLight : THEME.text }}>{lang.nativeName}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 测验模式 */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: THEME.text, marginBottom: '10px' }}>🎮 {t.quizMode}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { id: 'choice', label: t.modeChoice, icon: '📝' },
                        { id: 'listening', label: t.modeListening, icon: '🎧' },
                        { id: 'spelling', label: t.modeSpelling, icon: '⌨️' },
                      ].map(mode => (
                        <button key={mode.id} onClick={() => setQuizMode(mode.id)} style={{
                          flex: 1, padding: '12px', borderRadius: '10px',
                          border: quizMode === mode.id ? `2px solid ${THEME.primary}` : `2px solid ${THEME.border}`,
                          background: quizMode === mode.id ? `${THEME.primary}25` : THEME.bgCard,
                          cursor: 'pointer', textAlign: 'center',
                        }}>
                          <div style={{ fontSize: '20px', marginBottom: '4px' }}>{mode.icon}</div>
                          <div style={{ fontSize: '11px', color: quizMode === mode.id ? THEME.primaryLight : THEME.textSecondary }}>{mode.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 难度和时间 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: THEME.text, marginBottom: '10px' }}>📊 {t.difficulty}</div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[
                          { id: 'easy', label: t.easy },
                          { id: 'medium', label: t.medium },
                          { id: 'hard', label: t.hard },
                        ].map(d => (
                          <button key={d.id} onClick={() => setDifficulty(d.id)} style={{
                            flex: 1, padding: '8px', borderRadius: '8px',
                            border: difficulty === d.id ? `2px solid ${THEME.primary}` : `2px solid ${THEME.border}`,
                            background: difficulty === d.id ? `${THEME.primary}25` : THEME.bgCard,
                            cursor: 'pointer', fontSize: '11px', color: difficulty === d.id ? THEME.primaryLight : THEME.textSecondary,
                          }}>{d.label}</button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: THEME.text, marginBottom: '10px' }}>⏱️ {t.timeLimit}</div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[
                          { value: 0, label: t.noLimit },
                          { value: 30, label: '30s' },
                          { value: 60, label: '60s' },
                        ].map(time => (
                          <button key={time.value} onClick={() => setTimeLimit(time.value)} style={{
                            flex: 1, padding: '8px', borderRadius: '8px',
                            border: timeLimit === time.value ? `2px solid ${THEME.primary}` : `2px solid ${THEME.border}`,
                            background: timeLimit === time.value ? `${THEME.primary}25` : THEME.bgCard,
                            cursor: 'pointer', fontSize: '11px', color: timeLimit === time.value ? THEME.primaryLight : THEME.textSecondary,
                          }}>{time.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 摘要 */}
                  <div style={{ padding: '14px', background: THEME.bgCard, borderRadius: '10px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: THEME.textMuted }}>{t.nativeLang}</div>
                        <div style={{ fontSize: '24px' }}>{nativeLangInfo?.flag}</div>
                      </div>
                      <div style={{ fontSize: '20px', color: THEME.textMuted }}>→</div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: THEME.textMuted }}>{t.targetLang}</div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {targetLangs.length > 0 ? targetLangs.map(c => (
                            <span key={c} style={{ fontSize: '24px' }}>{ALL_LANGUAGES.find(l => l.code === c)?.flag}</span>
                          )) : <span style={{ color: THEME.textMuted, fontSize: '12px' }}>-</span>}
                        </div>
                      </div>
                      <div style={{ width: '1px', height: '30px', background: THEME.border }} />
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: THEME.textMuted }}>{t.words}</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: THEME.primaryLight }}>
                          {difficulty === 'easy' ? 5 : difficulty === 'hard' ? 15 : 10}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button onClick={startQuiz} disabled={targetLangs.length === 0 || isGeneratingQuiz} style={{
                    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                    background: targetLangs.length > 0 && !isGeneratingQuiz ? `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)` : THEME.border,
                    color: targetLangs.length > 0 && !isGeneratingQuiz ? '#fff' : THEME.textMuted,
                    cursor: targetLangs.length > 0 && !isGeneratingQuiz ? 'pointer' : 'not-allowed',
                    fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}>
                    {isGeneratingQuiz ? (
                      <>
                        <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        {t.generating}
                      </>
                    ) : `${t.startQuiz} 🚀`}
                  </button>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </>
              )}
            </div>
          </div>
        )}

        {/* 测验页面 */}
        {view === 'quiz' && quizState && !showPoster && (
          <div>
            {/* 进度条和计时器 */}
            <div style={{ maxWidth: '800px', margin: '0 auto 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ color: THEME.textSecondary, fontSize: '12px' }}>{t.question} {quizState.roundIndex + 1} / {quizState.quizData.length}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {timeLimit > 0 && timer > 0 && (
                    <span style={{ color: timer <= 10 ? THEME.error : THEME.warning, fontSize: '14px', fontWeight: '600' }}>⏱️ {timer}s</span>
                  )}
                  <span style={{ color: THEME.success, fontSize: '12px', fontWeight: '600' }}>
                    {t.correct}: {Object.values(quizState.langStats).reduce((s, l) => s + l.correct, 0)}
                  </span>
                </div>
              </div>
              <div style={{ height: '4px', background: THEME.border, borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${((quizState.roundIndex + 1) / quizState.quizData.length) * 100}%`, background: `linear-gradient(90deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`, borderRadius: '2px' }} />
              </div>
            </div>

            {/* 源词汇 */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ padding: '4px 10px', background: THEME.bgCard, borderRadius: '16px', fontSize: '11px', color: THEME.textSecondary }}>
                {ALL_LANGUAGES.find(l => l.code === quizState.quizData[quizState.roundIndex].sourceLanguage)?.flag} Source
              </span>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '12px' }}>
                {quizMode === 'listening' && !quizState.showResults ? (
                  <div style={{ fontSize: '48px' }}>🔊</div>
                ) : (
                  <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>{quizState.quizData[quizState.roundIndex].original}</h2>
                )}
                <button onClick={() => speak(quizState.quizData[quizState.roundIndex].original, quizState.quizData[quizState.roundIndex].sourceLanguage)} style={{
                  width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                  background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
                  cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>🔊</button>
              </div>
              
              {quizState.quizData[quizState.roundIndex].phonetic && quizMode !== 'listening' && (
                <p style={{ margin: '6px 0 0', color: THEME.primaryDark, fontSize: '13px' }}>{quizState.quizData[quizState.roundIndex].phonetic}</p>
              )}
              
              <div style={{ marginTop: '10px', padding: '6px 14px', background: `${THEME.success}20`, borderRadius: '8px', display: 'inline-block' }}>
                <span style={{ color: THEME.success, fontSize: '12px' }}>
                  {nativeLangInfo?.flag} {quizState.quizData[quizState.roundIndex].nativeTranslation}
                </span>
              </div>
            </div>

            {/* 答题区 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(targetLangs.length, 3)}, 1fr)`,
              gap: '14px', marginBottom: '20px',
            }}>
              {Object.entries(quizState.currentRound).map(([lang, q]) => {
                const langInfo = ALL_LANGUAGES.find(l => l.code === lang);
                const isAnswered = quizState.showResults;

                return (
                  <div key={lang} style={{
                    background: THEME.bgCard, borderRadius: '14px', padding: '16px',
                    border: `1px solid ${THEME.border}`,
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                      <span style={{ padding: '5px 12px', background: THEME.bgCard, borderRadius: '16px', fontSize: '13px' }}>
                        {langInfo?.flag} {langInfo?.nativeName}
                      </span>
                    </div>

                    {q.mode === 'spelling' ? (
                      <div>
                        <input
                          value={spellingInput[lang] || ''}
                          onChange={e => handleSpellingInput(lang, e.target.value)}
                          disabled={isAnswered}
                          placeholder="Type the word..."
                          style={{
                            width: '100%', padding: '12px', borderRadius: '10px',
                            border: isAnswered 
                              ? ((spellingInput[lang] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase() 
                                ? `2px solid ${THEME.success}` : `2px solid ${THEME.error}`)
                              : `2px solid ${THEME.border}`,
                            background: THEME.bgCard, color: THEME.text,
                            fontSize: '16px', textAlign: 'center', outline: 'none',
                          }}
                        />
                        {isAnswered && (spellingInput[lang] || '').trim().toLowerCase() !== q.correctAnswer.toLowerCase() && (
                          <div style={{ marginTop: '10px', textAlign: 'center', color: THEME.success, fontSize: '14px' }}>
                            ✓ {q.correctAnswer}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {q.options?.map(opt => {
                          const isThis = opt.id === quizState.answers[lang];
                          let bg = THEME.bgCard;
                          let border = THEME.border;

                          if (isAnswered) {
                            if (opt.isCorrect) { bg = `${THEME.success}25`; border = THEME.success; }
                            else if (isThis) { bg = `${THEME.error}25`; border = THEME.error; }
                          } else if (isThis) { bg = `${THEME.primary}25`; border = THEME.primary; }

                          return (
                            <button key={opt.id} onClick={() => selectAnswer(lang, opt.id)} disabled={isAnswered} style={{
                              padding: '10px 12px', borderRadius: '8px',
                              border: `2px solid ${border}`, background: bg,
                              color: THEME.text, cursor: isAnswered ? 'default' : 'pointer',
                              fontSize: '13px', textAlign: 'center',
                            }}>{opt.text}</button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 学习讲解区域 - 答题后显示 */}
            {quizState.showResults && (
              <div style={{
                background: `linear-gradient(135deg, ${THEME.primary}20 0%, ${THEME.primaryDark}20 100%)`,
                borderRadius: '16px', padding: '20px', marginBottom: '20px',
                border: `1px solid ${THEME.primary}30`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px' }}>📖</span>
                  <h3 style={{ margin: 0, fontSize: '16px', color: THEME.primaryLight }}>
                    {nativeLang === 'zh' ? '学习要点' : 'Learning Notes'}
                  </h3>
                </div>

                {/* 词汇详情 */}
                <div style={{ 
                  background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '24px', fontWeight: '700' }}>
                      {quizState.quizData[quizState.roundIndex].original}
                    </span>
                    <button onClick={() => speak(quizState.quizData[quizState.roundIndex].original, quizState.quizData[quizState.roundIndex].sourceLanguage)} style={{
                      padding: '4px 8px', borderRadius: '6px', border: 'none',
                      background: `${THEME.primary}40`, cursor: 'pointer', fontSize: '12px',
                    }}>🔊 {nativeLang === 'zh' ? '发音' : 'Play'}</button>
                    {quizState.quizData[quizState.roundIndex].partOfSpeech && (
                      <span style={{ 
                        padding: '3px 10px', background: `${THEME.primary}30`, 
                        borderRadius: '6px', fontSize: '12px', color: THEME.primaryLight 
                      }}>
                        {quizState.quizData[quizState.roundIndex].partOfSpeech}
                      </span>
                    )}
                  </div>
                  
                  {quizState.quizData[quizState.roundIndex].phonetic && (
                    <div style={{ color: THEME.primaryDark, fontSize: '14px', marginBottom: '8px' }}>
                      {quizState.quizData[quizState.roundIndex].phonetic}
                    </div>
                  )}
                  
                  {/* 母语含义 */}
                  <div style={{ 
                    padding: '10px 14px', background: `${THEME.success}20`, 
                    borderRadius: '8px', marginBottom: '12px', borderLeft: `3px solid ${THEME.success}`,
                  }}>
                    <div style={{ fontSize: '11px', color: THEME.success, marginBottom: '4px' }}>
                      {nativeLangInfo?.flag} {nativeLang === 'zh' ? '中文含义' : 'Meaning'}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: THEME.text }}>
                      {quizState.quizData[quizState.roundIndex].nativeTranslation}
                    </div>
                  </div>

                  {/* 例句 */}
                  {quizState.quizData[quizState.roundIndex].exampleSentence && (
                    <div style={{ 
                      padding: '10px 14px', background: THEME.bgCard, 
                      borderRadius: '8px', borderLeft: `3px solid ${THEME.primary}`,
                    }}>
                      <div style={{ fontSize: '11px', color: THEME.textSecondary, marginBottom: '4px' }}>
                        📝 {nativeLang === 'zh' ? '例句' : 'Example'}
                      </div>
                      <div style={{ fontSize: '14px', color: THEME.text, fontStyle: 'italic' }}>
                        "{quizState.quizData[quizState.roundIndex].exampleSentence}"
                      </div>
                    </div>
                  )}
                </div>

                {/* 多语言对照表 */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', color: THEME.textSecondary, marginBottom: '10px' }}>
                    🌍 {nativeLang === 'zh' ? '多语言对照' : 'Translations'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                    {Object.entries(quizState.currentRound).map(([lang, q]) => {
                      const langInfo = ALL_LANGUAGES.find(l => l.code === lang);
                      const userAnswer = quizMode === 'spelling' 
                        ? (spellingInput[lang] || '').trim()
                        : q.options?.find(o => o.id === quizState.answers[lang])?.text;
                      const isCorrect = quizMode === 'spelling'
                        ? userAnswer.toLowerCase() === q.correctAnswer.toLowerCase()
                        : q.options?.find(o => o.id === quizState.answers[lang])?.isCorrect;
                      
                      return (
                        <div key={lang} style={{
                          padding: '10px 12px', borderRadius: '10px',
                          background: isCorrect ? `${THEME.success}20` : `${THEME.error}20`,
                          border: `1px solid ${isCorrect ? THEME.success + '50' : THEME.error + '50'}`,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '14px' }}>{langInfo?.flag} {langInfo?.nativeName}</span>
                            <button onClick={() => speak(q.correctAnswer, lang)} style={{
                              padding: '2px 6px', borderRadius: '4px', border: 'none',
                              background: `${THEME.primary}30`, cursor: 'pointer', fontSize: '10px',
                            }}>🔊</button>
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: THEME.text }}>
                            {q.correctAnswer}
                          </div>
                          {!isCorrect && userAnswer && (
                            <div style={{ fontSize: '11px', color: THEME.error, marginTop: '4px', textDecoration: 'line-through' }}>
                              {nativeLang === 'zh' ? '你的答案' : 'Your answer'}: {userAnswer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 记忆小贴士 */}
                <div style={{ 
                  marginTop: '12px', padding: '10px 14px', 
                  background: `${THEME.warning}20`, borderRadius: '8px',
                  borderLeft: `3px solid ${THEME.warning}`,
                }}>
                  <div style={{ fontSize: '11px', color: THEME.warning, marginBottom: '4px' }}>
                    💡 {nativeLang === 'zh' ? '记忆技巧' : 'Memory Tip'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#fef3c7' }}>
                    {nativeLang === 'zh' 
                      ? `试着用「${quizState.quizData[quizState.roundIndex].original}」造一个与你生活相关的句子，这样更容易记住！`
                      : `Try making a sentence about your life using "${quizState.quizData[quizState.roundIndex].original}" to remember it better!`
                    }
                  </div>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div style={{ textAlign: 'center' }}>
              {!quizState.showResults ? (
                <button onClick={submitRound} disabled={
                  quizMode === 'spelling' 
                    ? Object.keys(spellingInput).length < targetLangs.length
                    : Object.keys(quizState.answers).length < targetLangs.length
                } style={{
                  padding: '12px 40px', borderRadius: '10px', border: 'none',
                  background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
                  color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                  opacity: (quizMode === 'spelling' ? Object.keys(spellingInput).length : Object.keys(quizState.answers).length) >= targetLangs.length ? 1 : 0.5,
                }}>{t.submit}</button>
              ) : (
                <button onClick={nextRound} style={{
                  padding: '12px 40px', borderRadius: '10px', border: 'none',
                  background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
                  color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                }}>
                  {quizState.roundIndex + 1 < quizState.quizData.length ? t.next + ' →' : t.seeResults + ' 🎉'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* 历史记录 */}
        {view === 'history' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '700' }}>📊 {t.history}</h2>

            {quizHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', background: THEME.bgCard, borderRadius: '16px', color: THEME.textMuted }}>
                <div style={{ fontSize: '48px', marginBottom: '14px' }}>📝</div>
                <h3 style={{ margin: 0, color: THEME.textSecondary }}>No history yet</h3>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {quizHistory.slice(0, 20).map((record) => {
                  const getGradeColor = (acc) => acc >= 90 ? THEME.gold : acc >= 80 ? THEME.success : acc >= 70 ? '#3b82f6' : acc >= 60 ? THEME.warning : THEME.error;
                  const modeIcons = { choice: '📝', listening: '🎧', spelling: '⌨️' };
                  return (
                    <div key={record.id} style={{
                      background: THEME.bgCard, borderRadius: '12px',
                      padding: '14px 16px', border: `1px solid ${THEME.border}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '44px', height: '44px', borderRadius: '10px',
                            background: `${getGradeColor(record.accuracy)}20`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px', fontWeight: '700', color: getGradeColor(record.accuracy),
                          }}>{record.accuracy}%</div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                              <span>{modeIcons[record.mode] || '📝'}</span>
                              <span style={{ color: THEME.text, fontSize: '13px', fontWeight: '500' }}>{record.correct}/{record.totalQuestions}</span>
                            </div>
                            <div style={{ color: THEME.textMuted, fontSize: '11px' }}>
                              {formatDate(record.date)} · {Math.floor(record.duration / 60)}m {record.duration % 60}s
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {record.languages?.map(l => <span key={l} style={{ fontSize: '16px' }}>{ALL_LANGUAGES.find(x => x.code === l)?.flag}</span>)}
                        </div>
                      </div>
                      
                      {record.langStats && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {Object.entries(record.langStats).map(([lang, stats]) => {
                            const langInfo = ALL_LANGUAGES.find(l => l.code === lang);
                            const acc = stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0;
                            return (
                              <div key={lang} style={{ padding: '6px 10px', background: THEME.bgCard, borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '14px' }}>{langInfo?.flag}</span>
                                <span style={{ fontSize: '11px', color: acc >= 80 ? THEME.success : acc >= 60 ? THEME.warning : THEME.error, fontWeight: '600' }}>
                                  {stats.correct}/{stats.total}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 响应式样式 */}
      <style>{`
        @media (max-width: 640px) {
          .nav-label { display: none; }
        }
      `}</style>
    </div>
  );
}
