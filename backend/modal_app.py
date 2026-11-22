import modal

app = modal.App("rmbg-studio-api")

# NVIDIA T4 GPU üzerinde çalışacak konteyner imajı
# Model ağırlıkları build aşamasında önbelleğe indirildiği için cold-start süresi çok kısadır.
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "fastapi",
        "uvicorn[standard]",
        "python-multipart",
        "transformers>=4.40.0,<5.0.0",
        "torch",
        "torchvision",
        "pillow",
        "numpy",
        "scikit-image",
        "huggingface-hub",
    )
    .run_commands(
        'python -c "from transformers import pipeline; '
        'pipeline(\'image-segmentation\', model=\'briaai/RMBG-1.4\', trust_remote_code=True)"'
    )
    .add_local_dir("app", remote_path="/root/app")
    .add_local_file("main.py", remote_path="/root/main.py")
)


@app.function(
    image=image,
    cpu=4.0,
    memory=4096,
    scaledown_window=30,
    timeout=300,
)
@modal.asgi_app()
def fastapi_app():
    import sys

    if "/root" not in sys.path:
        sys.path.insert(0, "/root")

    from main import app as web_app

    return web_app

