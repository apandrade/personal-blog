// Example Prisma Database Service Implementation
// Save as: src/services/prisma-database.service.ts

import { PrismaClient } from '@prisma/client';
import type { DatabaseService, PaginatedPosts } from './database.interface';
import type { Author, PostWithAuthor, PostFilters } from '../types';

export class PrismaDatabaseService implements DatabaseService {
  private prisma: PrismaClient;

  constructor(connectionString?: string) {
    this.prisma = new PrismaClient(
      connectionString
        ? {
            datasources: {
              db: { url: connectionString },
            },
          }
        : undefined
    );
  }

  async getAuthor(): Promise<Author> {
    const author = await this.prisma.author.findFirst();
    if (!author) {
      throw new Error('No author found');
    }
    return {
      id: author.id,
      name: author.name,
      bio: author.bio,
      avatar: author.avatar,
      email: author.email,
      social: author.social as any, // Assuming social is stored as JSON
    };
  }

  async getPosts(filters?: PostFilters): Promise<PaginatedPosts> {
    const where: any = {};

    // Apply search filter
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { excerpt: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Apply date filters
    if (filters?.year) {
      const startDate = new Date(filters.year, filters.month || 0, 1);
      const endDate =
        filters.month !== undefined
          ? new Date(filters.year, filters.month + 1, 0)
          : new Date(filters.year, 11, 31);

      where.publishedAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    // Pagination
    const page = filters?.page || 1;
    const perPage = filters?.perPage || 10;
    const skip = (page - 1) * perPage;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: { author: true },
        orderBy: {
          publishedAt: filters?.sortOrder === 'asc' ? 'asc' : 'desc',
        },
        skip,
        take: perPage,
      }),
      this.prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        publishedAt: post.publishedAt,
        authorId: post.authorId,
        tags: post.tags as string[],
        author: {
          id: post.author.id,
          name: post.author.name,
          bio: post.author.bio,
          avatar: post.author.avatar,
          email: post.author.email,
          social: post.author.social as any,
        },
      })),
      total,
      page,
      perPage,
      totalPages,
    };
  }

  async getPostBySlug(slug: string): Promise<PostWithAuthor | null> {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: { author: true },
    });

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      authorId: post.authorId,
      tags: post.tags as string[],
      author: {
        id: post.author.id,
        name: post.author.name,
        bio: post.author.bio,
        avatar: post.author.avatar,
        email: post.author.email,
        social: post.author.social as any,
      },
    };
  }

  async getRecentPosts(limit: number): Promise<PostWithAuthor[]> {
    const posts = await this.prisma.post.findMany({
      take: limit,
      include: { author: true },
      orderBy: { publishedAt: 'desc' },
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      authorId: post.authorId,
      tags: post.tags as string[],
      author: {
        id: post.author.id,
        name: post.author.name,
        bio: post.author.bio,
        avatar: post.author.avatar,
        email: post.author.email,
        social: post.author.social as any,
      },
    }));
  }

  async getAvailableDates(): Promise<{ year: number; month: number }[]> {
    const posts = await this.prisma.post.findMany({
      select: { publishedAt: true },
      orderBy: { publishedAt: 'desc' },
    });

    const dates = new Set<string>();
    posts.forEach((post) => {
      const year = post.publishedAt.getFullYear();
      const month = post.publishedAt.getMonth();
      dates.add(`${year}-${month}`);
    });

    return Array.from(dates)
      .map((date) => {
        const [year, month] = date.split('-').map(Number);
        return { year, month };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
  }
}

// To use this service:
// 1. Install Prisma: npm install @prisma/client prisma
// 2. Initialize: npx prisma init
// 3. Create schema (see DOCUMENTATION.md)
// 4. Run migration: npx prisma migrate dev
// 5. Update src/lib/data.ts:
//
//    import { PrismaDatabaseService } from '../services/prisma-database.service';
//    export const db = new PrismaDatabaseService(process.env.DATABASE_URL);
