"use client";

import FullPageBackground from "@/components/FullPageBackground";
import GetPicFromPostUrl from "@/components/GetPicFromPostUrl";
import "./25550505.css";
import Link from "next/link";

function IndexPage() {
  return (
    <div className="bg-gradient-to-tr from-red-100 to-blue-200 relative h-screen w-screen">
      <FullPageBackground></FullPageBackground>
      <div className="absolute inset-0 flex flex-col justify-center items-center w-5/6 max-w-lg mx-auto text-center">
        <div className="space-y-8">
          <h1 className="font-primary font-extrabold text-white text-3xl sm:text-4xl md:text-5xl md:leading-tight">
            <Link
              className="text-palette-primary hover:text-palette-dark hover:cursor-pointer"
              href={"https://2550505.com"}
              target="_blank"
            >
              毛怪俱乐部{" "}
            </Link>
            分享卡片
          </h1>
          <p className="font-secondary text-palette-light text-base md:text-lg lg:text-xl">
            输入帖子链接，输出分享卡片。
          </p>
          <GetPicFromPostUrl />
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
