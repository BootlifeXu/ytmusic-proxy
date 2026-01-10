// netlify/functions/ytmusic-proxy.js

export async function handler(event, context) {
    const query = event.queryStringParameters.q;
    const pageToken = event.queryStringParameters.pageToken || '';

    if (!query) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing query parameter "q"' }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
    }

    const apiKey = process.env.YT_KEY; // Your secret key on Netlify
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'YT_KEY not set in environment variables' }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
    }

    try {
        const url = new URL('https://www.googleapis.com/youtube/v3/search');
        url.searchParams.set('part', 'snippet');
        url.searchParams.set('q', query + ' music');
        url.searchParams.set('type', 'video');
        url.searchParams.set('videoCategoryId', '10');
        url.searchParams.set('maxResults', '10');
        if (pageToken) url.searchParams.set('pageToken', pageToken);
        url.searchParams.set('key', apiKey);

        const res = await fetch(url.toString());
        const data = await res.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        };
    }
}    });

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
