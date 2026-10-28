import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

const chromiumPack = "https://github.com/Sparticuz/chromium/releases/download/v153.0.0/chromium-v153.0.0-pack.tar";

const getPicFromURL = async (url: string) => {
  const browser = await puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars"],
    executablePath: await chromium.executablePath(chromiumPack),
    headless: true,
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.addStyleTag({ content: ".layout-header {display:none !important} .layout-body {height:100vh !important}" });
    const content = await page.$(".post-details__container .post-content");
    if (!content) return undefined;
    return await content.screenshot({ type: "jpeg", quality: 100, captureBeyondViewport: true });
  } finally {
    await browser.close();
  }
};

export default getPicFromURL;
