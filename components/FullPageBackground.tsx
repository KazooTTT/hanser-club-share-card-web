"use client";

import Image from "next/image";
import React from "react";

const FullPageBackground = () => {
  // get the width and height of the viewport
  const [viewportWidth, setViewportWidth] = React.useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = React.useState(
    window.innerHeight,
  );

  React.useEffect(() => {
    if (window) {
      const handleResize = () => {
        setViewportWidth(window.innerWidth);
        setViewportHeight(window.innerHeight);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <Image
      className="absolute inset-0 w-full h-full object-cover blur-md mix-blend-multiply filter brightness-50"
      alt="main background image"
      src="/background.jpeg"
      width={viewportWidth}
      height={viewportHeight}
    />
  );
};

export default FullPageBackground;
