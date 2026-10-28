import getPicFromURL from "@/utils/getPic";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const postUrl = request.nextUrl.searchParams.get("postUrl");
  if (!postUrl) return new Response("Missing post URL", { status: 400 });
  const image = await getPicFromURL(postUrl);
  if (!image) return new Response("Post not found", { status: 404 });
  return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/jpeg" } });
}
