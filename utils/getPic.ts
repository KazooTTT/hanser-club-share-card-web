import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

async function getBrowser() {
  return puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v117.0.0/chromium-v117.0.0-pack.tar`,
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

const getPicFromURL = async (url: string) => {
  // open url in the pptr
  let browser = await getBrowser();

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
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
  return image;
};

export default getPicFromURL;
