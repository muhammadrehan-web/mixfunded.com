export async function apiJson<T>(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const payload = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!res.ok) {
    return { ok: false as const, error: payload?.error || "Request failed.", status: res.status, data: null };
  }
  return { ok: true as const, error: "", status: res.status, data: payload as T };
}
