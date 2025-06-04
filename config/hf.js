import axios from "axios";

export const hf = axios.create({
  baseURL: "https://api-inference.huggingface.co",
  headers: {
    Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
    "Content-Type": "application/json",
  },
  timeout: 60_000, // 60 segundos para a resposta
});