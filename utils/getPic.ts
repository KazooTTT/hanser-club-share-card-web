// import pptr
import pptr from "puppeteer";

const getPicFromURL = async (url: string) => {
  // open url in the pptr
  const browser = await pptr.launch();
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
    await browser.close();
    return image;
  }

  return image;
};

export default getPicFromURL;
