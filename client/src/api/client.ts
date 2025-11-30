import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/src/constants/config";

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 1. Add an Interceptor
// This runs BEFORE every request. It injects the token automatically.
client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("user_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Update Upload to use the Token
export const uploadImage = async (formData: FormData) => {
  // We need to manually get token here because we are using a raw axios call
  const token = await SecureStore.getItemAsync("user_token");

  return axios.post(`${API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`, // <--- ATTACH TOKEN
    },
    transformRequest: (data) => data,
  });
};

export const getWardrobe = async (userId: string) => {
  // Note: In the future, you can remove userId arg and let the backend
  // infer it from the token! But for now, we keep it compatible.
  return client.get("/wardrobe");
};

export default client;
