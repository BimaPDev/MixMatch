import axios from "axios";
import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080/api/v1"
    : "http://localhost:8080/api/v1";

const client = axios.create({ baseURL: BASE_URL });

export const api = {
  getWardrobe: () => client.get("/wardrobe/items"),

  analyzeItem: async (imageUri) => {
    const formData = new FormData();

    // 1. Safe filename handling
    const filename = imageUri.split("/").pop();

    // 2. Infer type, but default to jpeg if unknown (safer for backend)
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    // 3. Append properly for React Native
    formData.append("image", {
      uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
      name: filename,
      type: type,
    });

    return client.post("/wardrobe/analyze", formData, {
      headers: {
        // IMPORTANT: Let Axios set the Content-Type automatically!
        // It needs to generate 'multipart/form-data; boundary=...'
        "Content-Type": "multipart/form-data",
      },
      // Note: If the above fails, try removing the header entirely or setting:
      // transformRequest: (data, headers) => { return data; }
    });
  },
};
