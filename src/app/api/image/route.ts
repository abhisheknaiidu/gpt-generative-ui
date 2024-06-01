import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get("prompt");
  let size = req.nextUrl.searchParams.get("size");

  if (!prompt) {
    return new Response("Missing prompt", { status: 400 });
  }
  if (!size) {
    return new Response("Missing size", { status: 400 });
  }

  if (size === "512x512") {
    size = "1024x1024"; // as 512x512 is not supported in dall-e-3
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${process.env.OPENAI_API_KEY}`);

  const raw = JSON.stringify({
    model: "dall-e-3",
    prompt,
    size,
    n: 1,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    ...requestOptions,
    // cache: "no-cache",
  });
  const data = await res.json();

  const url = data.data[0].url;
  return new Response(JSON.stringify({ url }), {
    headers: {
      "content-type": "application/json",
    },
  });

  //   // redirect to the image url
  //   return Response.redirect(url, 302);
}
