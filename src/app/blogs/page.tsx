import { Metadata } from 'next';
import BlogClientPage from './page.client.tsx';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest insights, tutorials, and updates',
  openGraph: {
    title: 'Blog | Your Site Name',
    description: 'Read our latest insights, tutorials, and updates',
  }
};

export default function BlogPage() {
  // This is a server component that renders the client component
  return <BlogClientPage />;
}