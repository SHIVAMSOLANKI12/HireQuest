import axiosClient from "./axiosClient";
import { AUTH_STORAGE_KEYS, DEFAULT_HR_USER } from "@/features/auth/constants";

export const loginApi = async ({ email, password }) => {
  try {
    const res = await axiosClient.post("/auth/login", { email, password });
    const token = res?.data?.accessToken || res?.accessToken;
    const user = res?.data?.user || res?.user || DEFAULT_HR_USER;

    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
    }

    return { token, user };
  } catch (err) {
    // If backend is not currently running locally, fallback gracefully for offline dev testing
    if (err.message.includes("Network Error") || err.message.includes("connecting to the server")) {
      const mockToken = `mock-jwt-token-${Date.now()}`;
      const mockUser = {
        ...DEFAULT_HR_USER,
        email,
        name: email.split("@")[0].replace(".", " "),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, mockToken);
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(mockUser));
      }

      return { token: mockToken, user: mockUser };
    }
    throw err;
  }
};

export const registerApi = async ({ name, email, company, password }) => {
  try {
    const parts = (name || "").trim().split(" ");
    const firstName = parts[0] || "Recruiter";
    const lastName = parts.slice(1).join(" ") || "User";

    const res = await axiosClient.post("/auth/register", {
      firstName,
      lastName,
      email,
      password,
      company,
    });

    const user = res?.data?.user || res?.user || {
      id: `hr-${Date.now()}`,
      name,
      email,
      company,
      role: "Recruiter",
    };

    return { user };
  } catch (err) {
    if (err.message.includes("Network Error") || err.message.includes("connecting to the server")) {
      const mockUser = {
        id: `hr-${Date.now()}`,
        name,
        email,
        company,
        role: "Recruiter",
      };

      return { user: mockUser };
    }
    throw err;
  }
};

export const getCurrentUserApi = async () => {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);

  if (!token) {
    return { token: null, user: null };
  }

  try {
    const res = await axiosClient.get("/auth/me");
    const user = res?.data?.user || (storedUser ? JSON.parse(storedUser) : DEFAULT_HR_USER);
    return { token, user };
  } catch {
    const user = storedUser ? JSON.parse(storedUser) : DEFAULT_HR_USER;
    return { token, user };
  }
};

export const logoutApi = async () => {
  try {
    await axiosClient.post("/auth/logout");
  } catch {
    // Ignore error on logout if offline
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    }
  }

  return { success: true };
};
