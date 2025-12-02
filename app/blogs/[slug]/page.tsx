import { Metadata } from 'next';
import BlogPostClientPage from './page.client.tsx';

// This generates dynamic metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    // Fetch data for this specific blog
    try {
        const { slug } = await params;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blogs/${slug}`);

        if (!response.ok) {
            return {
                title: 'Blog Post Not Found',
                description: 'The requested blog post could not be found'
            };
        }

        const data = await response.json();
        const blog = data.blog;

        return {
            title: blog.title,
            description: blog.excerpt || `Read ${blog.title} by ${blog.author}`,
            openGraph: {
                title: blog.title,
                description: blog.excerpt || `Read ${blog.title} by ${blog.author}`,
                images: blog.coverImage ? [blog.coverImage] : [],
                type: 'article',
                authors: [blog.author],
                publishedTime: blog.date,
                tags: blog.tags,
            },
            twitter: {
                card: 'summary_large_image',
                title: blog.title,
                description: blog.excerpt || `Read ${blog.title} by ${blog.author}`,
                images: blog.coverImage ? [blog.coverImage] : [],
            }
        };
    } catch (error) {
        console.error('Error fetching blog post for metadata:', error);
        return {
            title: 'Blog Post',
            description: 'Read our latest blog post'
        };
    }
}

// Server component that passes data to client component
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    return <BlogPostClientPage slug={slug} />;
}