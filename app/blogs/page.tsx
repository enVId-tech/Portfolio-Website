import { Metadata } from 'next';
import BlogClientPage from './page.client.js';

export const metadata: Metadata = {
  title: 'Blog - Erick Tran',
  description: 'Read Erick Tran\'s latest insights, tutorials, and updates on full stack development, React, Next.js, Node.js, and modern web technologies.',
  keywords: [
    'Blog',
    'Full Stack Development',
    'React Tutorials',
    'Next.js Guides',
    'Node.js Tips',
    'TypeScript',
    'Web Development Blog',
    'Programming Tutorials',
    'Software Engineering',
    'Erick Tran Blog'
  ],
  openGraph: {
    title: 'Blog - Erick Tran | Full Stack Development Insights',
    description: 'Read Erick Tran\'s latest insights, tutorials, and updates on full stack development, React, Next.js, Node.js, and modern web technologies.',
    url: 'https://etran.dev/blogs',
    type: 'website',
  },
  alternates: {
    canonical: '/blogs',
  },
};

export default function BlogPage() {
  // This is a server component that renders the client component
  return <BlogClientPage />;
}