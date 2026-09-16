import os
import requests
import json
import base64
from PIL import Image
from pillow_heif import register_heif_opener
import time

register_heif_opener()

IMGBB_API_KEY = "3d7be5df36153d070e833437a3434fa8"

def convert_heic_to_jpg(filepath):
    if not filepath.lower().endswith('.heic'):
        return filepath
        
    out = filepath.rsplit('.', 1)[0] + '.jpg'
    if os.path.exists(out):
        return out
        
    try:
        image = Image.open(filepath)
        # Convert to RGB to save as JPEG
        image.convert('RGB').save(out, "JPEG")
        return out
    except Exception as e:
        print(f"Error converting {filepath}: {e}")
        return None

def upload_image(filepath):
    try:
        with open(filepath, "rb") as file:
            payload = {
                "key": IMGBB_API_KEY,
                "image": base64.b64encode(file.read()).decode('utf-8')
            }
            res = requests.post("https://api.imgbb.com/1/upload", data=payload)
            data = res.json()
            if data.get('success'):
                return data['data']['url']
            else:
                print(f"Failed to upload {filepath}: {data}")
                return None
    except Exception as e:
        print(f"Error uploading {filepath}: {e}")
        return None

results = []
folders = ["Mxesa Club", "Inauguration group"]
for folder in folders:
    if not os.path.exists(folder):
        continue
    for filename in sorted(os.listdir(folder)):
        filepath = os.path.join(folder, filename)
        if os.path.isfile(filepath):
            jpg_path = convert_heic_to_jpg(filepath)
            if not jpg_path:
                continue
                
            print(f"Uploading {jpg_path}...")
            url = upload_image(jpg_path)
            if url:
                results.append({"folder": folder, "filename": filename, "url": url})
            time.sleep(1) # sleep to avoid rate limits

with open("uploaded_gallery.json", "w") as f:
    json.dump(results, f, indent=2)

print("Done. Uploaded", len(results), "images.")
