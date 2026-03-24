# Architecture Document - Πολιτιστικός Σύλλογος Μέσης (Mesi)

## 📋 Project Overview

**Mesi** is a Next.js-based website for the Cultural Society "Mesi" (Πολιτιστικός Σύλλογος Μέσης), dedicated to preserving and promoting local traditions and culture. The application features news/article management, member contributions, family tree tracking, and historical content display.

---

## 🏗️ Architecture Layers

### 1. Presentation Layer (Next.js App Router)
```
┌─────────────────────────────────────────┐
│         Frontend Rendering Layer         │
│           Next.js 15 + App Router        │
│              React 19 + Server Actions   │
└─────────────────────────────────────────┘
          ↓ (API Routes)
```

#### Pages Structure:
| Route | Purpose |
|-------|---------|
| `/` | Homepage with latest articles and logo carousel |
| `/news/` | News archives listing page |
| `/news/[slug]/` | Individual article view |
| `/login/` | User authentication page |
| `/admin/` | Admin dashboard |
| `/admin/articles/` | Article management |
| `/admin/authors/` | Author management |
| `/author/panel/` | Author workspace |
| `/family-tree/` | Genealogy/family tree view |
| `/history/` | Historical content section |

#### UI Components:
- **Radix UI Primitives**: shadcn/ui component library (Dialog, Card, Button, Form, etc.)
- **Framer Motion**: Animation for hero sections and transitions
- **Tailwind CSS v4**: Utility-first styling with CSS variables

---

### 2. API Layer

#### Authentication APIs (`/api/auth/`):
```
┌─────────────────────────────────────────┐
│  JWT Session Management                  │
│  - /login/route.ts    (POST)   Sign-in  │
│  - /logout/route.ts   (POST)   Sign-out  │
│  - session cookies with jose library     │
└─────────────────────────────────────────┘
```

**JWT Configuration:**
- Algorithm: HS256
- Expiry: 7 days
- Secret: `JWT_SECRET` env variable
- Storage: HTTP-only cookies (`session` cookie)

#### Content APIs (`/api/articles/`):
| Method | Endpoint | Functionality |
|--------|----------|---------------|
| GET    | `/articles` | List all articles (public) |
| GET    | `/articles/[id]` | Get article by ID/slug |
| POST   | `/articles` | Create new article (AUTH: AUTHOR+) |
| PUT    | `/articles/[id]` | Update existing article (AUTH: AUTHOR+) |
| DELETE| `/articles/[id]` | Delete article (AUTH: ADMIN) |

#### Author APIs (`/api/authors/`):
| Method | Endpoint | Functionality |
|--------|----------|---------------|
| GET    | `/authors` | List all authors |
| GET    | `/authors/[id]` | Get author profile |
| POST   | `/authors` | Register new author (AUTH: ADMIN) |
| PUT    | `/authors/[id]` | Update author profile (AUTH: AUTHOR+) |

#### People APIs (`/api/people/`):
```
┌─────────────────────────────────────────┐
│  Genealogy API                           │
│  - List/detailed person records          │
│  - Family tree data access               │
└─────────────────────────────────────────┘
```

#### Upload APIs (`/api/upload/`):
```
┌─────────────────────────────────────────┐
│      Image Upload Handling               │
│  - Accepts multipart/form-data           │
│  - Validates image files                 │
│  - Transforms to Cloudinary              │
└─────────────────────────────────────────┘
```

---

### 3. Data Layer (Database)

#### Database: PostgreSQL via Prisma ORM

**Schema Models:**

| Model | Description | Relations |
|-------|-------------|-----------|
| `User` | Account holders with roles | → Article[] |
| `Article` | Content/posts/articles | ↔ User (author) |
| `Person` | People/genealogy records | ↕ ParentChild (self-reference) |

**Role Hierarchy:**
```
ADMIN (full access) > AUTHOR (create/update articles) > GUEST (read-only)
         └───────────┬──────┘
                    ↓
              User.role @default(AUTHOR)
```

---

### 4. Media Layer

#### Image Management: Cloudinary v2 API

**Configuration:**
- Cloud Name: `CLOUDINARY_CLOUD_NAME` env var
- API Key: `CLOUDINARY_API_KEY`
- API Secret: `CLOUDINARY_API_SECRET`

