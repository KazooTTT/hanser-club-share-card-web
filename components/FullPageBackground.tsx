"use client";

import Image from "next/image";
import React from "react";

const FullPageBackground = () => {
  return (
    <Image
      className="absolute inset-0 w-full h-full object-cover blur-md mix-blend-multiply filter brightness-50"
      alt="main background image"
      src="/background.jpeg"
    />
  );
};

export default FullPageBackground;
