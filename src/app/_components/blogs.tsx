'use client';
import React, { useState } from 'react';
import styles from '@/styles/blogs.module.scss';
import Link from 'next/link';
import { IoArrowForward, IoCalendarOutline, IoTimeOutline } from 'react-icons/io5';
import Image from 'next/image';
import {M_400, M_600} from "@/utils/globalFonts";
import { BlogInterface } from "@/models/Blog";

interface BlogsProps {
  blogPosts?: BlogInterface[];
}

export default function Blogs({ blogPosts = [] }: BlogsProps) {
  const [activeTag, setActiveTag] = useState<string>('all');

  // Extract all unique tags from provided blogs
  const allTags = ['all', ...new Set(blogPosts.flatMap(blog => blog.tags || []))];

  // Filter blogs by tag
  const filteredBlogs = activeTag === 'all'
      ? blogPosts
      : blogPosts.filter(blog => blog.tags?.includes(activeTag));

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
        {blogPosts.length > 0 && (
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
        )}

        {blogPosts.length > 0 ? (
            <div className={styles.blogsGrid}>
              {filteredBlogs.length > 0 ? (
                  filteredBlogs.map(blog => (
                      <article key={blog.id} className={styles.blogCard}>
                        <Link href={`/blog/${blog.id}`} className={styles.blogLink}>
                          <div className={styles.blogImageContainer}>
                            {blog.coverImage && (
                                <Image
                                    src={blog.coverImage}
                                    alt={blog.title}
                                    className={styles.blogImage}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority={false}
                                />
                            )}
                          </div>

                          <div className={styles.blogContent}>
                            <div className={styles.blogMeta}>
                      <span className={`${styles.blogDate} ${M_400}`}>
                        <IoCalendarOutline />
                        {formatDate(blog.date)}
                      </span>
                              <span className={`${styles.blogReadTime} ${M_400}`}>
                        <IoTimeOutline />
                                {blog.date ? '5 min' : ''}
                      </span>
                            </div>

                            <h3 className={`${styles.blogTitle} ${M_600}`}>{blog.title}</h3>
                            <p className={`${styles.blogExcerpt} ${M_400}`}>{blog.excerpt}</p>

                            <div className={styles.tagList}>
                              {blog.tags?.map(tag => (
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
        ) : (
            <div className={styles.noBlogsMessage}>
              <p>No blog posts available at the moment. Check back soon!</p>
            </div>
        )}
      </section>
  );
}