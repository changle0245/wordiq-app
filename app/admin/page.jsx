'use client';

import React, { useState, useEffect } from 'react';

const THEME = {
  primary: '#1DB954',
  primaryDark: '#168D40',
  bgDark: '#0A1F1A',
  bgCard: '#0F2A23',
  border: 'rgba(29, 185, 84, 0.2)',
  text: '#E8F5E9',
  textSecondary: '#81C784',
  textMuted: '#5A8F6E',
  success: '#4CAF50',
  error: '#E57373',
  warning: '#FFB74D',
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('config');
  
  // 配置数据
  const [config, setConfig] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [freeDailyLimit, setFreeDailyLimit] = useState('10');
  const [proDailyLimit, setProDailyLimit] = useState('100');
  
  // 统计数据
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);

  // 登录
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/config', {
        headers: { 'Authorization': `Bearer ${password}` }
      });
      
      if (res.ok) {
        localStorage.setItem('adminPassword', password);
        setIsLoggedIn(true);
        loadData();
      } else {
        setError('密码错误');
      }
    } catch (err) {
      setError('登录失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载数据
  const loadData = async () => {
    const savedPassword = localStorage.getItem('adminPassword');
    if (!savedPassword) return;
    
    try {
      // 加载配置
      const configRes = await fetch('/api/admin/config', {
        headers: { 'Authorization': `Bearer ${savedPassword}` }
      });
      if (configRes.ok) {
        const { config: configData } = await configRes.json();
        setConfig(configData);
        
        // 设置表单值
        configData.forEach(item => {
          if (item.key === 'free_daily_limit') setFreeDailyLimit(item.value || '10');
          if (item.key === 'pro_daily_limit') setProDailyLimit(item.value || '100');
        });
      }
      
      // 加载统计
      const statsRes = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${savedPassword}` }
      });
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
        setRecentUsers(data.recentUsers);
      }
    } catch (err) {
      console.error('Load data error:', err);
    }
  };

  // 保存配置
  const saveConfig = async (key, value) => {
    const savedPassword = localStorage.getItem('adminPassword');
    
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${savedPassword}`
        },
        body: JSON.stringify({ key, value })
      });
      
      if (res.ok) {
        alert('保存成功！');
        loadData();
      } else {
        alert('保存失败');
      }
    } catch (err) {
      alert('保存失败: ' + err.message);
    }
  };

  // 检查已保存的登录状态
  useEffect(() => {
    const savedPassword = localStorage.getItem('adminPassword');
    if (savedPassword) {
      setPassword(savedPassword);
      setIsLoggedIn(true);
      loadData();
    }
  }, []);

  // 登录页面
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${THEME.bgDark} 0%, ${THEME.bgCard} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '-apple-system, sans-serif',
      }}>
        <form onSubmit={handleLogin} style={{
          background: THEME.bgCard, borderRadius: '20px', padding: '40px',
          border: `1px solid ${THEME.border}`, width: '90%', maxWidth: '400px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔐</div>
            <h1 style={{ margin: 0, color: THEME.text, fontSize: '24px' }}>WordIQ 管理后台</h1>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: THEME.textSecondary, marginBottom: '8px', fontSize: '14px' }}>
              管理员密码
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="请输入密码"
              style={{
                width: '100%', padding: '14px', borderRadius: '10px',
                border: `1px solid ${THEME.border}`, background: THEME.bgDark,
                color: THEME.text, fontSize: '16px', outline: 'none',
              }}
            />
          </div>
          
          {error && (
            <div style={{ color: THEME.error, marginBottom: '16px', fontSize: '14px' }}>
              ❌ {error}
            </div>
          )}
          
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
            color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
          }}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    );
  }

  // 管理面板
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${THEME.bgDark} 0%, ${THEME.bgCard} 100%)`,
      fontFamily: '-apple-system, sans-serif', color: THEME.text,
    }}>
      {/* 头部 */}
      <header style={{
        padding: '16px 24px', borderBottom: `1px solid ${THEME.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>⚙️</span>
          <h1 style={{ margin: 0, fontSize: '20px' }}>WordIQ 管理后台</h1>
        </div>
        <button onClick={() => { localStorage.removeItem('adminPassword'); setIsLoggedIn(false); }} style={{
          padding: '8px 16px', borderRadius: '8px', border: `1px solid ${THEME.border}`,
          background: 'transparent', color: THEME.textSecondary, cursor: 'pointer',
        }}>退出登录</button>
      </header>

      <div style={{ display: 'flex' }}>
        {/* 侧边栏 */}
        <nav style={{
          width: '200px', padding: '20px', borderRight: `1px solid ${THEME.border}`,
          minHeight: 'calc(100vh - 60px)',
        }}>
          {[
            { id: 'config', label: '⚡ API 配置', icon: '⚡' },
            { id: 'stats', label: '📊 数据统计', icon: '📊' },
            { id: 'users', label: '👥 用户管理', icon: '👥' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              width: '100%', padding: '12px 16px', marginBottom: '8px',
              borderRadius: '10px', border: 'none', textAlign: 'left',
              background: activeTab === tab.id ? `${THEME.primary}30` : 'transparent',
              color: activeTab === tab.id ? THEME.primary : THEME.textSecondary,
              cursor: 'pointer', fontSize: '14px',
            }}>{tab.label}</button>
          ))}
        </nav>

        {/* 主内容 */}
        <main style={{ flex: 1, padding: '24px' }}>
          {/* API 配置 */}
          {activeTab === 'config' && (
            <div>
              <h2 style={{ margin: '0 0 24px', fontSize: '20px' }}>⚡ API 配置</h2>
              
              {/* API 密钥 */}
              <div style={{
                background: THEME.bgCard, borderRadius: '16px', padding: '24px',
                border: `1px solid ${THEME.border}`, marginBottom: '20px',
              }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: THEME.textSecondary }}>
                  🔑 Anthropic API 密钥
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="sk-ant-api03-..."
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: '10px',
                      border: `1px solid ${THEME.border}`, background: THEME.bgDark,
                      color: THEME.text, fontSize: '14px', outline: 'none',
                    }}
                  />
                  <button onClick={() => saveConfig('anthropic_api_key', apiKey)} style={{
                    padding: '12px 24px', borderRadius: '10px', border: 'none',
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
                    color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                  }}>保存</button>
                </div>
                <p style={{ margin: '12px 0 0', color: THEME.textMuted, fontSize: '12px' }}>
                  从 <a href="https://console.anthropic.com/" target="_blank" style={{ color: THEME.primary }}>Anthropic Console</a> 获取 API 密钥
                </p>
              </div>

              {/* 使用限制 */}
              <div style={{
                background: THEME.bgCard, borderRadius: '16px', padding: '24px',
                border: `1px solid ${THEME.border}`,
              }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: THEME.textSecondary }}>
                  📊 每日使用限制
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: THEME.textMuted, marginBottom: '8px', fontSize: '13px' }}>
                      免费用户每日次数
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="number"
                        value={freeDailyLimit}
                        onChange={e => setFreeDailyLimit(e.target.value)}
                        style={{
                          flex: 1, padding: '10px 14px', borderRadius: '8px',
                          border: `1px solid ${THEME.border}`, background: THEME.bgDark,
                          color: THEME.text, fontSize: '14px', outline: 'none',
                        }}
                      />
                      <button onClick={() => saveConfig('free_daily_limit', freeDailyLimit)} style={{
                        padding: '10px 16px', borderRadius: '8px', border: 'none',
                        background: THEME.primary, color: '#fff', cursor: 'pointer',
                      }}>保存</button>
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', color: THEME.textMuted, marginBottom: '8px', fontSize: '13px' }}>
                      Pro 用户每日次数
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="number"
                        value={proDailyLimit}
                        onChange={e => setProDailyLimit(e.target.value)}
                        style={{
                          flex: 1, padding: '10px 14px', borderRadius: '8px',
                          border: `1px solid ${THEME.border}`, background: THEME.bgDark,
                          color: THEME.text, fontSize: '14px', outline: 'none',
                        }}
                      />
                      <button onClick={() => saveConfig('pro_daily_limit', proDailyLimit)} style={{
                        padding: '10px 16px', borderRadius: '8px', border: 'none',
                        background: THEME.primary, color: '#fff', cursor: 'pointer',
                      }}>保存</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 数据统计 */}
          {activeTab === 'stats' && (
            <div>
              <h2 style={{ margin: '0 0 24px', fontSize: '20px' }}>📊 数据统计</h2>
              
              {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  {[
                    { label: '总用户', value: stats.totalUsers, icon: '👥', color: THEME.primary },
                    { label: 'Pro 用户', value: stats.proUsers, icon: '⭐', color: THEME.warning },
                    { label: '总词汇', value: stats.totalVocabulary, icon: '📚', color: THEME.success },
                    { label: '今日调用', value: stats.todayUsage, icon: '🔥', color: '#E57373' },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: THEME.bgCard, borderRadius: '16px', padding: '20px',
                      border: `1px solid ${THEME.border}`,
                    }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                      <div style={{ color: THEME.textMuted, fontSize: '14px' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
              
              <button onClick={loadData} style={{
                padding: '10px 20px', borderRadius: '8px', border: `1px solid ${THEME.border}`,
                background: 'transparent', color: THEME.textSecondary, cursor: 'pointer',
              }}>🔄 刷新数据</button>
            </div>
          )}

          {/* 用户管理 */}
          {activeTab === 'users' && (
            <div>
              <h2 style={{ margin: '0 0 24px', fontSize: '20px' }}>👥 最近注册用户</h2>
              
              <div style={{
                background: THEME.bgCard, borderRadius: '16px',
                border: `1px solid ${THEME.border}`, overflow: 'hidden',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: THEME.bgDark }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: THEME.textSecondary, fontSize: '13px' }}>用户</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: THEME.textSecondary, fontSize: '13px' }}>邮箱</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: THEME.textSecondary, fontSize: '13px' }}>订阅</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: THEME.textSecondary, fontSize: '13px' }}>注册时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map(user => (
                      <tr key={user.id} style={{ borderTop: `1px solid ${THEME.border}` }}>
                        <td style={{ padding: '14px 16px', fontSize: '14px' }}>{user.display_name || '-'}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: THEME.textSecondary }}>{user.email}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: '6px', fontSize: '12px',
                            background: user.subscription_tier === 'pro' ? `${THEME.warning}30` : `${THEME.primary}30`,
                            color: user.subscription_tier === 'pro' ? THEME.warning : THEME.primary,
                          }}>
                            {user.subscription_tier || 'free'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: THEME.textMuted }}>
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
