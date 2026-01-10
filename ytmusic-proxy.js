export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors() });
    }

    const allowedOrigins = [
      "http://localhost:5500",
      "https://bootlifexu.github.io"
    ];

    const origin = request.headers.get("Origin");

    if (origin && !allowedOrigins.includes(origin)) {
      return new Response("Forbidden", { status: 403 });
    }

    // Ensure correct route
    if (!url.pathname.startsWith("/yt/")) {
      return new Response("Invalid route", { status: 404 });
    }

    const endpoint = url.pathname.slice(4); // removes "/yt/"
    if (!endpoint) {
      return new Response("Missing endpoint", { status: 400 });
    }

    const youtubeURL = new URL(`https://www.googleapis.com/youtube/${endpoint}`);
    youtubeURL.search = url.search;
    youtubeURL.searchParams.set("key", env.YT_KEY);

    const ytRes = await fetch(youtubeURL.toString(), {
      method: request.method
    });

    const body = await ytRes.text();

    return new Response(body, {
      status: ytRes.status,
      headers: {
        ...cors(origin),
        "Content-Type": "application/json"
      }
    });
  }
};

function cors(origin = "*") {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
