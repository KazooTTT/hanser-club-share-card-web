import { createRef, useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import LongPicPreview from "./LongPicPreview";
import domtoimage from "dom-to-image";
import saveAs from "file-saver";
import classNames from "classnames";

const GetPicFromPostUrl = () => {
  const [postUrl, setPostUrl] = useState("");

  const [postInfo, setPostInfo] = useState<PostDataInfo>({} as PostDataInfo);

  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const [urlToBase64, setUrlToBase64] = useState({});
  const getQrCodeUrl = useCallback(async () => {
    if (postUrl) {
      const qrCodeUrl = await QRCode.toDataURL(postUrl);
      setQrCodeUrl(qrCodeUrl);
    }
  }, [postUrl]);

  useEffect(() => {
    getQrCodeUrl();
  }, [getQrCodeUrl]);

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
      const newUrlToBase64 = await getUrlToBase64([
        ...data.info.primaryPictures,
        data.info.author.avatar,
      ]);
      setUrlToBase64(newUrlToBase64);
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.info.content, "text/html");
      const imgTags = doc.querySelectorAll("img");
      // 使用 forEach 迭代
      imgTags.forEach((img) => {
        // 处理每张图片
        const src = img.getAttribute("src");
        // 设置 src 为 base64 编码
        if (src) {
          img.setAttribute("src", newUrlToBase64[src]);
          // 设置类型为 base64
          img.setAttribute("type", "image/jpeg"); // 或者图片的具体类型
        } else if (img.className === "ProseMirror-separator") {
          // remove it
          img.parentElement?.removeChild(img);
        }
      });
      const modifiedHtml = new XMLSerializer().serializeToString(doc);

      const newPostInfo = {
        ...data.info,
        content: modifiedHtml,
      };
      setPostInfo(newPostInfo);
    }
  }

  async function getUrlToBase64(imageList: string[]) {
    const res = await fetch("/api/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageList }),
    });
    const data = await res.json();
    const { urlToBase64 } = data;
    return urlToBase64;
  }

  const componentRef = createRef<HTMLDivElement>();

  const downloadImage = useCallback(async () => {
    const element = componentRef.current;
    console.log("%c Line:68 🥖 element", "color:#6ec1c2", element);
    if (element) {
      let data = await domtoimage.toPng(element, {
        height: element.offsetHeight * 3,
        width: element.offsetWidth * 3,
        style: {
          transform: "scale(" + 3 + ")",
          transformOrigin: "top left",
          width: element.offsetWidth + "px",
          height: element.offsetHeight + "px",
        },
      });

      var a = document.createElement("A");
      (a as HTMLAnchorElement).href = data;
      (a as HTMLAnchorElement).download = `${postInfo.title}.png`;
      document.body.appendChild(a);

      a.click();
      document.body.removeChild(a);
    }
  }, [componentRef, postInfo.title]);

  return (
    <div className="w-full">
      <div
        className={
          "items-center justify-center md:items-stretch flex-col md:flex-row flex w-full px-4 md:space-x-3 md:space-y-0 space-y-3"
        }
      >
        <form className="flex-1 w-full" onSubmit={handleSubmit}>
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
          className="px-8 py-2 w-fit md:px-4 md:py-0 bg-palette-primary hover:bg-palette-dark text-white text-sm sm:text-base font-semibold rounded-lg border border-transparent
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-palette-primary"
          type="button"
          onClick={handleSubmit}
        >
          确认
        </button>
        <button
          className={`px-8 py-2 w-fit md:px-4 md:py-0 bg-palette-primary hover:bg-palette-dark text-white text-sm sm:text-base font-semibold rounded-lg border border-transparent
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-palette-primary ${
            Object.keys(postInfo).length === 0 &&
            "cursor-not-allowed bg-gray-500 hover:bg-gray-600 focus-visible:bg-gray-600"
          }`}
          type="button"
          disabled={Object.keys(postInfo).length === 0}
          onClick={downloadImage}
        >
          下载
        </button>
      </div>
      <div className="max-h-96 overflow-auto my-8">
        <LongPicPreview
          postInfo={postInfo}
          qrCodeUrl={qrCodeUrl}
          urlToBase64={urlToBase64}
          componentRef={componentRef}
        />
      </div>
    </div>
  );
};

export default GetPicFromPostUrl;
