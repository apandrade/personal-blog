# Personal Blog

A modern, production-ready personal blog built with Astro.js, featuring a clean Medium-inspired design, internationalization (Portuguese and English), and a database-agnostic architecture.

## ✨ Features

- 🎨 **Clean Design**: Medium-inspired UI with excellent typography and readability
- 🌍 **Internationalization**: Support for Portuguese and English with easy language switching
- 🔍 **Advanced Filtering**: Search posts by title, filter by date (year/month), and sort chronologically
- 📱 **Responsive**: Mobile-first design that works beautifully on all devices
- 🎯 **SEO Optimized**: Built-in SEO support with meta tags and semantic HTML
- 🚀 **Fast Performance**: Static site generation with Astro.js for optimal speed
- 🔌 **Database Agnostic**: Abstract data layer ready to connect to any database
- 📤 **Social Sharing**: Share posts on Twitter, Facebook, LinkedIn, and WhatsApp
- 🎭 **Mock Data**: Faker.js integration for development and testing
- 💅 **Componentized**: Reusable components for easy customization and extension

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:
```bash
cd personal-blog
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit: `http://localhost:4321`

## 📁 Project Structure

```
personal-blog/
├── public/
│   └── locales/           # Translation files
│       ├── en/
│       └── pt/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PostCard.astro
│   │   ├── SearchBar.astro
│   │   ├── DateFilter.astro
│   │   ├── SortToggle.astro
│   │   ├── ViewToggle.astro
│   │   ├── ShareButtons.astro
│   │   └── LanguageSwitcher.astro
│   ├── layouts/           # Page layouts
│   │   ├── BaseLayout.astro
│   │   ├── ContentLayout.astro
│   │   └── BlogPost.astro
│   ├── lib/               # Utility functions
│   │   ├── data.ts        # Database instance
│   │   └── utils.ts       # Helper functions
│   ├── pages/             # Route pages
│   │   ├── index.astro    # Home page
│   │   ├── sobre.astro    # About page (PT)
│   │   ├── about.astro    # About page (EN)
│   │   ├── contato.astro  # Contact page (PT)
│   │   └── blog/
│   │       ├── index.astro       # Blog listing
│   │       └── [...slug].astro   # Individual post
│   ├── services/          # Business logic
│   │   ├── database.interface.ts
│   │   └── mock-database.service.ts
│   ├── styles/
│   │   └── global.css     # Global styles
│   └── types/
│       └── index.ts       # TypeScript types
├── astro.config.mjs       # Astro configuration
├── astro-i18next.config.ts # i18n configuration
├── package.json
└── README.md
```

## 🎯 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run astro check
```

## 🔧 Configuration

### Internationalization

The blog supports two languages by default: Portuguese (pt) and English (en). Configuration is in `astro-i18next.config.ts`:

```typescript
const config: AstroI18nextConfig = {
  defaultLocale: "pt",
  locales: ["pt", "en"],
  // ...
};
```

Translation files are located in `public/locales/[lang]/common.json`.

### Site Metadata

Update site information in `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://your-domain.com',
  // ...
});
```

## 🗄️ Database Integration

The blog uses an **abstract database layer** that makes it database-agnostic. Currently, it uses mock data from Faker.js, but you can easily connect to any database.

### Current Architecture

```
src/
├── services/
│   ├── database.interface.ts      # Interface definition
│   └── mock-database.service.ts   # Mock implementation
└── lib/
    └── data.ts                     # Database instance
```

### Connecting to a Real Database

#### Step 1: Implement the DatabaseService Interface

Create a new service that implements `DatabaseService`. Example with Prisma:

```typescript
// src/services/prisma-database.service.ts
import { PrismaClient } from '@prisma/client';
import type { DatabaseService } from './database.interface';
import type { Author, PostWithAuthor, PostFilters } from '../types';

export class PrismaDatabaseService implements DatabaseService {
  private prisma: PrismaClient;

  constructor(connectionString: string) {
    this.prisma = new PrismaClient({
      datasources: {
        db: { url: connectionString }
      }
    });
  }

  async getAuthor(): Promise<Author> {
    const author = await this.prisma.author.findFirst();
    return author as Author;
  }

