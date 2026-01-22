export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  email: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: Date;
  authorId: string;
  tags: string[];
}

export interface PostWithAuthor extends Post {
  author: Author;
}

export type SortOrder = 'desc' | 'asc';
export type ViewMode = 'grid' | 'list';

export interface PostFilters {
  search?: string;
  year?: number;
  month?: number;
  sortOrder: SortOrder;  page?: number;
  perPage?: number;}
