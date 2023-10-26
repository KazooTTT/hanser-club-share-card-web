"use client";

import FullPageBackground from "@/app/components/FullPageBackground";
import "./25550505.css";
import { UrlInput } from "./components/UrlInput";

function IndexPage() {
  return (
    <div className="bg-gradient-to-tr from-red-100 to-blue-200 relative h-screen w-screen">
      <FullPageBackground></FullPageBackground>
      <UrlInput></UrlInput>
    </div>
  );
}

export default IndexPage;
