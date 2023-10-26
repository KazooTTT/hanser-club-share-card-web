import { createRef, useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import LongPicPreview from "./LongPicPreview";
import domtoimage from "dom-to-image";
import { twMerge } from "tailwind-merge";
import { DownloadButton } from "./DownloadButton";

const GetPicFromPostUrl = () => {
  const [postUrl, setPostUrl] = useState("");

  const [postInfo, setPostInfo] = useState<PostDataInfo>({} as PostDataInfo);

  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const [urlToBase64, setUrlToBase64] = useState({});

  const [config, setConfig] = useState({
    showQrCode: false,
  });

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

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
      setLoading1(true);
      setDownloadReady(false);
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
    setLoading1(false);
    setDownloadReady(true);
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
    setLoading2(true);
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
    setLoading2(false);
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
        <ConfirmButton loading1={loading1} handleSubmit={handleSubmit} />
        <DownloadButton
          loading2={loading2}
          downloadReady={downloadReady}
          downloadImage={downloadImage}
        />
      </div>
      <div className="mt-3 flex items-center mb-4 justify-center">
        <input
          id="default-checkbox"
          type="checkbox"
          checked={config.showQrCode}
          onChange={(e) => {
            setConfig((old) => ({
              ...old,
              showQrCode: e.target.checked,
            }));
          }}
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="default-checkbox"
          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          是否生成二维码
        </label>
      </div>
      <div className="max-h-96 overflow-auto my-8">
        <LongPicPreview
          postInfo={postInfo}
          qrCodeUrl={qrCodeUrl}
          urlToBase64={urlToBase64}
          componentRef={componentRef}
          config={config}
        />
      </div>
    </div>
  );
};

export default GetPicFromPostUrl;

function ConfirmButton({
  loading1,
  handleSubmit,
}: {
  loading1: boolean;
  handleSubmit: () => Promise<void>;
}) {
  return loading1 ? (
    <button
      disabled
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
    >
      <svg
        aria-hidden="true"
        role="status"
        className="inline w-4 h-4 mr-3 text-white animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
      加载中
    </button>
  ) : (
    <button
      type="button"
      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
      onClick={handleSubmit}
    >
      确 认
    </button>
  );
}

