# WordIQ - AI 驱动的多语言词汇学习

## 🚀 快速部署指南

### 第一步：创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 并注册/登录
2. 点击 "New Project" 创建新项目
3. 选择区域（建议选择 Singapore 或 Hong Kong）
4. 设置数据库密码（请保存好）
5. 等待项目创建完成（约2分钟）

### 第二步：配置数据库

1. 在 Supabase Dashboard 左侧点击 "SQL Editor"
2. 点击 "New Query"
3. 复制 `supabase/schema.sql` 文件的全部内容
4. 粘贴到编辑器中
5. 点击 "Run" 执行

### 第三步：配置 OAuth 登录

#### Google 登录
1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目或选择现有项目
3. 进入 "APIs & Services" → "Credentials"
4. 创建 "OAuth 2.0 Client ID"
5. 添加授权重定向 URI: `https://你的项目.supabase.co/auth/v1/callback`
6. 复制 Client ID 和 Client Secret

在 Supabase Dashboard:
1. 进入 "Authentication" → "Providers"
2. 启用 Google，填入 Client ID 和 Secret

#### GitHub 登录
1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建新的 OAuth App
3. Authorization callback URL: `https://你的项目.supabase.co/auth/v1/callback`
4. 复制 Client ID 和 Client Secret

在 Supabase Dashboard 填入相应信息。

#### Facebook 登录
1. 访问 [Facebook Developers](https://developers.facebook.com)
2. 创建应用，选择 "Consumer" 类型
3. 添加 Facebook Login 产品
4. 有效 OAuth 重定向 URI: `https://你的项目.supabase.co/auth/v1/callback`
5. 复制 App ID 和 App Secret

在 Supabase Dashboard 填入相应信息。

### 第四步：获取 Supabase 密钥

在 Supabase Dashboard:
1. 进入 "Settings" → "API"
2. 复制以下信息：
   - Project URL
   - anon/public key
   - service_role key (保密！)

### 第五步：部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 访问 [vercel.com](https://vercel.com) 并登录
3. 点击 "Import Project" 导入 GitHub 仓库
4. 配置环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_APP_URL=https://wordiq.app
ADMIN_PASSWORD=你的管理员密码
```

5. 点击 "Deploy" 部署

### 第六步：配置域名

1. 在 Vercel Dashboard 进入项目设置
2. 点击 "Domains"
3. 添加 `wordiq.app`
4. 按照提示在 Cloudflare 添加 DNS 记录

### 第七步：配置 API 密钥

1. 访问 `https://wordiq.app/admin`
2. 使用管理员密码登录
3. 在 "API 配置" 中填入 Anthropic API 密钥
4. 设置每日使用限制

---

## 📁 项目结构

```
wordiq/
├── app/
│   ├── page.jsx              # 主应用
│   ├── layout.jsx            # 根布局
│   ├── globals.css           # 全局样式
│   ├── auth/
│   │   ├── page.jsx          # 登录页面
│   │   └── callback/route.js # OAuth 回调
│   ├── admin/
│   │   └── page.jsx          # 管理后台
│   └── api/
│       ├── analyze/route.js  # 图片分析
│       ├── translate/route.js # 翻译
│       ├── sync/route.js     # 数据同步
│       └── admin/
│           ├── config/route.js # 配置管理
│           └── stats/route.js  # 统计数据
├── lib/
│   ├── supabase.js           # Supabase 客户端
│   └── api.js                # API 封装
├── supabase/
│   └── schema.sql            # 数据库结构
├── package.json
├── next.config.js
├── vercel.json
└── .env.example
```

---

## 💡 功能说明

### 用户功能
- 📸 上传截图，AI 自动识别词汇
- 🌍 支持 12 种语言翻译
- 🎯 三种测验模式：选择、听力、拼写
- 📊 间隔重复复习系统（SRS）
- ☁️ 云端同步，多设备共享
- 📤 数据导入导出

### 管理功能
- 🔑 API 密钥配置
- 📊 用户统计数据
- 💰 订阅管理
- 🚫 使用限制设置

---

## 🔒 安全说明

- API 密钥存储在服务端数据库，不暴露给前端
- 使用 Supabase RLS 保护用户数据隔离
- 管理后台需要密码验证
- OAuth 登录使用行业标准协议

---

## 📞 支持

如有问题，请联系开发者。
