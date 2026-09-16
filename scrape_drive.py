import requests
import re
import sys

def get_folder_items(url):
    res = requests.get(url)
    html = res.text
    # Google drive folder items are usually in a JS variable or script tag.
    # We can try to regex extract file IDs. Usually it looks like:
    # [\\]"id[\\]":[\\]"1EaoDOhk...[\\]" or similar
    # or just extracting base64 or arrays.
    
    # Actually, getting them without API is hard. Let's try to use gdown's parser.
    return html

html = get_folder_items(sys.argv[1])
with open("folder_html.txt", "w") as f:
    f.write(html)