**Upload Flow:**
1. Client uploads image to `/api/upload` route
2. Server transforms multipart/form-data
3. Uploads to Cloudinary CDN
4. Stores URL in database via Prisma
5. Returns optimized URL for display

---

## 🔐 Security Considerations

### Authentication Flow:
1. User submits credentials → `/api/auth/login/route.ts`
2. Hash verification with `bcryptjs`
3. JWT token issued with user data
4. Token stored in HTTP-only cookie
5. Session validated on protected routes

### Authorization Levels:
| Action | Role Required |
|--------|---------------|
| Read any content | Public (no auth) |
| Create article | AUTHOR+ |
| Update own content | AUTHOR |
| Update other content | ADMIN |
| Delete content | ADMIN |
| Admin panel access | ADMIN |

### CSRF Protection:
- HTTP-only cookies prevent XSS-based theft
- SameSite cookie attributes recommended for production

---

## 📁 Key File Locations

```
src structure implied (Next.js conventions):
.
├── app/                    # App Router pages & API routes
│   ├── api/               # REST APIs
│   │   ├── auth/          # Auth endpoints
│   │   ├── articles/      # Article CRUD
│   │   ├── authors/       # Author management
│   │   ├── people/        # People/genealogy
│   │   └── upload/        # Image uploads
│   ├── admin/             # Admin dashboard
│   ├── author/            # Author workspace
│   ├── family-tree/       # Genealogy view
│   └── news/              # Articles listing/detail
├── components/            # React components
│   ├── ui/                # shadcn/ui primitives
│   ├── admin/             # Admin-specific components
│   ├── author/            # Author panel components
│   └── LogoCarousel.tsx   # Featured images carousel
├── lib/                   # Utility libraries
│   ├── auth.ts            # JWT/session helpers
│   ├── cloudinary.ts      # Cloudinary client
│   ├── prisma.ts          # DB connection
│   └── utils.ts           # Helper utilities
├── prisma/                # Database layer
│   ├── schema.prisma      # Data model definitions
│   └── seed.ts            # Initial data population
└── public/                # Static assets
    └── assets/            # Images, logos
```

---

## 🛠️ Technology Stack Summary

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Animations** | Framer Motion |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **Authentication** | JWT (jose library) + HTTP-only cookies |
| **Image Hosting** | Cloudinary v2 API |
| **Forms** | React Hook Form + Zod validation |
| **UI Primitives** | Radix UI |

---

## 🔄 Data Flow Diagrams

### Article Creation Flow:
```
┌─────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│  Client │────▶│ CreatePostForm│────▶│  /api/   │────▶│    Cloud   │
│  (React)│     │ articles      │  │  articles  │  │             │
└─────────┘     └──────────────┘     └──────────┘     └──────────┘
                                           ↓ (store URL)
                                   ┌──────────────┐
                                    │    Article   │
                                    │   (Prisma)   │
                                    └──────────────┘
```

### Authentication Flow:
```
┌─────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│  Client │────▶│ Login Form   │────▶│ /api/     │────▶│   JWT    │
│         │     │              │  │ auth/login  │  │ + Cookie   │
└─────────┘     └──────────────┘     └──────────┘     └──────────┘
                                           ↓ (verify)
                                   ┌──────────────┐
                                    │    User     │
                                    │   (Prisma)  │
                                    └──────────────┘
```

---

## 🎯 Key Features

1. **Dynamic Content**: Server-side rendering with `force-dynamic` for real-time updates
2. **Image Carousel**: LogoCarousel component displays featured images in slideshow
3. **Role-Based Access**: Different permission levels via User.role enum
4. **Family Tree**: Person model with bi-directional parent-child relationships
5. **Responsive Design**: Mobile-first Tailwind CSS approach
6. **SEO-Optimized**: Dynamic routes, sitemap, robots support built-in

---

## 🚀 Deployment Considerations

### Environment Variables Required:
```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=cloud-name
CLOUDINARY_API_KEY=key
CLOUDINARY_API_SECRET=secret
```

### Build Commands:
```bash
npm run build    # Production build
npm start        # Start production server
```

---

## 📝 Document Maintenance

**Last Updated**: 2026-03-24  
**Next Review**: After major architecture changes  

**Related Documents:**
- `.clinerules/rules.md` - Operational guidelines
- `README.md` - User-facing documentation