export const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/admin_panel/`;

// CSRF helper
export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const csrfToken = getCookie("csrftoken");

  // make sure headers is an object
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (csrfToken) headers["X-CSRFToken"] = csrfToken;

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  return res.json();
}
