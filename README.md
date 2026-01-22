# Personal Blog - Astro.js

A modern, production-ready personal blog with Medium-inspired design, featuring internationalization (PT/EN), advanced filtering, and database-agnostic architecture.

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
- 🔍 Search, filter by date, sort posts
- 📱 Fully responsive
- 🚀 Blazing fast (Astro.js)
- 🔌 Database-agnostic architecture
- 📤 Social sharing
- 💅 Fully componentized

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── layouts/          # Page layouts
├── pages/            # Routes (index, blog, about, contact)
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

# Create schema (see DOCUMENTATION.md for full schema)
# Run migration
npx prisma migrate dev

# Seed database
npx prisma db seed
```

See `DOCUMENTATION.md` for complete database integration guide with examples for Prisma, MongoDB, and MySQL.

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

- **Home** (`/`): 5 most recent posts
- **Blog** (`/blog`): All posts with search, filters, sorting
- **About** (`/sobre` or `/about`): Author information
- **Contact** (`/contato`): Contact information
- **Post** (`/blog/[slug]`): Individual post with sharing

## 🧩 Components

- `Header`: Navigation with language switcher
- `Footer`: Simple footer
- `PostCard`: Post preview card
- `PostsContainer`: Grid/list view
- `SearchBar`: Search posts
- `DateFilter`: Filter by year/month
- `SortToggle`: Sort newest/oldest
- `ViewToggle`: Toggle grid/list view
- `ShareButtons`: Social sharing
- `LanguageSwitcher`: PT/EN switcher

## 📖 Full Documentation

See `DOCUMENTATION.md` for:
- Complete database integration guide
- Detailed customization instructions
- Database schema examples
- Seeding scripts
- Best practices
- Advanced features

## 🛠️ Tech Stack

- **Astro.js** 5.x - Static site generator
- **TypeScript** - Type safety
- **astro-i18next** - Internationalization
- **Faker.js** - Mock data generation
- **CSS** - No framework, pure CSS

## 📄 License

MIT License - Free to use for personal projects

---

**Note**: This blog is ready for production. Simply connect your database using the provided interface and you're good to go!

For questions or issues, check `DOCUMENTATION.md` or the code comments.
