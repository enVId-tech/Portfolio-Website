# Portfolio Website

A modern, full-stack portfolio website built with Next.js 16, React 19, and TypeScript. Features an interactive canvas-based animated background, server-side cached GitHub project showcase, blog system with authentication, and responsive design.

**Live Site:** [https://etran.dev](https://etran.dev)

## Features

### Interactive UI
- **Animated Dot Background**: Client-side rendered canvas animation with mouse-reactive particles using typed arrays for optimal performance
- **Dynamic Project Cards**: Auto-fetched GitHub repositories with framework/language detection
- **Smooth Scrolling**: Enhanced navigation with scroll-to-top functionality
- **Section Navigation**: Dynamic section selector for easy page navigation
- **Responsive Design**: Mobile-first approach optimized for all device sizes

### Content Management
- **Blog System**: Full CRUD blog functionality with slug-based routing and scheduled publishing
- **Timeline Component**: Interactive career/education timeline
- **Project Showcase**: Server-side cached GitHub repository data to minimize API usage
- **Technology Stack Display**: Visual representation of skills and proficiency levels

### Authentication & Security
- **User Registration/Login**: Secure authentication system
- **JWT Token Management**: Secure session handling
- **Password Encryption**: bcryptjs for secure password hashing
- **Protected Routes**: Role-based access control

### Database & Caching
- **MongoDB Integration**: Full database connectivity for content management
- **Server-Side Caching**: GitHub API responses cached on server to reduce API calls
- **Cron Jobs**: Automated cache refresh for projects data (every 15 minutes)
- **Client-Side Caching**: Persistent cache for improved performance

## Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Next.js 16** - Full-stack React framework with App Router
- **TypeScript** - Type-safe development
- **SCSS Modules** - Modular styling with advanced CSS features
- **React Icons** - Comprehensive icon library

### Backend & Database
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database for content storage
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing and security

### Development & Deployment
- **Docker** - Containerized deployment
- **GitHub Actions** - CI/CD pipeline
- **ESLint** - Code quality and consistency
- **Vercel** - Production deployment platform with cron support
- **Turbopack** - Ultra-fast development builds

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB instance (local or cloud)
- GitHub Personal Access Token (for repository data)
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/enVId-tech/Portfolio-Website.git
   cd Portfolio-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLIENT_DB=portfolio
   JWT_SECRET=your_jwt_secret_key
   GITHUB_TOKEN=your_github_personal_access_token
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   CRON_SECRET=your_cron_secret_key
   ```

   **GitHub Token Setup:**
   - Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (for public repos)
   - Copy the token and add it to your `.env.local` file
   - **Note:** Without a token, GitHub API rate limits are much more restrictive (60 vs 5000 requests/hour)

4. **Initialize Database**
   ```bash
   npm run init-db
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Project Structure

```
app/
├── _components/              # Reusable React components
│   ├── about.tsx            # About section component
│   ├── blogsComponent.tsx   # Blog listing component
│   ├── dotbackground.tsx    # Canvas-based animated background (SSR disabled)
│   ├── footer.tsx           # Site footer
│   ├── header.tsx           # Hero header section
│   ├── loading.tsx          # Loading spinner component
│   ├── projects.tsx         # GitHub project showcase
│   ├── scrollToTop.tsx      # Scroll to top button
│   ├── sectionSelector.tsx  # Section navigation
│   ├── technology.tsx       # Tech stack display
│   └── timeline.tsx         # Career timeline
├── api/                     # API routes
│   ├── auth/               # Authentication endpoints (login, register, verify)
│   ├── blogs/              # Blog CRUD operations
│   ├── cron/               # Scheduled tasks
│   │   ├── publish-scheduled/  # Auto-publish scheduled blogs
│   │   └── refresh-projects/   # Refresh GitHub projects cache
│   ├── github-repos/       # GitHub repository settings
│   ├── projects/           # Server-cached project data
│   ├── tech/               # Technology stack data
│   └── timeline/           # Timeline data
├── blogs/                   # Blog pages
│   ├── [slug]/             # Dynamic blog post pages
│   └── new/                # Create new blog post
├── context/                 # React Context providers (AuthContext)
├── models/                  # TypeScript type definitions
├── register/               # User registration page
├── scripts/                # Database initialization scripts
├── styles/                 # SCSS modules
└── utils/                  # Utility functions
    ├── cache.ts            # Caching utilities
    ├── db.ts               # Database connection
    ├── githubService.ts    # GitHub API service with rate limiting
    └── globalFonts.ts      # Font configurations
```

## Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t portfolio-website .

# Run the container
docker run -p 3000:3000 --env-file .env.local portfolio-website
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

## Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run ncu          # Update all dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification

### Blog Management
- `GET /api/blogs` - Retrieve all blog posts
- `GET /api/blogs/[slug]` - Get specific blog post
- `POST /api/blogs` - Create new blog post
- `PUT /api/blogs/[slug]` - Update blog post
- `DELETE /api/blogs/[slug]` - Delete blog post

### Data Endpoints
- `GET /api/projects` - Server-cached GitHub projects
- `GET /api/timeline` - Career timeline data
- `GET /api/tech` - Technology stack information
- `GET /api/github-repos` - GitHub repository filter settings

### Cron Jobs (Vercel)
- `GET /api/cron/publish-scheduled` - Publish scheduled blog posts (every minute)
- `GET /api/cron/refresh-projects` - Refresh GitHub projects cache (every 15 minutes)

## Key Features Deep Dive

### Interactive Background Animation
The dot background uses HTML5 Canvas with:
- **Client-only rendering**: Uses Next.js `dynamic()` with `ssr: false` to avoid hydration issues
- **Typed arrays**: `Float32Array` for optimal memory and performance
- **Mouse interaction**: Particles respond to cursor movement
- **Adaptive frame rate**: 30 FPS when mouse active, 5 FPS when idle
- **Discrete scrolling**: Canvas position updates in steps to reduce calculations

### Server-Side Project Caching
GitHub projects are cached on the server to minimize API usage:
- Server cache refreshes every 15 minutes via Vercel cron
- Clients receive instant responses from cache
- Automatic framework detection (React, Next.js, Vue, Angular, etc.)
- Stale cache fallback when API fails

### Blog System
Full-featured blog with:
- Slug-based routing
- Draft/publish workflow
- Scheduled publishing with cron automation
- SEO optimization

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Cron Protection**: Optional secret key for cron endpoints
- **Input Validation**: Server-side validation for all inputs
- **XSS Protection**: Sanitized content rendering

## Responsive Design

- Mobile-first approach with `clamp()` for fluid typography
- Optimized layouts for tablets and desktops
- Touch-friendly interactions
- Overscroll behavior disabled for native feel

## Performance Optimizations

- **Next.js App Router**: Latest routing system with React Server Components
- **Dynamic Imports**: SSR disabled for client-only components
- **Server-Side Caching**: Reduces external API calls
- **Code Splitting**: Automatic route-based splitting
- **Turbopack**: Ultra-fast development builds

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.