const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Categories
export const getCategories = () => request<import("@/types").Category[]>("/categories/");
export const createCategory = (name: string) =>
  request<import("@/types").Category>("/categories/", { method: "POST", body: JSON.stringify({ name }) });
export const updateCategory = (id: number, name: string) =>
  request<import("@/types").Category>(`/categories/${id}`, { method: "PATCH", body: JSON.stringify({ name }) });
export const deleteCategory = (id: number) =>
  request<void>(`/categories/${id}`, { method: "DELETE" });

// Libraries
export const getLibraries = (categoryId?: number) => {
  const qs = categoryId ? `?category_id=${categoryId}` : "";
  return request<import("@/types").Library[]>(`/libraries/${qs}`);
};
export const createLibrary = (name: string, categoryId?: number) =>
  request<import("@/types").Library>("/libraries/", {
    method: "POST",
    body: JSON.stringify({ name, category_id: categoryId }),
  });
export const updateLibrary = (id: number, data: { name?: string; category_id?: number }) =>
  request<import("@/types").Library>(`/libraries/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteLibrary = (id: number) =>
  request<void>(`/libraries/${id}`, { method: "DELETE" });

// Texts
export const getTexts = (params?: { categoryId?: number; libraryId?: number }) => {
  const qs = new URLSearchParams();
  if (params?.categoryId) qs.set("category_id", String(params.categoryId));
  if (params?.libraryId) qs.set("library_id", String(params.libraryId));
  const query = qs.toString() ? `?${qs}` : "";
  return request<import("@/types").TextDocument[]>(`/texts/${query}`);
};
export const createText = (data: { title?: string; category_id?: number; library_id?: number }) =>
  request<import("@/types").TextDocument>("/texts/", { method: "POST", body: JSON.stringify(data) });
export const getText = (id: number) =>
  request<import("@/types").TextDocument>(`/texts/${id}`);
export const updateText = (id: number, data: { title?: string; content?: unknown }) =>
  request<import("@/types").TextDocument>(`/texts/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteText = (id: number) =>
  request<void>(`/texts/${id}`, { method: "DELETE" });

// Search
export const search = (q: string) =>
  request<import("@/types").SearchResult>(`/search/?q=${encodeURIComponent(q)}`);
