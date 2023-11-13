# mgclub-share-card-web 毛怪俱乐部分享卡片
![Mgclub Share Card](https://github.com/KazooTTT/mgclub-share-card-web/assets/31075337/0842af6b-7c4a-485a-9d4e-5686ed6fbedf)
输入毛吧的帖子链接，输出分享长图。  
input mgclub post url, output the long pic to share.
体验地址：  
https://share255.kazoottt.top/

## 开发意图
因为毛吧的链接在例如qq这样的社交软件上是被屏蔽无法打开的，所以想着说想和朋友分享内容的话可以直接生成长图。

## 远离
使用的dom-to-image这个第三方库。
由于dom-to-image本身未对跨域问题做处理，因此利用了nextjs的api，把图片在服务端下载转成base64，最后使用dom-to-image转成长图。


# template

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
