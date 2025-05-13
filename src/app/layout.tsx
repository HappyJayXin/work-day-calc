import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "工作日換算",
  description:
    "這是讓投資變得更生活化工具，別再說投資沒感覺，一賺錢就放假，虧錢直接加班，用血汗值看懂你的股票盈虧！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          fontFamily:
            'var(--font-geist-sans), "Noto Sans TC", "PingFang TC", "Heiti TC", sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
