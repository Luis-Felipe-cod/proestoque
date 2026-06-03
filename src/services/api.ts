import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = __DEV__
  ? "http://192.168.15.12:3333/api" 
  : "https://sua-api.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@proestoque:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);