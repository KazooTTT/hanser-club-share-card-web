// import pptr
import pptr from "puppeteer";

const getPicFromURL = async (url: string) => {
  // open url in the pptr
  const browser = await pptr.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  await page.setViewport({ width: 1980, height: 1080 });
  await page.content();
  const image = await page.screenshot({
    path: "2550505.png",
    type: "jpeg",
    quality: 100,
    fullPage: true,
  });

  await browser.close();
  return image;
};

export default getPicFromURL;
