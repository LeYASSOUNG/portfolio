/**
 * Interfaces TypeScript pour toutes les entites de l'API.
 * Remplacent les ny dans ApiService pour assurer la securite du typage.
 */

export interface Project {
  id: number;
  title: string;
  description: string;
  link?: string;
  github?: string;
  image?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
  level?: number;
  icon?: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  start_date: string;
  end_date?: string;
  description?: string;
  location?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  image?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  id: number;
  article_id: number;
  author: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject?: string;
  body: string;
  read?: boolean;
  reply?: string;
  created_at?: string;
}

export interface Score {
  id: number;
  player_name: string;
  score: number;
  time_taken: number;
  created_at?: string;
}

export interface Setting {
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  theme_primary?: string;
  theme_secondary?: string;
  [key: string]: string | undefined;
}

export interface GuestbookEntry {
  id: number;
  user_id?: number;
  message: string;
  author?: string;
  avatar?: string;
  created_at?: string;
}

export interface Testimonial {
  id: number;
  author: string;
  role?: string;
  company?: string;
  content: string;
  avatar?: string;
  rating?: number;
}

export interface CompanyService {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  price?: string;
}

export interface Subscriber {
  id: number;
  email: string;
  created_at?: string;
}

export interface PageView {
  id: number;
  page_url: string;
  views: number;
  created_at?: string;
}

export interface GithubStats {
  login?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
  contributions?: number;
  languages?: Record<string, number>;
  repos?: GithubRepo[];
}

export interface GithubRepo {
  name: string;
  description?: string;
  html_url: string;
  language?: string;
  stargazers_count: number;
  forks_count: number;
}

export interface NowData {
  github?: GithubStats;
  spotify?: SpotifyTrack | null;
}

export interface SpotifyTrack {
  is_playing: boolean;
  title?: string;
  artist?: string;
  album?: string;
  album_art?: string;
  url?: string;
}

export interface ChatResponse {
  reply: string;
}

export interface ChatHistoryItem {
  role: 'user' | 'bot';
  text: string;
}

export interface AuthToken {
  token: string;
  user?: { id: number; name: string; email: string };
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface MediaFile {
  filename: string;
  url: string;
  size?: number;
  mime_type?: string;
  created_at?: string;
}

export interface SeoEntry {
  id?: number;
  page: string;
  title?: string;
  meta_description?: string;
  og_image?: string;
}

export interface MediaItem {
  name: string;
  path: string;
  url?: string;
  size?: number;
  mime_type?: string;
  type: 'file' | 'folder';
  created_at?: string;
}
