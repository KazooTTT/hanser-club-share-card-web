import getPicFromURL from "@/utils/getPic";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const postUrl = request.nextUrl.searchParams.get("postUrl");
  if (postUrl) {
    return new Response(await getPicFromURL(postUrl), {
      status: 200,
    });
  }
}
