import './globals.css';

export const metadata = {
  title: 'WordIQ - AI 驱动的多语言词汇学习',
  description: '上传截图，AI自动识别词汇，智能测验，掌握多语言',
  keywords: 'vocabulary, language learning, AI, flashcards, quiz',
  authors: [{ name: 'WordIQ' }],
  openGraph: {
    title: 'WordIQ - AI 驱动的多语言词汇学习',
    description: '上传截图，AI自动识别词汇，智能测验，掌握多语言',
    url: 'https://wordiq.app',
    siteName: 'WordIQ',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WordIQ - AI 驱动的多语言词汇学习',
    description: '上传截图，AI自动识别词汇，智能测验，掌握多语言',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0A1F1A" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
