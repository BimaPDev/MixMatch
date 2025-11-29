import requests
import os

# Configuration
url = 'http://localhost:8080/upload'
file_path = 'test.jpg'

# 1. Define the Payload (Must match what Go expects)
# We use the UUID you inserted into the database earlier
payload = {
    'user_id': 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
    'category': 'shirt'
}

print(f"--- Starting Upload Test ---")
print(f"Target: {url}")
print(f"File:   {file_path}")

# 2. Upload
if not os.path.exists(file_path):
    print(f"Error: '{file_path}' not found! Please put an image in this folder.")
    exit(1)

try:
    with open(file_path, 'rb') as f:
        # The key 'image' must match c.FormFile("image") in your Go handler
        files = {'image': f}
        
        response = requests.post(url, data=payload, files=files)
        
        # 3. Output Results
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 201:
            print("\n✅ Upload Successful!")
        else:
            print("\n❌ Upload Failed.")

except Exception as e:
    print(f"\n❌ Request Failed: {e}")