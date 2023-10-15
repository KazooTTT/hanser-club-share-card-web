import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import LongPicPreview from "./LongPicPreview";
import domtoimage from "dom-to-image";

const GetPicFromPostUrl = () => {
  const [postUrl, setPostUrl] = useState("");

  const [postInfo, setPostInfo] = useState<PostDataInfo>({} as PostDataInfo);

  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const getQrCodeUrl = useCallback(async () => {
    if (postUrl) {
      const qrCodeUrl = await QRCode.toDataURL(postUrl);
      setQrCodeUrl(qrCodeUrl);
    }
  }, [postUrl]);

  const downloadImage = useCallback(async () => {
    const element = componentRef.current;
    console.log(
      "%c Line:59 🥔 element",
      "color:#2eafb0",
      componentRef,
      element,
    );
    if (element) {
      let data = await domtoimage.toPng(element, {
        height: element.offsetHeight * 2,
        width: element.offsetWidth * 2,
        style: {
          transform: "scale(" + 2 + ")",
          transformOrigin: "top left",
          width: element.offsetWidth + "px",
          height: element.offsetHeight + "px",
        },
      });
      // get the base64 data
      var a = document.createElement("A");
      (a as HTMLAnchorElement).href = data;
      (a as HTMLAnchorElement).download = `${postInfo.title}.png`;
      document.body.appendChild(a);

      a.click();
      document.body.removeChild(a);
    }
  }, [postInfo.title]);

  useEffect(() => {
    getQrCodeUrl();
  }, [getQrCodeUrl]);

  useEffect(() => {
    if (qrCodeUrl.length > 0 && Object.keys(postInfo).length > 0) {
      downloadImage();
    }
  }, [downloadImage, postInfo, qrCodeUrl.length]);

  async function handleSubmit() {
    // check and parse the url
    // post url is https://2550505.com/postDetails/140418
    // the reg should match start with https://2550505.com/postDetails/ and end with several numbers
    const reg = /^https:\/\/2550505\.com\/postDetails\/\d+$/;
    let postId;
    if (!reg.test(postUrl)) {
      alert("请输入正确的帖子链接");
      return;
    } else {
      postId = postUrl.split("postDetails/")[1];
      const response = await fetch(`https://2550505.com/post/detail/${postId}`);
      // parse the response
      const data: PostData = await response.json();
      console.log("data", data);
      setPostInfo(data.info);
    }
  }
  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="overflow-auto">
      <div className={"flex w-full px-4"}>
        <form className="flex-1 mr-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="请输入帖子链接"
            onChange={(e) => setPostUrl(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleSubmit();
              }
            }}
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded-lg text-sm shadow outline-none focus:outline-none focus:ring w-full"
          />
        </form>
        <button
          className="px-4 bg-palette-primary hover:bg-palette-dark text-white text-sm sm:text-base font-semibold rounded-lg border border-transparent
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-palette-primary"
          type="button"
          onClick={handleSubmit}
        >
          确认
        </button>
      </div>
      <div ref={componentRef}>
        <LongPicPreview postInfo={postInfo} qrCodeUrl={qrCodeUrl} />
      </div>
    </div>
  );
};

export default GetPicFromPostUrl;
