import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: "帖子编号无效" }, { status: 400 });
  }
  try {
    const response = await fetch(`https://2550505.com/post/detail/${id}`, {
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("upstream error");
    const data = await response.json();
    if (data.code !== 0 || !data.info?.author || typeof data.info.content !== "string") {
      return NextResponse.json({ error: "未找到帖子，或该帖子无法公开访问" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "无法连接毛怪俱乐部，请稍后重试" }, { status: 502 });
  }
}
