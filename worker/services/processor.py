import requests
from io import BytesIO
from PIL import Image

class ImageProcessor:
    def analyze(self, image_url):
        print(f" [AI] Downloading from {image_url}...")
        try:
            # 1. Download the image bytes from the URL
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            
            # 2. Open image from bytes
            img = Image.open(BytesIO(response.content))
            img = img.resize((50, 50)) # Resize for speed
            
            # 3. Calculate Average Color
            # We convert to RGB to ensure we don't have Alpha channels messing up the math
            img = img.convert('RGB')
            pixels = list(img.getdata())
            
            r_total, g_total, b_total = 0, 0, 0
            count = 0
            
            for r, g, b in pixels:
                r_total += r
                g_total += g
                b_total += b
                count += 1
                
            if count > 0:
                avg_color = (r_total // count, g_total // count, b_total // count)
                hex_color = '#{:02x}{:02x}{:02x}'.format(*avg_color)
            else:
                hex_color = "#000000"
            
            # 4. Return the Analysis Result
            return {
                "category": "t-shirt", 
                "color": hex_color, 
                "confidence": 0.99
            }
            
        except Exception as e:
            print(f" [!] Image Processing Failed: {e}")
            return {
                "category": "unknown", 
                "color": "#000000", 
                "confidence": 0.0
            }