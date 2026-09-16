import os
import glob
from PIL import Image
from pillow_heif import register_heif_opener

register_heif_opener()

folder = 'public/gallery/inauguration'

# Delete non-image files
print("Deleting non-image files...")
for file in glob.glob(os.path.join(folder, '*')):
    ext = file.rsplit('.', 1)[-1].lower()
    if ext not in ['jpg', 'jpeg', 'png', 'heic']:
        print(f"Deleting {file}")
        os.remove(file)

# Convert HEIC to JPG and delete HEIC
print("Converting HEIC to JPG...")
for file in glob.glob(os.path.join(folder, '*.[hH][eE][iI][cC]')):
    print(f"Converting {file}...")
    try:
        out = file.rsplit('.', 1)[0] + '.jpg'
        image = Image.open(file)
        image.convert('RGB').save(out, "JPEG")
        os.remove(file)
    except Exception as e:
        print(f"Error converting {file}: {e}")

print("Done processing images.")
