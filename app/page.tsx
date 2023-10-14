"use client";

import FullPageBackground from "@/components/FullPageBackground";

function IndexPage() {
  return (
    <div className="bg-gradient-to-tr from-red-100 to-blue-200 relative h-screen w-screen">
      <FullPageBackground></FullPageBackground>
      <div className="absolute inset-0 flex flex-col justify-center items-center w-5/6 max-w-lg mx-auto text-center">
        <div className="space-y-8">
          <h1 className="font-primary font-extrabold text-white text-3xl sm:text-4xl md:text-5xl md:leading-tight">
            <span className="text-palette-primary">毛怪俱乐部 </span>
            分享卡片
          </h1>
          <p className="font-secondary text-palette-light text-base md:text-lg lg:text-xl">
            输入帖子链接，输出分享卡片。
          </p>
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