  async getPosts(filters?: PostFilters): Promise<PostWithAuthor[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        title: filters?.search 
          ? { contains: filters.search, mode: 'insensitive' }
          : undefined,
        publishedAt: {
          gte: filters?.year ? new Date(filters.year, filters.month || 0) : undefined,
          lt: filters?.year && filters?.month !== undefined
            ? new Date(filters.year, filters.month + 1)
            : undefined,
        }
      },
      include: { author: true },
      orderBy: {
        publishedAt: filters?.sortOrder === 'asc' ? 'asc' : 'desc'
      }
    });
    return posts as PostWithAuthor[];
  }

  async getPostBySlug(slug: string): Promise<PostWithAuthor | null> {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: { author: true }
    });
    return post as PostWithAuthor | null;
  }

  async getRecentPosts(limit: number): Promise<PostWithAuthor[]> {
    const posts = await this.prisma.post.findMany({
      take: limit,
      include: { author: true },
      orderBy: { publishedAt: 'desc' }
    });
    return posts as PostWithAuthor[];
  }

  async getAvailableDates(): Promise<{ year: number; month: number }[]> {
    // Implement based on your database
    const posts = await this.prisma.post.findMany({
      select: { publishedAt: true },
      orderBy: { publishedAt: 'desc' }
    });
    
    const dates = new Set<string>();
    posts.forEach(post => {
      const year = post.publishedAt.getFullYear();
      const month = post.publishedAt.getMonth();
      dates.add(`${year}-${month}`);
    });

    return Array.from(dates).map(date => {
      const [year, month] = date.split('-').map(Number);
      return { year, month };
    });
  }
}
```

#### Step 2: Update the Database Instance

In `src/lib/data.ts`, replace the mock service:

```typescript
import { PrismaDatabaseService } from '../services/prisma-database.service';
import type { DatabaseService } from '../services/database.interface';

// Use environment variable for connection string
const connectionString = import.meta.env.DATABASE_URL;

export const db: DatabaseService = new PrismaDatabaseService(connectionString);
```

#### Step 3: Add Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blog"
```

#### Step 4: Install Database Dependencies

```bash
# For Prisma + PostgreSQL
npm install @prisma/client prisma
npx prisma init
npx prisma migrate dev

# For MongoDB
npm install mongodb

# For MySQL
npm install mysql2
```

### Database Schema Example

Here's a suggested schema for Prisma:

```prisma
// prisma/schema.prisma
model Author {
  id     String @id @default(uuid())
  name   String
  bio    String
  avatar String
  email  String @unique
  posts  Post[]
  
  // Social links stored as JSON
  social Json
}

model Post {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String   @db.Text
  coverImage  String
  publishedAt DateTime
  authorId    String
  author      Author   @relation(fields: [authorId], references: [id])
  tags        String[]
}
```

### Seeding the Database

Create a seed script:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create author
  const author = await prisma.author.create({
    data: {
      name: faker.person.fullName(),
      bio: faker.person.bio(),
      avatar: faker.image.avatar(),
      email: faker.internet.email(),
      social: {
        twitter: faker.internet.userName(),
        linkedin: faker.internet.userName(),
        github: faker.internet.userName(),
      }
    }
  });

  // Create posts
  for (let i = 0; i < 25; i++) {
    const title = faker.lorem.sentence({ min: 3, max: 8 });
    await prisma.post.create({
      data: {
        title,
        slug: faker.helpers.slugify(title).toLowerCase(),
        excerpt: faker.lorem.paragraph(),
        content: faker.lorem.paragraphs(5),
        coverImage: faker.image.urlLoremFlickr({ 
          category: 'technology', 
          width: 1200, 
          height: 630 
        }),
        publishedAt: faker.date.past({ years: 2 }),
        authorId: author.id,
        tags: faker.helpers.arrayElements(
          ['technology', 'programming', 'design', 'web'],
          { min: 1, max: 3 }
        )
      }
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run the seed:

```bash
npx prisma db seed
```

## 🎨 Customization

### Changing Colors

Edit `src/styles/global.css`:

```css
:root {
  --color-black: #000000;
  --color-primary: #your-color;
  /* ... */
}
```

### Adding New Components

1. Create component in `src/components/`
2. Import and use in your pages or layouts
3. All components follow Astro's component syntax

### Modifying Translations

Edit translation files in `public/locales/[lang]/common.json`:

```json
{
  "common": {
    "newKey": "Your translation"
  }
}
```

Use in components:

```astro
---
import { t } from 'i18next';
---
<p>{t('common:newKey')}</p>
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This generates a static site in the `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to GitHub Pages

Add to your `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

## 📝 Adding Content

### Creating New Posts

With the mock service, posts are generated automatically. When you connect to a real database:

1. Add a post through your database interface
2. Ensure it has all required fields (title, slug, excerpt, content, coverImage, publishedAt, authorId)
3. The post will automatically appear on the site

### Content Best Practices

- **Title**: Keep it concise and descriptive (40-60 characters)
- **Excerpt**: Write a compelling summary (150-200 characters)
- **Cover Image**: Use high-quality images (1200x630px recommended)
- **Content**: Use proper headings (H2, H3) for structure
- **Tags**: Use 2-4 relevant tags per post

## 🧪 Testing

The mock data service is perfect for:
- Development and testing
- Demos and presentations
- UI/UX prototyping
- Learning Astro.js

## 📚 Tech Stack

- **Framework**: Astro.js 5.x
- **Language**: TypeScript
- **Styling**: CSS (no framework needed)
- **Internationalization**: astro-i18next
- **Mock Data**: Faker.js
- **Icons**: Inline SVG

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your personal blog!

## 🆘 Support

- Check the [Astro Documentation](https://docs.astro.build)
- Review issues and discussions
- Read the code comments for implementation details

---

Built with ❤️ using Astro.js
