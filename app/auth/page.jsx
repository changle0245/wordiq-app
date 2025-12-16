'use client';

import React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const THEME = {
  primary: '#1DB954',
  primaryDark: '#168D40',
  bgDark: '#0A1F1A',
  bgCard: '#0F2A23',
  border: 'rgba(29, 185, 84, 0.2)',
  text: '#E8F5E9',
  textSecondary: '#81C784',
};

export default function AuthPage() {
  const supabase = createClientComponentClient();
  
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${THEME.bgDark} 0%, ${THEME.bgCard} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, sans-serif', padding: '20px',
    }}>
      <div style={{
        background: THEME.bgCard, borderRadius: '24px', padding: '40px',
        border: `1px solid ${THEME.border}`, width: '100%', maxWidth: '420px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 16px',
            background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
          }}>📸</div>
          <h1 style={{ margin: '0 0 8px', color: THEME.text, fontSize: '28px', fontWeight: '700' }}>
            WordIQ
          </h1>
          <p style={{ margin: 0, color: THEME.textSecondary, fontSize: '14px' }}>
            AI 驱动的多语言词汇学习
          </p>
        </div>

        {/* Supabase Auth UI */}
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: THEME.primary,
                  brandAccent: THEME.primaryDark,
                  inputBackground: THEME.bgDark,
                  inputBorder: THEME.border,
                  inputBorderFocus: THEME.primary,
                  inputBorderHover: THEME.primary,
                  inputText: THEME.text,
                  inputPlaceholder: THEME.textSecondary,
                },
                borderWidths: {
                  buttonBorderWidth: '0px',
                  inputBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '10px',
                  buttonBorderRadius: '10px',
                  inputBorderRadius: '10px',
                },
              },
            },
            style: {
              button: {
                background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
                color: '#fff',
                fontWeight: '600',
                padding: '12px 16px',
              },
              anchor: {
                color: THEME.primary,
              },
              message: {
                color: THEME.textSecondary,
              },
              label: {
                color: THEME.textSecondary,
              },
            },
          }}
          providers={['google', 'github', 'facebook']}
          redirectTo={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`}
          localization={{
            variables: {
              sign_in: {
                email_label: '邮箱',
                password_label: '密码',
                button_label: '登录',
                loading_button_label: '登录中...',
                social_provider_text: '使用 {{provider}} 登录',
                link_text: '已有账号？登录',
              },
              sign_up: {
                email_label: '邮箱',
                password_label: '密码',
                button_label: '注册',
                loading_button_label: '注册中...',
                social_provider_text: '使用 {{provider}} 注册',
                link_text: '没有账号？注册',
              },
              forgotten_password: {
                email_label: '邮箱',
                button_label: '发送重置链接',
                link_text: '忘记密码？',
              },
            },
          }}
        />

        {/* 返回首页 */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{ color: THEME.textSecondary, fontSize: '14px', textDecoration: 'none' }}>
            ← 返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
