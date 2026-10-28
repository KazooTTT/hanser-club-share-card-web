import dayjs from "dayjs";
import { RefObject } from "react";

export default function LongPicPreview({ postInfo, qrCodeUrl, urlToBase64, componentRef, config }: {
  postInfo: PostDataInfo;
  qrCodeUrl: string;
  urlToBase64: Record<string, string>;
  componentRef: RefObject<HTMLDivElement>;
  config: { showQrCode: boolean };
}) {
  return <div ref={componentRef} className="share-card">
    <div className="card-brand">毛怪俱乐部 <span>·</span> 分享卡片</div>
    <h2>{postInfo.title}</h2>
    <div className="card-author">
      {urlToBase64[postInfo.author.avatar] && <img src={urlToBase64[postInfo.author.avatar]} alt="" />}
      <div><strong>{postInfo.author.nickname}</strong><div className="card-time">{dayjs(postInfo.post_time).format("YYYY-MM-DD HH:mm")}</div></div>
    </div>
    <div className="post-content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
    {config.showQrCode && <div className="card-qr"><div><strong>毛怪俱乐部</strong><div>扫码查看原帖</div></div><img src={qrCodeUrl} alt="帖子二维码" /></div>}
  </div>;
}
