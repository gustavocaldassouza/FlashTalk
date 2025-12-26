export function getApiUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL;
  return apiUrl || "http://localhost:5175/api";
}
