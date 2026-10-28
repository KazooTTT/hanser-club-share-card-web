import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "毛怪俱乐部分享卡片",
  description: "将毛怪俱乐部帖子生成分享长图。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
