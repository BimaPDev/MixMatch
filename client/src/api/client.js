// client/src/api/client.js
import axios from "axios";

const client = axios.create({
  baseURL: "http://10.0.0.74:8080",
});

export default client; // <--- Must be default export
