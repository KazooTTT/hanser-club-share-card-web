import dayjs from "dayjs";
import Image from "next/image";

const LongPicPreview = ({
  postInfo,
  qrCodeUrl,
}: {
  postInfo: PostDataInfo;
  qrCodeUrl: string;
}) => {
  return (
    Object.keys(postInfo).length > 0 &&
    qrCodeUrl.length > 0 && (
      <div
        className={
          "preview overflow-auto text-left bg-white shadow mt-8 px-4 py-8 rounded"
        }
      >
        <div className={""}>
          <h1 className="text-2xl font-bold text-center">{postInfo.title}</h1>
          <div className="text-center">
            {dayjs(postInfo.post_time).format("YYYY-MM-DD HH:mm:ss")}
          </div>
          <div className="space-x-2 flex justify-center items-center">
            <Image
              src={postInfo.author.avatar}
              width={48}
              height={48}
              alt={"author avatar"}
              className="rounded-full w-12 h-12"
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
        <div className="float-right flex flex-col items-center justify-center mt-4">
          <div className="text-sm">毛怪俱乐部</div>
          <div className="qrCode">
            <Image
              src={qrCodeUrl}
              alt="QRCode Image"
              width={48}
              height={48}
              className="w-12 h-12"
              objectFit="cover"
            ></Image>
          </div>
        </div>
      </div>
    )
  );
};

export default LongPicPreview;
