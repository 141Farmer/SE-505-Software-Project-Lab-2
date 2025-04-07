from pathlib import Path


PROFILE_UPLOAD_DIR = Path("static/profile_images")
PRODUCT_UPLOAD_DIR = Path("static/product_images")
PROFILE_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
PRODUCT_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)