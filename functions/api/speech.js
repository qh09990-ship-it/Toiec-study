// Cloudflare Pages Function: POST /api/speech
// Allow only this Pages project and its deployment-preview subdomains.
// This avoids brittle APP_ORIGIN matching (which previously caused HTTP 403).
const PRODUCTION_HOST = "toiec-study.pages.dev";

function allowedOrigin(origin) {
  try {
    const url = new URL(origin);
    if (url.protocol !== "https:" || url.origin !== origin) return false;
    return url.hostname === PRODUCTION_HOST ||
      /^[a-z0-9-]+\\.toiec-study\\.pages\\.dev$/i.test(url.hostname);
  } catch {
    return false;
  }
}

export async function onRequestOptions({ request }) {
  return cors(new Response(null, { status: 204 }), request);
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin") || "";
  if (!allowedOrigin(origin)) {
    return cors(json({ error: "Tên miền truy cập không được phép." }, 403), request);
  }
  if (!env.ELEVENLABS_API_KEY || !env.ELEVENLABS_VOICE_ID) {
    return cors(json({ error: "Máy chủ chưa được cấu hình ElevenLabs (thiếu API Key hoặc Voice ID)." }, 503), request);
  }

  let body;
  try { body = await request.json(); } catch {
    return cors(json({ error: "Dữ liệu gửi lên không hợp lệ." }, 400), request);
  }
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 2000) {
    return cors(json({ error: "Văn bản phải có từ 1 đến 2000 ký tự." }, 400), request);
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(env.ELEVENLABS_VOICE_ID)}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      body: JSON.stringify({
        text,
        model_id: env.ELEVENLABS_MODEL_ID || "eleven_v4",
        voice_settings: {
          stability: 0.42,
          similarity_boost: 0.82,
          style: 0.35,
          use_speaker_boost: true
        }
      })
    }
  );

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    return cors(json({ error: `ElevenLabs trả về lỗi ${response.status}: ${detail}` }, 502), request);
  }
  return cors(new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  }), request);
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

function cors(response, request) {
  const origin = request.headers.get("Origin") || "";
  const headers = new Headers(response.headers);
  if (allowedOrigin(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
  return new Response(response.body, { status: response.status, headers });
}
