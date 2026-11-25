# Sesame CSM-1B API for TOEIC Study

## 1) Hugging Face access
Create/sign in to a Hugging Face account. Open the `sesame/csm-1b` model page and accept its access conditions. Also request/accept access to `meta-llama/Llama-3.2-1B` if Hugging Face prompts for it. Create a read token with read access. Never commit this token.

## 2) GPU pod
Use a CUDA GPU pod with at least 24 GB VRAM as a starting point (RTX 4090 24 GB); 48 GB L40S gives more headroom. Use a persistent volume mounted at `/workspace` so model downloads survive restarts. Deploy this repository's Dockerfile, expose TCP port 8000, and set environment variables:
- `HF_TOKEN`: Hugging Face read token (secret)
- `VOICE_API_KEY`: a long random secret (at least 32 random bytes)
- `VOICE_ALLOWED_ORIGINS`: exact public TOEIC website origin, e.g. `https://your-site.pages.dev`
- optional `CSM_MODEL_ID=sesame/csm-1b`
- optional `HF_HOME=/workspace/.cache/huggingface`

Build from this folder using the Dockerfile. Keep the pod running while using the voice feature. A stopped pod cannot answer pronunciation requests.

## 3) Verify
After the container starts, open `https://YOUR-GPU-HOST/health`. It should return `ok: true` and `model_loaded: true`. Then set the API URL and the same VOICE_API_KEY in the TOEIC website's voice settings. Do not put the HF_TOKEN in the browser.

## 4) Costs
GPU Pods are billed while running. Stop the pod when not studying. Persistent volume storage may continue to be billed while the pod is stopped. Check the provider's live price before deployment.

## Security notes
The API requires X-Voice-Key and checks browser Origin via CORS. This is suitable for a personal study site; CORS is not an authentication boundary by itself. Keep the voice key private and rotate it if exposed. Use HTTPS for the public endpoint.
