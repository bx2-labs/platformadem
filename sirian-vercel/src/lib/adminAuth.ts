const SESSION_KEY = "sirian_admin_auth";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "sirian2025";

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
