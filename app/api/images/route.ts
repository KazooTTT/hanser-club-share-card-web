import { NextRequest, NextResponse } from "next/server";

const allowedHosts = new Set(["2550505.com", "cdn.2550505.com", "cdn.ihan.club"]);
const maxImageSize = 20 * 1024 * 1024;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.nextUrl.searchParams.get("url") || "");
    if (url.protocol !== "https:" || !allowedHosts.has(url.hostname) || url.port) throw new Error("invalid image host");
    const response = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: "error" });
    const type = response.headers.get("content-type") || "";
    if (!response.ok || !response.body || !type.startsWith("image/") || type.includes("svg") || Number(response.headers.get("content-length")) > maxImageSize) throw new Error("invalid image");
    let size = 0;
    const body = response.body.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        size += chunk.byteLength;
        if (size > maxImageSize) throw new Error("image too large");
        controller.enqueue(chunk);
      },
    }));
    return new Response(body, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=3600" } });
  } catch {
    return NextResponse.json({ error: "图片加载失败" }, { status: 502 });
  }
}
