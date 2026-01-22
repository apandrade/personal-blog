/**
 * Database Service Interface
 * 
 * This is an abstraction layer that allows the application to be
 * database-agnostic. To connect to a real database:
 * 
 * 1. Implement this interface with your database client (e.g., Prisma, MongoDB, PostgreSQL)
 * 2. Replace the MockDatabaseService in src/lib/data.ts with your implementation
 * 3. Add your database connection string to environment variables
 */

import type { Author, Post, PostWithAuthor, PostFilters } from '../types';

export interface PaginatedPosts {
  posts: PostWithAuthor[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface DatabaseService {
  /**
   * Get the default author (blog owner)
   */
  getAuthor(): Promise<Author>;

  /**
   * Get all posts with optional filters and pagination
   */
  getPosts(filters?: PostFilters): Promise<PaginatedPosts>;

  /**
   * Get a specific post by slug
   */
  getPostBySlug(slug: string): Promise<PostWithAuthor | null>;

  /**
   * Get recent posts (limited)
   */
  getRecentPosts(limit: number): Promise<PostWithAuthor[]>;

  /**
   * Get available years and months for filtering
   */
  getAvailableDates(): Promise<{ year: number; month: number }[]>;

  /**
   * Get dynamic page content (hero, about, contact)
   */
  getPageContent(page: 'home' | 'about' | 'contact', locale: 'pt' | 'en'): Promise<{
    title: string;
    subtitle?: string;
    content: string[];
  }>;
}
