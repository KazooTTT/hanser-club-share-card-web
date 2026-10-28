import { FormEvent, useRef, useState } from "react";
import QRCode from "qrcode";
import domtoimage from "dom-to-image";
import LongPicPreview from "./LongPicPreview";

function parsePostUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol) || !['2550505.com', 'www.2550505.com'].includes(url.hostname)) return null;
    const match = url.pathname.match(/^\/(?:post|postDetails)\/(\d+)\/?$/);
    return match ? { id: match[1], url: `https://2550505.com/post/${match[1]}` } : null;
  } catch {
    return null;
  }
}

export default function GetPicFromPostUrl() {
  const [postUrl, setPostUrl] = useState("");
  const [postInfo, setPostInfo] = useState<PostDataInfo | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [images, setImages] = useState<Record<string, string>>({});
  const [showQrCode, setShowQrCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const componentRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const parsed = parsePostUrl(postUrl);
    if (!parsed) {
      setError("请输入有效的毛怪俱乐部帖子链接，例如 https://2550505.com/post/362091");
      return;
    }
    setLoading(true);
    setError("");
    setPostInfo(null);
    try {
      const response = await fetch(`/api/post?id=${parsed.id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "帖子加载失败，请稍后重试");
      const info: PostDataInfo = data.info;
      const doc = new DOMParser().parseFromString(info.content, "text/html");
      doc.querySelectorAll("script, style, iframe, object, embed, form, link, meta, svg").forEach((element) => element.remove());
      doc.body.querySelectorAll("*").forEach((element) => {
        Array.from(element.attributes).forEach((attribute) => {
          if (attribute.name.startsWith("on") || attribute.name === "style" || (attribute.name === "href" && !/^https?:/i.test(attribute.value))) element.removeAttribute(attribute.name);
        });
      });
      const imgTags = Array.from(doc.body.querySelectorAll("img"));
      const sources = Array.from(new Set([...imgTags.map((img) => img.getAttribute("src")), info.author.avatar].filter((src): src is string => !!src)));
      const [imageEntries, qr] = await Promise.all([
        Promise.all(sources.map(async (src) => {
          const response = await fetch(`/api/images?url=${encodeURIComponent(src)}`);
          if (!response.ok) throw new Error("部分图片加载失败，请检查网络后重试");
          const blob = await response.blob();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("图片读取失败，请重试"));
            reader.readAsDataURL(blob);
          });
          return [src, dataUrl] as const;
        })),
        QRCode.toDataURL(parsed.url),
      ]);
      const urlToBase64 = Object.fromEntries(imageEntries);
      imgTags.forEach((img) => {
        const src = img.getAttribute("src");
        if (src) img.setAttribute("src", urlToBase64[src]);
        else img.remove();
      });
      setImages(urlToBase64);
      setQrCodeUrl(qr);
      setPostInfo({ ...info, content: doc.body.innerHTML });
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  async function downloadImage() {
    if (!componentRef.current || !postInfo || downloading) return;
    setDownloading(true);
    setError("");
    try {
      const element = componentRef.current;
      await Promise.all(Array.from(element.querySelectorAll("img")).map((img) => img.decode().catch(() => undefined)));
      const scale = Math.min(2, 16000 / element.offsetHeight);
      const data = await domtoimage.toPng(element, {
        width: element.offsetWidth * scale, height: element.offsetHeight * scale,
        style: { transform: `scale(${scale})`, transformOrigin: "top left", width: `${element.offsetWidth}px`, height: `${element.offsetHeight}px` },
      });
      const link = document.createElement("a");
      link.href = data;
      link.download = `${postInfo.title.replace(/[\\/:*?"<>|]/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError("图片生成失败，请重试；如果帖子太长，可以尝试在电脑上操作。");
    } finally {
      setDownloading(false);
    }
  }

  return <div className="workspace">
    <form onSubmit={handleSubmit} className="url-form">
      <label htmlFor="post-url">帖子链接</label>
      <div className="input-row">
        <input id="post-url" type="url" inputMode="url" placeholder="https://2550505.com/post/…" value={postUrl} onChange={(event) => { setPostUrl(event.target.value); setError(""); }} aria-describedby="url-hint" />
        <button className="primary-button" type="submit" disabled={loading}>{loading ? "正在生成…" : "生成预览"}</button>
      </div>
      <p id="url-hint" className="hint">支持新版和旧版帖子链接，粘贴后即可生成。</p>
    </form>
    <div className="options-row">
      <label className="checkbox-label"><input type="checkbox" checked={showQrCode} onChange={(event) => setShowQrCode(event.target.checked)} />在卡片中显示帖子二维码</label>
      <button type="button" className="download-button" disabled={!postInfo || loading || downloading} onClick={downloadImage}>{downloading ? "正在生成图片…" : "下载长图"}</button>
    </div>
    {error && <p className="error-message" role="alert">{error}</p>}
    <section className="preview-section" aria-label="卡片预览" aria-busy={loading}>
      <div className="preview-heading"><strong>卡片预览</strong><span>{postInfo ? "确认内容后下载长图" : "生成后在这里查看"}</span></div>
      {loading ? <div className="empty-preview" role="status">正在加载帖子和图片，请稍候…</div> : postInfo ? <div className="preview-scroll"><LongPicPreview postInfo={postInfo} qrCodeUrl={qrCodeUrl} urlToBase64={images} componentRef={componentRef} config={{ showQrCode }} /></div> : <div className="empty-preview"><span className="empty-icon">✦</span><p>把喜欢的帖子，变成一张分享卡片</p></div>}
    </section>
  </div>;
}
