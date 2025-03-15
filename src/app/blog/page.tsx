// src/app/blog/page.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/blog.module.scss';
import backgroundStyles from '@/styles/dotbackground.module.scss';
import DotBackground from "@/app/_components/dotbackground";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    coverImage?: string;
    tags: string[];
}

// Get data from a database API call later
const blogPosts: BlogPost[] = [
    {
        id: 'getting-started-with-nextjs',
        title: 'Getting Started with Next.js',
        excerpt: 'Learn how to build modern web applications with Next.js',
        date: '2023-07-15',
        author: 'John Doe',
        coverImage: '/images/blog/nextjs-cover.jpg',
        tags: ['Next.js', 'React', 'Web Development']
    },
    {
        id: 'mastering-scss',
        title: 'Mastering SCSS for Modern Web Design',
        excerpt: 'Dive into advanced SCSS techniques to enhance your styling workflow',
        date: '2023-08-22',
        author: 'Jane Smith',
        coverImage: '/images/blog/scss-cover.jpg',
        tags: ['SCSS', 'CSS', 'Design']
    },
];

export default function Blog() {
    const [filteredTag, setFilteredTag] = useState<string | null>(null);

    const allTags = [...new Set(blogPosts.flatMap(post => post.tags))];
    const filteredPosts = filteredTag
        ? blogPosts.filter(post => post.tags.includes(filteredTag))
        : blogPosts;

    return (
        <DotBackground config={{
            spacingBetweenDots: 40,
            dotSize: 1.2,
            dotColor: 'rgb(200, 200, 255)',
            dotOpacity: 0.3,
            maxDistance: 150,
            friction: 0.8, // WARNING: Do NOT use values greater than 0.8.
        }}>
        <div className={backgroundStyles.container}>
            <canvas className={backgroundStyles.canvas} id="dotCanvas"></canvas>

            <div className={backgroundStyles.content}>
                <main className={styles.blogContainer}>
                    <section className={styles.blogHeader}>
                        <h1>Our Blog</h1>
                        <p>Insights, tutorials, and updates from our team</p>
                    </section>

                    <section className={styles.tagFilter}>
                        <button
                            className={`${styles.tagButton} ${filteredTag === null ? styles.active : ''}`}
                            onClick={() => setFilteredTag(null)}
                        >
                            All
                        </button>
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                className={`${styles.tagButton} ${filteredTag === tag ? styles.active : ''}`}
                                onClick={() => setFilteredTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </section>

                    <section className={styles.blogGrid}>
                        {filteredPosts.map(post => (
                            <article key={post.id} className={styles.blogCard}>
                                {post.coverImage && (
                                    <div className={styles.imageContainer}>
                                        <img src={post.coverImage} alt={post.title} />
                                    </div>
                                )}
                                <div className={styles.blogContent}>
                                    <div className={styles.meta}>
                                        <span className={styles.date}>{new Date(post.date).toLocaleDateString()}</span>
                                        <span className={styles.author}>{post.author}</span>
                                    </div>
                                    <h2>{post.title}</h2>
                                    <p>{post.excerpt}</p>
                                    <div className={styles.tags}>
                                        {post.tags.map(tag => (
                                            <span key={tag} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>
                                    <Link href={`/blog/${post.id}`} className={styles.readMore}>
                                        Read More
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </section>
                </main>
            </div>
        </div>
        </DotBackground>
    );
}