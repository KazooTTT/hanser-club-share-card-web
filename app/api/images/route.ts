export async function POST(request: Request) {
    // get the request body from the request
    const res: {
        imageList: string[]
    } = await request.json()
    console.log("%c Line:5 🌰 body", "color:#fca650", res);

    const { imageList } = res;
    const urlToBase64 = await imageList.reduce(async (accPromise, current) => {
        const acc = await accPromise;
        const base64 = await imageUrlToBase64(current) as string;
        acc[current] = base64
        return acc
    }, Promise.resolve({} as Record<string, string>))

    return Response.json({ urlToBase64 })
}

async function imageUrlToBase64(url: string) {
    try {
        const response = await fetch(url);

        const blob = await response.arrayBuffer();

        const contentType = response.headers.get('content-type');

        const base64String = `data:${contentType};base64,${Buffer.from(
            blob,
        ).toString('base64')}`;

        return base64String;
    } catch (err) {
        console.log(err);
    }
}
