export function safeNextPath(value: string | null | undefined) {
  if (!value) return "/dashboard";
  let path = value;
  try {
    path = decodeURIComponent(value);
  } catch {
    return "/dashboard";
  }
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    return "/dashboard";
  }
  return path;
}
