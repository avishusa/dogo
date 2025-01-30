import axios from "axios";

const API_URL = "https://frontend-take-home-service.fetch.com/auth/login";

export const login = async (name: string, email: string): Promise<void> => {
  try {
    await axios.post(
      API_URL,
      { name, email },
      { withCredentials: true } 
    );
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};
