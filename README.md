# 🚀 Portfolio Website

A modern, full-stack portfolio website built with Next.js 15, React 19, and TypeScript. Features an interactive design, blog system, authentication, and comprehensive project showcase.

## ✨ Features

### 🎨 Interactive UI
- **Animated Dot Background**: Canvas-based particle animation that responds to mouse movement
- **Smooth Scrolling**: Enhanced user experience with scroll-to-top functionality
- **Section Navigation**: Dynamic section selector for easy page navigation
- **Responsive Design**: Optimized for all device sizes

### 📝 Content Management
- **Blog System**: Full CRUD blog functionality with slug-based routing
- **Timeline Component**: Interactive career/education timeline
- **Project Showcase**: Comprehensive portfolio of development work
- **Technology Stack Display**: Visual representation of skills and proficiency

### 🔐 Authentication & Security
- **User Registration/Login**: Secure authentication system
- **JWT Token Management**: Secure session handling
- **Password Encryption**: bcryptjs for secure password hashing
- **Protected Routes**: Role-based access control

### 🗄️ Database Integration
- **MongoDB Integration**: Full database connectivity for content management
- **Dynamic Content**: Real-time data fetching and updates
- **Blog Management**: Complete blog post lifecycle management

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Next.js 15** - Full-stack React framework with App Router
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
- **Vercel** - Production deployment platform

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB instance (local or cloud)
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
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
   ```

4. **Initialize Database**
   ```bash
   npm run init-db
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── _components/              # Reusable React components
│   │   ├── about.tsx            # About section component
│   │   ├── blogsComponent.tsx   # Blog listing component
│   │   ├── dotbackground.tsx    # Animated background
│   │   ├── footer.tsx           # Site footer
│   │   ├── header.tsx           # Navigation header
│   │   ├── projects.tsx         # Project showcase
│   │   ├── technology.tsx       # Tech stack display
│   │   └── timeline.tsx         # Career timeline
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── blogs/              # Blog CRUD operations
│   │   ├── github-repos/       # GitHub integration
│   │   └── timeline/           # Timeline data
│   ├── blogs/                   # Blog pages
│   └── register/               # User registration
├── context/                     # React Context providers
├── models/                      # TypeScript type definitions
├── styles/                      # SCSS modules
└── utils/                       # Utility functions
```

## 🐳 Docker Deployment

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

## 🔧 Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run init-db      # Initialize database
```

## 🌐 API Endpoints

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
- `GET /api/timeline` - Career timeline data
- `GET /api/tech` - Technology stack information
- `GET /api/github-repos` - GitHub repository data

## 🎯 Key Features Deep Dive

### Interactive Background Animation
The dot background uses HTML5 Canvas to create a responsive particle system that reacts to mouse movement, providing an engaging visual experience.

### Blog System
Full-featured blog with:
- Markdown support
- Slug-based routing
- SEO optimization
- Draft/publish workflow
- Scheduled publishing

### Technology Showcase
Dynamic visualization of skills and technologies with:
- Animated progress bars
- Technology logos
- Experience levels
- Project associations

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Configured for production
- **Input Validation**: Server-side validation for all inputs
- **XSS Protection**: Sanitized content rendering

## 📱 Responsive Design

- Mobile-first approach
- Optimized for tablets and desktops
- Touch-friendly interactions
- Adaptive layouts

## 🚀 Performance Optimizations

- **Next.js App Router**: Latest routing system
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Static Generation**: Pre-built pages where possible
- **Turbopack**: Ultra-fast development builds

## 📈 Monitoring & Analytics

- Built-in performance monitoring
- Error boundary implementation
- SEO optimized meta tags
- Structured data for search engines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Erick Tran** - [enVId Tech](https://github.com/envidtech)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- React team for the powerful library
- MongoDB for robust database solutions
- Vercel for seamless deployment

---

⭐ **Star this repository if you found it helpful!**