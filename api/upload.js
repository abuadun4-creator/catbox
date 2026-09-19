export const config = {
  runtime: 'edge', // Bắt buộc dùng Edge Runtime để bỏ giới hạn dung lượng 4.5MB
};

export default async function handler(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const contentType = request.headers.get('content-type');

    const catboxResponse = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      headers: {
        'content-type': contentType,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: request.body,
      duplex: 'half',
    });

    const resultText = await catboxResponse.text();

    return new Response(resultText, {
      status: catboxResponse.status,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    return new Response('Vercel Edge Error: ' + error.message, {
      status: 500,
      headers: corsHeaders,
    });
  }
}
