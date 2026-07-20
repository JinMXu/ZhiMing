import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "知命 · 以古之法问今之事",
  description: "生辰八字、塔罗牌、周易起卦、每日运势——由 AI 解读的东方占卜",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
