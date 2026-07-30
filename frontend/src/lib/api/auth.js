import { AUTH_STORAGE_KEYS, DEFAULT_HR_USER } from "@/features/auth/constants";

const delay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const loginApi = async ({ email, password }) => {
  await delay(600);

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const token = `mock-jwt-token-${Date.now()}`;
  const user = {
    ...DEFAULT_HR_USER,
    email,
    name: email.split("@")[0].replace(".", " "),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  }

  return { token, user };
};

export const registerApi = async ({ name, email, company, password }) => {
  await delay(700);

  if (!name || !email || !password || !company) {
    throw new Error("All fields are required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const token = `mock-jwt-token-${Date.now()}`;
  const user = {
    id: `hr-${Date.now()}`,
    name,
    email,
    company,
    role: "Recruiter",
    avatar: null,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  }

  return { token, user };
};

export const getCurrentUserApi = async () => {
  await delay(200);

  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);

  if (!token) {
    return { token: null, user: null };
  }

  try {
    const user = storedUser ? JSON.parse(storedUser) : DEFAULT_HR_USER;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

export const logoutApi = async () => {
  await delay(200);

  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  }

  return { success: true };
};
