import { faker } from '@faker-js/faker';
import type { Author, Post, PostWithAuthor, PostFilters } from '../types';
import type { DatabaseService, PaginatedPosts } from './database.interface';

/**
 * Mock Database Service using Faker.js
 * 
 * This service generates fake data for development and testing.
 * Replace this with a real database implementation for production.
 */
export class MockDatabaseService implements DatabaseService {
  private author: Author;
  private posts: Post[];

  constructor() {
    // Set seed for consistent data generation
    faker.seed(123);
    
    this.author = this.generateAuthor();
    this.posts = this.generatePosts(25); // Generate 25 mock posts
  }

  private generateAuthor(): Author {
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      bio: faker.person.bio(),
      avatar: faker.image.avatar(),
      email: faker.internet.email(),
      social: {
        twitter: faker.internet.username(),
        linkedin: faker.internet.username(),
        github: faker.internet.username(),
      },
    };
  }

  private generatePosts(count: number): Post[] {
    const posts: Post[] = [];
    
    for (let i = 0; i < count; i++) {
      const title = faker.lorem.sentence({ min: 3, max: 8 });
      const slug = faker.helpers.slugify(title).toLowerCase();
      
      posts.push({
        id: faker.string.uuid(),
        title,
        slug,
        excerpt: faker.lorem.paragraph(),
        content: this.generateMarkdownContent(),
        coverImage: faker.image.url({ width: 1200, height: 630 }),
        publishedAt: faker.date.past({ years: 2 }),
        authorId: this.author.id,
        tags: faker.helpers.arrayElements(
          ['technology', 'programming', 'design', 'web', 'javascript', 'typescript', 'react', 'astro'],
          { min: 1, max: 3 }
        ),
      });
    }

    // Sort by date descending (newest first)
    return posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  private generateMarkdownContent(): string {
    const paragraphs = faker.helpers.multiple(() => faker.lorem.paragraph(), { count: { min: 5, max: 10 } });
    const sections = paragraphs.map((p, i) => {
      if (i % 3 === 0 && i > 0) {
        return `## ${faker.lorem.sentence()}\n\n${p}`;
      }
      return p;
    });
    
    return sections.join('\n\n');
  }

  async getAuthor(): Promise<Author> {
    return this.author;
  }

  async getPosts(filters?: PostFilters): Promise<PaginatedPosts> {
    let filteredPosts = [...this.posts];

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower)
      );
    }

    // Apply date filters
    if (filters?.year) {
      filteredPosts = filteredPosts.filter(post =>
        post.publishedAt.getFullYear() === filters.year
      );
    }

    if (filters?.month !== undefined) {
      filteredPosts = filteredPosts.filter(post =>
        post.publishedAt.getMonth() === filters.month
      );
    }

    // Apply sort order
    if (filters?.sortOrder === 'asc') {
      filteredPosts.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
    } else {
      filteredPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    }

    // Pagination
    const page = filters?.page || 1;
    const perPage = filters?.perPage || 10;
    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    // Add author to each post
    const postsWithAuthor = paginatedPosts.map(post => ({
      ...post,
      author: this.author,
    }));

    return {
      posts: postsWithAuthor,
      total,
      page,
      perPage,
      totalPages,
    };
  }

  async getPostBySlug(slug: string): Promise<PostWithAuthor | null> {
    const post = this.posts.find(p => p.slug === slug);
    
    if (!post) {
      return null;
    }

    return {
      ...post,
      author: this.author,
    };
  }

  async getRecentPosts(limit: number): Promise<PostWithAuthor[]> {
    const sortedPosts = [...this.posts].sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );

    return sortedPosts.slice(0, limit).map(post => ({
      ...post,
      author: this.author,
    }));
  }

  async getAvailableDates(): Promise<{ year: number; month: number }[]> {
    const dates = new Set<string>();
    
    this.posts.forEach(post => {
      const year = post.publishedAt.getFullYear();
      const month = post.publishedAt.getMonth();
      dates.add(`${year}-${month}`);
    });

    return Array.from(dates)
      .map(date => {
        const [year, month] = date.split('-').map(Number);
        return { year, month };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
  }

  async getPageContent(page: 'home' | 'about' | 'contact', locale: 'pt' | 'en'): Promise<{
    title: string;
    subtitle?: string;
    content: string[];
  }> {
    faker.seed(456); // Different seed for page content

    const content: { [key: string]: { [lang: string]: any } } = {
      home: {
        pt: {
          title: faker.company.catchPhrase(),
          subtitle: faker.lorem.sentence({ min: 8, max: 15 }),
          content: []
        },
        en: {
          title: faker.company.catchPhrase(),
          subtitle: faker.lorem.sentence({ min: 8, max: 15 }),
          content: []
        }
      },
      about: {
        pt: {
          title: 'Sobre Este Blog',
          content: [
            faker.lorem.paragraph({ min: 3, max: 5 }),
            faker.lorem.paragraph({ min: 3, max: 5 }),
            faker.lorem.paragraph({ min: 3, max: 5 }),
          ]
        },
        en: {
          title: 'About This Blog',
          content: [
            faker.lorem.paragraph({ min: 3, max: 5 }),
            faker.lorem.paragraph({ min: 3, max: 5 }),
            faker.lorem.paragraph({ min: 3, max: 5 }),
          ]
        }
      },
      contact: {
        pt: {
          title: 'Entre em Contato',
          content: [
            'Sinta-se à vontade para entrar em contato!',
            faker.lorem.paragraph({ min: 2, max: 4 }),
          ]
        },
        en: {
          title: 'Get In Touch',
          content: [
            'Feel free to reach out!',
            faker.lorem.paragraph({ min: 2, max: 4 }),
          ]
        }
      }
    };

    return content[page][locale];
  }
}
