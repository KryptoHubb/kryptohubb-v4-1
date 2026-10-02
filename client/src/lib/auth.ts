export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const response = await fetch("/api/me", { credentials: "include" });
  if (!response.ok) return null;
  return response.json();
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}
