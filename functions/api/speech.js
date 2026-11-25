// Cloudflare Pages Function: POST /api/speech
// Configure ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID and APP_ORIGIN as Pages secrets/variables.
export async function onRequestOptions({ request, env }) {
  return cors(new Response(null, { status: 204 }), request, env);
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin") || "";
  if (!env.APP_ORIGIN || origin !== env.APP_ORIGIN) {
    return cors(json({ error: "Origin không được phép." }, 403), request, env);
  }
  if (!env.ELEVENLABS_API_KEY || !env.ELEVENLABS_VOICE_ID) {
    return cors(json({ error: "Máy chủ chưa được cấu hình ElevenLabs." }, 503), request, env);
  }

  let body;
  try { body = await request.json(); } catch {
    return cors(json({ error: "Dữ liệu gửi lên không hợp lệ." }, 400), request, env);
  }
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 2000) {
    return cors(json({ error: "Văn bản phải có từ 1 đến 2000 ký tự." }, 400), request, env);
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
    return cors(json({ error: `ElevenLabs trả về lỗi ${response.status}: ${detail}` }, 502), request, env);
  }
  return cors(new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  }), request, env);
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
function cors(response, request, env) {
  const origin = request.headers.get("Origin") || "";
  const headers = new Headers(response.headers);
  if (origin && origin === env.APP_ORIGIN) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
  return new Response(response.body, { status: response.status, headers });
}
