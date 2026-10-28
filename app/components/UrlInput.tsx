"use client";
import GetPicFromPostUrl from "@/app/components/GetPicFromPostUrl";

export function UrlInput() {
  return <main className="app-shell">
    <header className="app-header">
      <a href="https://2550505.com" target="_blank" rel="noreferrer" className="brand"><span className="brand-mark">毛</span> 毛怪俱乐部 <span className="brand-divider">/</span> 分享卡片</a>
      <a href="https://2550505.com" target="_blank" rel="noreferrer" className="back-link">前往毛怪俱乐部 ↗</a>
    </header>
    <div className="page-content">
      <div className="intro"><span className="eyebrow">SHARE THE MOMENT</span><h1>把喜欢的帖子<br /><span>分享给更多人。</span></h1><p>复制帖子链接，生成一张可以保存和分享的长图。</p></div>
      <GetPicFromPostUrl />
    </div>
  </main>;
}
