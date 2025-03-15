'use client';
import React, { useState, useEffect } from 'react';
import styles from '@/styles/blogs.module.scss';
import Link from 'next/link';
import { IoArrowForward, IoCalendarOutline, IoTimeOutline } from 'react-icons/io5';
import Image from 'next/image';
import {M_400, M_600} from "@/utils/globalFonts";

// Interface for blog post data
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  date: string;
  readTime: string;
  tags: string[];
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>('all');
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const mockBlogs: BlogPost[] = [
          {
            id: '1',
            title: 'Building Interactive UIs with React and Three.js',
            slug: 'building-interactive-uis-with-react-and-threejs',
            excerpt: 'Learn how to combine React with Three.js to create immersive 3D user interfaces for your web applications.',
            coverImage: '/blog/threejs-react.webp',
            date: '2023-11-15',
            readTime: '8 min',
            tags: ['react', 'threejs', 'web-development']
          },
          {
            id: '2',
            title: 'Optimizing Performance in Next.js Applications',
            slug: 'optimizing-performance-nextjs-applications',
            excerpt: 'Discover techniques to improve loading times and user experience in your Next.js projects.',
            coverImage: '/blog/nextjs-performance.webp',
            date: '2023-12-02',
            readTime: '6 min',
            tags: ['nextjs', 'performance', 'web-development']
          }
        ];

        setBlogs(mockBlogs);

        // Extract all unique tags
        const tags = ['all', ...new Set(mockBlogs.flatMap(blog => blog.tags))];
        setAllTags(tags);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs by tag
  const filteredBlogs = activeTag === 'all'
    ? blogs
    : blogs.filter(blog => blog.tags.includes(activeTag));

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className={styles.container} id={"blogs"}>
      <h2 className={`${styles.blogsTitle} ${M_600}`}>Latest Blogs</h2>

      {/* Filter tags */}
      <div className={styles.filterContainer}>
        {allTags.map(tag => (
          <button
            key={tag}
            className={`${styles.filterButton} ${activeTag === tag ? styles.active : ''}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading blogs...</div>
      ) : (
        <div className={styles.blogsGrid}>
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map(blog => (
              <article key={blog.id} className={styles.blogCard}>
                <Link href={`/blog/${blog.slug}`} className={styles.blogLink}>
                  <div className={styles.blogImageContainer}>
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      className={styles.blogImage}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={false}
                    />
                  </div>

                  <div className={styles.blogContent}>
                    <div className={styles.blogMeta}>
                      <span className={`${styles.blogDate} ${M_400}`}>
                        <IoCalendarOutline />
                        {formatDate(blog.date)}
                      </span>
                      <span className={`${styles.blogReadTime} ${M_400}`}>
                        <IoTimeOutline />
                        {blog.readTime}
                      </span>
                    </div>

                    <h3 className={`${styles.blogTitle} ${M_600}`}>{blog.title}</h3>
                    <p className={`${styles.blogExcerpt} ${M_400}`}>{blog.excerpt}</p>

                    <div className={styles.tagList}>
                      {blog.tags.map(tag => (
                        <span key={tag} className={`${styles.tag} ${M_400}`}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className={`${styles.readMore} ${M_400}`}>
                      Read More <IoArrowForward />
                    </div>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <p className={styles.noResults}>No blog posts found for this tag.</p>
          )}
        </div>
      )}
    </section>
  );
}