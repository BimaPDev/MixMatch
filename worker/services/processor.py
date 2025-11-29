import os
import requests
from io import BytesIO
from PIL import Image
from rembg import remove

class ImageProcessor:
    def analyze(self, image_url, original_filename):
        print(f" [AI] Downloading from {image_url}...")
        try:
            # 1. Download
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            
            # 2. Open Image
            input_image = Image.open(BytesIO(response.content))
            
            # 3. Remove Background
            print(" [AI] Removing background...")
            output_image = remove(input_image)
            
            # 4. Parse Paths
            # URL format: http://.../static/{USER_ID}/{FILENAME}
            # We split by '/' to find the User ID
            url_parts = image_url.split('/')
            user_id = url_parts[-2] 
            
            # Create the output filename
            clean_name = os.path.splitext(original_filename)[0] + "-no-bg.png"
            
            # 5. Create Directory (The Fix!)
            # We save to /app/uploads/{user_id}/...
            output_dir = f"/app/uploads/{user_id}"
            os.makedirs(output_dir, exist_ok=True) # <--- Creates folder if missing
            
            save_path = f"{output_dir}/{clean_name}"
            
            # 6. Save
            output_image.save(save_path)
            print(f" [AI] Saved transparent image to {save_path}")

            # 7. Generate the NEW URL for the Frontend
            new_url = f"http://host.docker.internal:8080/static/{user_id}/{clean_name}"

            return {
                "category": "t-shirt", 
                "color": "#ffffff", 
                "confidence": 0.99,
                "processed_url": new_url
            }
            
        except Exception as e:
            print(f" [!] Processing Failed: {e}")
            return {
                "category": "error", 
                "color": "#000000", 
                "confidence": 0.0,
                "processed_url": image_url
            }