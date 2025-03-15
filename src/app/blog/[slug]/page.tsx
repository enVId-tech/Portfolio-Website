"use client";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '@/styles/blogpost.module.scss';
import backgroundStyles from '@/styles/dotbackground.module.scss';
import {M_400, M_600} from "@/utils/globalFonts";

// TEMPORARY: Use something else later
const isAdmin = () => {
    return localStorage.getItem('admin_token') === 'your-secret-admin-token';
};

const adminLogin = () => {
    const password = prompt("Enter admin password:");

    if (password === "your-secret-password") {
        localStorage.setItem('admin_token', 'your-secret-admin-token');
        return true;
    }
    return false;
};

const blogPosts = {
    'getting-started-with-nextjs': {
        id: 'getting-started-with-nextjs',
        title: 'Getting Started with Next.js',
        content: `
      <p>This is a sample blog post content about Next.js.</p>
      <h2>Why Next.js?</h2>
      <p>Next.js provides an excellent developer experience with features like server-side rendering and static site generation.</p>
      <h3>Key Features</h3>
      <p>Some key features include file-based routing, API routes, and built-in CSS support.</p>
    `,
        date: '2023-09-01',
        author: 'Your Name',
        coverImage: '/images/blog/nextjs-cover.jpg',
        tags: ['Next.js', 'React', 'Web Development']
    },
    'mastering-scss': {
        id: 'mastering-scss',
        title: 'Mastering SCSS for Modern Web Design',
        content: `
      <p>SCSS is a powerful CSS preprocessor that enhances your styling workflow.</p>
      <h2>Variables and Mixins</h2>
      <p>Learn how to use variables and mixins to make your CSS more maintainable.</p>
      <h3>Nesting</h3>
      <p>SCSS allows you to nest your CSS selectors in a way that follows your HTML hierarchy.</p>
    `,
        date: '2023-08-22',
        author: 'Your Name',
        coverImage: '/images/blog/scss-cover.jpg',
        tags: ['SCSS', 'CSS', 'Design']
    }
};

const getBlogPost = (slug: string) => {
    return blogPosts[slug as keyof typeof blogPosts] || {
        id: slug,
        title: 'Blog Post Not Found',
        content: '<p>The requested blog post could not be found.</p>',
        date: new Date().toISOString(),
        author: 'System',
        tags: ['Error']
    };
};

const saveBlogPost = (post: unknown) => {
    blogPosts[post.id as keyof typeof blogPosts] = post;
    return true;
};

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState<unknown>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPost, setEditedPost] = useState<unknown>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(localStorage.getItem('admin_token') === 'your-secret-admin-token');
    }, []);

    useEffect(() => {
        if (slug && typeof slug === 'string') {
            const loadedPost = getBlogPost(slug);
            setPost(loadedPost);
        }
    }, [slug]);

    const handleAdminClick = () => {
        if (isAdmin) {
            setIsEditing(true);
            setEditedPost({...post});
        } else {
            if (adminLogin()) {
                setIsAdmin(true);
                setIsEditing(true);
                setEditedPost({...post});
            }
        }
    };

    // Save changes
    const handleSave = () => {
        saveBlogPost(editedPost);
        setPost(editedPost);
        setIsEditing(false);
    };

    // Update form fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditedPost({
            ...editedPost,
            [e.target.name]: e.target.value
        });
    };

    // Handle tag input
    const handleTagChange = (tags: string[]) => {
        setEditedPost({
            ...editedPost,
            tags
        });
    };

    // Tags component
    const TagsInput = ({ tags, onChange }: { tags: string[], onChange: (tags: string[]) => void }) => {
        const [inputValue, setInputValue] = useState('');

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const newTag = inputValue.trim();
                if (newTag && !tags.includes(newTag)) {
                    onChange([...tags, newTag]);
                }
                setInputValue('');
            }
        };

        const removeTag = (tagToRemove: string) => {
            onChange(tags.filter(tag => tag !== tagToRemove));
        };

        return (
            <div className={styles.tagsInput}>
                {tags.map(tag => (
                    <span key={tag} className={styles.tagItem}>
            {tag}
                        <span className={styles.removeTag} onClick={() => removeTag(tag)}>×</span>
          </span>
                ))}
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add tag and press Enter"
                />
            </div>
        );
    };

    // Handle initial render or fallback
    if (!post) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={backgroundStyles.container}>
            <canvas className={backgroundStyles.canvas} id="dotCanvas"></canvas>

            <div className={backgroundStyles.content}>
                <main className={styles.blogPostContainer}>
                    <Link href="/blog" className={`${styles.backButton} ${M_600}`}>
                        &larr; Back to Blog
                    </Link>

                    {!isEditing && (
                        <>
                            {post.coverImage && (
                                <div className={styles.coverImage}>
                                    <img src={post.coverImage} alt={post.title} className={`${styles.coverImage} ${M_400}`} />
                                </div>
                            )}

                            <article className={styles.blogPost}>
                                <header>
                                    <h1 className={`${styles.title} ${M_600}`}>{post.title}</h1>
                                    <div className={styles.meta}>
                    <span className={`${styles.date} ${M_400}`}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                      })}
                    </span>
                                        <span className={`${styles.author} ${M_400}`}>By {post.author}</span>
                                    </div>
                                    <div className={styles.tags}>
                                        {post.tags.map((tag: string) => (
                                            <span key={tag} className={`${styles.tag} ${M_400}`}>{tag}</span>
                                        ))}
                                    </div>
                                </header>

                                <div
                                    className={`${styles.content} ${M_400}`}
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />

                                <footer className={`${styles.postFooter} ${M_400}`}>
                                    <div className={styles.share}>
                                        <h3>Share this post</h3>
                                        <div className={styles.socialButtons}>
                                            <button aria-label="Share on Twitter">Twitter</button>
                                            <button aria-label="Share on Facebook">Facebook</button>
                                            <button aria-label="Share on LinkedIn">LinkedIn</button>
                                        </div>
                                    </div>
                                </footer>
                            </article>
                        </>
                    )}

                    {isEditing && (
                        <div className={`${styles.editorContainer} ${M_400}`}>
                            <h2>Edit Blog Post</h2>

                            <div className={styles.editorField}>
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={editedPost.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.editorField}>
                                <label htmlFor="author">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    id="author"
                                    value={editedPost.author}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.editorField}>
                                <label htmlFor="date">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    value={new Date(editedPost.date).toISOString().split('T')[0]}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.editorField}>
                                <label htmlFor="coverImage">Cover Image URL</label>
                                <input
                                    type="text"
                                    name="coverImage"
                                    id="coverImage"
                                    value={editedPost.coverImage || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.editorField}>
                                <label>Tags</label>
                                <TagsInput
                                    tags={editedPost.tags}
                                    onChange={handleTagChange}
                                />
                            </div>

                            <div className={styles.editorField}>
                                <label htmlFor="content">Content (HTML)</label>
                                <textarea
                                    name="content"
                                    id="content"
                                    value={editedPost.content}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={`${styles.editorControls} ${M_400}`}>
                                <button className={styles.saveButton} onClick={handleSave}>
                                    Save Changes
                                </button>
                                <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Edit button (only visible to admin) */}
                    <button
                        className={styles.editButton}
                        onClick={handleAdminClick}
                        style={{ display: isEditing ? 'none' : 'flex' }}
                    >
                        ✎
                    </button>
                </main>
            </div>
        </div>
    );
}