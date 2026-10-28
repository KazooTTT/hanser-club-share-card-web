import dayjs from "dayjs";
import { RefObject } from "react";

export default function LongPicPreview({ postInfo, qrCodeUrl, urlToBase64, componentRef, config }: {
  postInfo: PostDataInfo;
  qrCodeUrl: string;
  urlToBase64: Record<string, string>;
  componentRef: RefObject<HTMLDivElement | null>;
  config: { showQrCode: boolean };
}) {
  return <article ref={componentRef} className="share-card">
    <div className="card-brand">
      <span className="card-brand-icon">毛</span>
      <div><strong>毛怪俱乐部</strong><span>POST CARD</span></div>
      <span className="card-brand-dot">✦</span>
    </div>
    <h2 className="card-title">{postInfo.title}</h2>
    <div className="card-author">
      {urlToBase64[postInfo.author.avatar] && <img src={urlToBase64[postInfo.author.avatar]} alt="" />}
      <div className="card-author-details"><strong>{postInfo.author.nickname}</strong><div className="card-time">{dayjs(postInfo.post_time).format("YYYY.MM.DD · HH:mm")}</div></div>
    </div>
    <div className="card-divider" />
    <div className="post-content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
    {config.showQrCode && <div className="card-qr"><div><strong>查看原帖</strong><span>扫描二维码前往毛怪俱乐部</span></div><img src={qrCodeUrl} alt="帖子二维码" /></div>}
    <div className="card-bottom"><span>2550505.COM</span><span>✦</span></div>
  </article>;
}
