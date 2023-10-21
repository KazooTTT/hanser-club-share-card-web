import pptr from "puppeteer-core";
import chrome from "chrome-aws-lambda";

const getPicFromURL = async (url: string) => {
  const options = process.env.AWS_REGION
    ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      }
    : {
        args: [],
        executablePath:
          process.platform === "win32"
            ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
            : process.platform === "linux"
            ? "/usr/bin/google-chrome"
            : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      };

  let browser = null;
  browser = await pptr.launch(options);
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  await page.setViewport({ width: 390, height: 844 });
  await page.content();

  await page.addStyleTag({
    content: ".layout-header {display:none !important}",
  });

  await page.addStyleTag({
    content: ".layout-body {height:100vh !important}",
  });

  const contentEle = await page.$(".post-details__container .post-content");

  let image;
  if (contentEle) {
    image = await contentEle.screenshot({
      path: "2550505.jpeg",
      type: "jpeg",
      quality: 100,
      captureBeyondViewport: true,
    });
  }

  await page.close();

  browser.on("disconnected", () => {
    console.log("浏览器断开连接");
    //断开后设为 falsy 值
    browser = null;
  });

  return image;
};

export default getPicFromURL;
