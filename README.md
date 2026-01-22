# Personal Blog - Astro.js

A modern, production-ready personal blog with Medium-inspired design, featuring internationalization (PT/EN), client-side filtering, and database-agnostic architecture.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit: `http://localhost:4321`

## ✨ Features

- 🎨 Clean, Medium-inspired design
- 🌍 Internationalization (Portuguese & English)
- 🔍 Client-side search with real-time filtering
- 📅 Date filtering (by year/month)
- 🔄 Sort by newest/oldest
- 👁️ Grid/list view toggle
- 📄 Load more pagination (10 posts per page)
- 📱 Fully responsive
- 🚀 Blazing fast (Astro.js)
- 🔌 Database-agnostic architecture
- 💅 Fully componentized

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── layouts/          # Page layouts
├── pages/            # Routes (index, blog, about)
│   ├── en/          # English routes
│   └── blog/        # Blog routes
├── services/         # Database abstraction
│   ├── database.interface.ts
│   └── mock-database.service.ts
├── lib/              # Utilities and data instance
├── types/            # TypeScript types
└── styles/           # Global styles

public/
└── locales/          # Translation files (pt/en)
```

## 🗄️ Database Integration

Currently uses **mock data** (Faker.js). To connect to a real database:

### 1. Implement the DatabaseService Interface

```typescript
// src/services/your-database.service.ts
import type { DatabaseService } from './database.interface';

export class YourDatabaseService implements DatabaseService {
  // Implement all interface methods
  async getAuthor() { /* ... */ }
  async getPosts(filters) { /* ... */ }
  async getPostBySlug(slug) { /* ... */ }
  async getRecentPosts(limit) { /* ... */ }
  async getAvailableDates() { /* ... */ }
}
```

### 2. Update Data Instance

```typescript
// src/lib/data.ts
import { YourDatabaseService } from '../services/your-database.service';

export const db = new YourDatabaseService(connectionString);
```

### 3. Example with Prisma

```bash
# Install Prisma
npm install @prisma/client prisma

# Initialize
npx prisma init

# Create schema (see EXAMPLE-prisma-database.service.ts for implementation)
# Run migration
npx prisma migrate dev

# Seed database
npx prisma db seed
```

See `EXAMPLE-prisma-database.service.ts` for a complete Prisma implementation example.

## 🎨 Customization

### Change Colors

Edit `src/styles/global.css`:

```css
:root {
  --color-black: #000000;
  /* Add your colors */
}
```

### Add Translations

Edit `public/locales/[lang]/common.json`:

```json
{
  "common": {
    "newKey": "Translation"
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

### Modify Site Info

Update `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://your-domain.com',
});
```

## 📦 Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🚀 Deployment

Build generates static files in `dist/`:

```bash
npm run build
```

Deploy to:
- **Vercel**: `vercel`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: Configure GitHub Actions

## 📚 Pages

- **Home** (`/` or `/en`): 6 most recent posts
- **Blog** (`/blog` or `/en/blog`): All posts with client-side search, date filters, sorting, grid/list view, and load more pagination
- **About** (`/sobre` or `/en/about`): Author information with email contact
- **Post** (`/blog/[slug]`): Individual blog post

## 🧩 Components

- `Header`: Navigation with language switcher
- `Footer`: Simple footer with copyright
- `PostCard`: Post preview card with title, excerpt, date, and tags
- `LanguageSwitcher`: PT/EN language toggle
- `BaseLayout`: Main layout wrapper
- `BlogPost`: Individual blog post layout

## 📖 Full Documentation

See `EXAMPLE-prisma-database.service.ts` for:
- Complete Prisma implementation example
- Database schema structure
- All DatabaseService interface methods
- Type definitions

## 🛠️ Tech Stack

- **Astro.js** 5.x - Static site generator
- **TypeScript** - Type safety
- **astro-i18next** - Internationalization
- **Faker.js** - Mock data generation
- **CSS** - Pure CSS, no frameworks

## 🎯 Blog Features

### Client-Side Interactivity

All blog filtering, sorting, and pagination is implemented client-side for instant responsiveness:

- **Search**: Real-time search by title and excerpt
- **Date Filter**: Filter posts by year and month
- **Sort**: Toggle between newest and oldest first
- **View Mode**: Switch between grid and list layouts
- **Pagination**: Load more posts (10 per page)

### Database Architecture

The blog uses a database-agnostic interface pattern:

```typescript
interface DatabaseService {
  getAuthor(): Promise<Author>;
  getPosts(filters?: PostFilters): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | null>;
  getRecentPosts(limit: number): Promise<Post[]>;
  getAvailableDates(): Promise<AvailableDate[]>;
  getPageContent(page: string, locale: 'pt' | 'en'): Promise<PageContent>;
}
```

This allows easy switching between mock data (Faker), Prisma, MongoDB, or any other database.

## 📄 License

MIT License - Free to use for personal projects

---

**Note**: This blog is ready for production. Simply implement the DatabaseService interface with your preferred database and you're good to go!

For implementation examples, check `EXAMPLE-prisma-database.service.ts`.
