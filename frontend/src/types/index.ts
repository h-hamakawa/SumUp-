export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string;
}

export interface Library {
  id: number;
  name: string;
  category_id?: number;
  created_at: string;
  updated_at?: string;
}

export interface TextDocument {
  id: number;
  title: string;
  content?: unknown;
  category_id?: number;
  library_id?: number;
  created_at: string;
  updated_at?: string;
}

export interface SearchResult {
  categories: Category[];
  libraries: Library[];
  texts: TextDocument[];
}

export interface AppSettings {
  font: string;
  theme: "light" | "dark";
  accentColor: string;
}
