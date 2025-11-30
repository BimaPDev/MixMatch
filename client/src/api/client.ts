import axios from "axios";

// REPLACE WITH YOUR IP
const IP_ADDRESS = "10.0.0.74";
const PORT = "8080";
const BASE_URL = `http://${IP_ADDRESS}:${PORT}`;

// Keep the standard client for GET requests (like fetching the wardrobe)
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// FIX: Use a raw axios.post for uploads to avoid header conflicts
export const uploadImage = async (formData: FormData) => {
  return axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      // 1. Explicitly allow the browser/engine to set Content-Type
      // This ensures the 'boundary' string is added automatically.
      "Content-Type": "multipart/form-data",
    },
    // 2. Prevent Axios from converting FormData to JSON
    transformRequest: (data) => {
      return data;
    },
  });
};

export const getWardrobe = async (userId: string) => {
  return client.get(`/wardrobe?user_id=${userId}`);
};

export default client;
