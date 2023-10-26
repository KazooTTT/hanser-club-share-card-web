import dayjs from "dayjs";
import Image from "next/image";
import { RefObject } from "react";

const LongPicPreview = ({
  postInfo,
  qrCodeUrl,
  urlToBase64,
  componentRef,
  config,
}: {
  postInfo: PostDataInfo;
  qrCodeUrl: string;
  urlToBase64: Record<string, string>;
  componentRef: RefObject<HTMLDivElement>;
  config: { showQrCode: boolean };
}) => {
  return (
    Object.keys(postInfo).length > 0 &&
    qrCodeUrl.length > 0 && (
      <div
        ref={componentRef}
        className={
          "preview overflow-auto text-left bg-white shadow px-4 py-8 rounded bg-repeat bg-right-top"
        }
        style={{
          backgroundImage: 'url("/2550505.png")',
        }}
      >
        <div className={"space-y-2 mb-2"}>
          <h1 className="text-2xl font-bold text-center">{postInfo.title}</h1>
          <div className="text-center">
            {dayjs(postInfo.post_time).format("YYYY-MM-DD HH:mm:ss")}
          </div>
          <div className="space-x-2 flex justify-center items-center">
            <Image
              src={urlToBase64[postInfo.author.avatar]}
              width={36}
              height={36}
              alt={"author avatar"}
              className="rounded-full w-9 h-9"
              objectFit="cover"
            />
            <div>{postInfo.author.nickname}</div>
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: postInfo.content,
          }}
        />
        {config.showQrCode && (
          <div className="float-right flex flex-col items-center justify-center mt-4">
            <div className="text-sm">毛怪俱乐部</div>
            <div className="qrCode">
              <Image
                src={qrCodeUrl}
                alt="QRCode Image"
                width={100}
                height={100}
                className="w-20 h-20"
                objectFit="cover"
              />
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default LongPicPreview;
