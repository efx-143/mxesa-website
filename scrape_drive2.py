import sys
import gdown
import json

url = sys.argv[1]
res = gdown.folder.download_folder(url, quiet=True, use_cookies=False, remaining_ok=True)
print(res)
