import { BACKEND_URL } from "@/config";
import axios from "axios";

interface AuthResponse {
  token: string;
}

export class AuthService {
  private static TOKEN_COOKIE_NAME = "token";

  static setToken(token: string): void {
    document.cookie = `${this.TOKEN_COOKIE_NAME}=${token}; path=/`;
  }

  static getToken(): string | null {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${this.TOKEN_COOKIE_NAME}=`)
    );
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }

  static createAuthenticatedInstance() {
    const instance = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    instance.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    });

    return instance;
  }

  static async handleAuth(
    isSignin: boolean,
    credentials: {
      username: string;
      password: string;
      name?: string;
    }
  ) {
    try {
      const response = await axios.post<AuthResponse>(
        `${BACKEND_URL}/${isSignin ? "signin" : "signup"}`,
        credentials
      );

      if (!isSignin && response.status === 200) {
        window.location.href = "/signin";
        return;
      }

      if (response.data.token) {
        this.setToken(response.data.token);
        window.location.href = "/room";
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  }
}
