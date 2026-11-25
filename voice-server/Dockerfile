FROM pytorch/pytorch:2.6.0-cuda12.6-cudnn9-runtime
ENV PYTHONUNBUFFERED=1 NO_TORCH_COMPILE=1 HF_HOME=/workspace/.cache/huggingface
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg libsndfile1 && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
