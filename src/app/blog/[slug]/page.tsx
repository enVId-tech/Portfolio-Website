"use client";
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import styles from '@/styles/blogpost.module.scss';
import { M_400, M_600 } from "@/utils/globalFonts";
import { useAuth } from "@/context/AuthContext";
import DotBackground from "@/app/_components/dotbackground";
import { formatISO } from 'date-fns';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
    coverImage?: string;
    tags: string[];
    publishStatus: 'published' | 'private' | 'unlisted';
    scheduledPublish?: string;
}

export default function BlogPost() {
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'error'>('idle');


    const { slug } = useParams();
    const { isAdmin } = useAuth();

    const [post, setPost] = useState<BlogPost | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPost, setEditedPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    useEffect(() => {
        const fetchBlogPost = async () => {
            if (slug && typeof slug === 'string') {
                try {
                    const response = await fetch(`/api/blogs/${slug}`);
                    const data = await response.json();

                    if (data.success) {
                        setPost(data.blog);
                    } else {
                        setPost({
                            id: slug,
                            title: 'Blog Post Not Found',
                            content: '<p>The requested blog post could not be found.</p>',
                            date: new Date().toISOString(),
                            author: 'System',
                            tags: ['Error'],
                            publishStatus: 'private',
                        });
                    }
                } catch (error) {
                    console.error('Error fetching blog post:', error);
                    setPost({
                        id: slug,
                        title: 'Blog Post Not Found',
                        content: '<p>The requested blog post could not be found.</p>',
                        date: new Date().toISOString(),
                        author: 'System',
                        tags: ['Error'],
                        publishStatus: 'private',
                    });
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchBlogPost();
    }, [slug]);

    const handleAdminClick = () => {
        if (isAdmin()) {
            setIsEditing(true);
            setEditedPost({
                ...post,
                id: post?.id || '',
                title: post?.title || '',
                content: post?.content || '',
                date: post?.date || '',
                author: post?.author || '',
                coverImage: post?.coverImage || '',
                tags: post?.tags || [],
                publishStatus: post?.publishStatus || 'published',
                scheduledPublish: post?.scheduledPublish || ''
            });
        } else {
            alert("You need admin privileges to edit posts");
        }
    };

    const handleDelete = async () => {
        if (deleteConfirmation !== post?.title) {
            alert("The title doesn't match. Please try again.");
            return;
        }

        setDeleteStatus('deleting');

        try {
            const response = await fetch(`/api/blogs/${post?.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                router.push('/blog');
            } else {
                setDeleteStatus('error');
                console.error('Error deleting post:', data.error);
            }
        } catch (error) {
            setDeleteStatus('error');
            console.error('Error deleting post:', error);
        }
    };

    const handleSave = async () => {
        if (isAdmin() && editedPost) {
            setSaveStatus('saving');

            try {
                const response = await fetch(`/api/blogs/${editedPost.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editedPost),
                });

                const data = await response.json();

                if (data.success) {
                    setSaveStatus('success');
                    setPost(editedPost);
                    setIsEditing(false);

                    // Reset status after 3 seconds
                    setTimeout(() => {
                        setSaveStatus('idle');
                    }, 3000);
                } else {
                    setSaveStatus('error');
                    console.error('Error saving post:', data.error);
                }
            } catch (error) {
                setSaveStatus('error');
                console.error('Error saving post:', error);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (editedPost) {
            setEditedPost({
                ...editedPost,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleTagChange = (tags: string[]) => {
        if (editedPost) {
            setEditedPost({
                ...editedPost,
                tags
            });
        }
    };

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
                    <div key={tag} className={styles.tagItem}>
                        {tag}
                        <span
                            className={styles.removeTag}
                            onClick={() => removeTag(tag)}
                        >
              ×
            </span>
                    </div>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add tag..."
                />
            </div>
        );
    };

    if (loading) {
        return (
            <DotBackground config={{
                spacingBetweenDots: 40,
                dotSize: 1.2,
                dotColor: 'rgb(200, 200, 255)',
                dotOpacity: 0.3,
                maxDistance: 150,
                friction: 0.8,
            }}>
                <div className={styles.loading}>Loading...</div>
            </DotBackground>
        );
    }

    return (
        <DotBackground config={{
            spacingBetweenDots: 40,
            dotSize: 1.2,
            dotColor: 'rgb(200, 200, 255)',
            dotOpacity: 0.3,
            maxDistance: 150,
            friction: 0.8,
        }}>
            <main className={styles.blogPostContainer}>
                <Link href="/blog" className={`${styles.backButton} ${M_600}`}>
                    &larr; Back to Blog
                </Link>

                {!isEditing && post && (
                    <>
                        {post.coverImage && (
                            <div className={styles.coverImage}>
                                <img src={post.coverImage} alt={post.title} />
                            </div>
                        )}

                        <article className={styles.blogPost}>
                            <header>
                                <h1>{post.title}</h1>
                                <div className={styles.meta}>
                  <span className={styles.date}>
                    {new Date(post.date || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                  </span>
                                    <span className={styles.author}>By {post.author}</span>
                                </div>
                                <div className={styles.tags}>
                                    {post.tags.map(tag => (
                                        <span key={tag} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            </header>

                            <div
                                className={styles.content}
                                dangerouslySetInnerHTML={{ __html: post.content || '' }}
                            />
                        </article>
                    </>
                )}

                {isEditing && editedPost && (
                    <div className={`${styles.editorContainer} ${M_400}`}>
                        <h2>Edit Blog Post</h2>

                        <div className={styles.editorField}>
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={editedPost.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.editorField}>
                            <label htmlFor="date">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={new Date(editedPost.date || '').toISOString().split('T')[0]}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.editorField}>
                            <label htmlFor="author">Author</label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={editedPost.author}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.editorField}>
                            <label htmlFor="coverImage">Cover Image URL</label>
                            <input
                                type="url"
                                id="coverImage"
                                name="coverImage"
                                value={editedPost.coverImage || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.editorField}>
                            <label htmlFor="tags">Tags</label>
                            <TagsInput
                                tags={editedPost.tags}
                                onChange={handleTagChange}
                            />
                        </div>

                        <div className={styles.editorField}>
                            <label htmlFor="content">Content (HTML)</label>
                            <textarea
                                id="content"
                                name="content"
                                value={editedPost.content}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.editorField}>
                            <label htmlFor="publishStatus">Publish Status</label>
                            <select
                                id="publishStatus"
                                name="publishStatus"
                                value={editedPost.publishStatus}
                                onChange={handleChange}
                            >
                                <option value="published">Published</option>
                                <option value="private">Private (Only admins)</option>
                                <option value="unlisted">Unlisted (Only with link)</option>
                            </select>
                        </div>

                        <div className={styles.editorField}>
                            <label htmlFor="scheduledPublish">
                                Schedule Publish (Leave empty for immediate publish)
                            </label>
                            <input
                                type="datetime-local"
                                id="scheduledPublish"
                                name="scheduledPublish"
                                value={editedPost.scheduledPublish ? new Date(editedPost.scheduledPublish).toISOString().slice(0, -8) : ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value) {
                                        setEditedPost({
                                            ...editedPost,
                                            scheduledPublish: formatISO(new Date(value)),
                                            publishStatus: 'private' // Set to private until scheduled time
                                        });
                                    } else {
                                        setEditedPost({
                                            ...editedPost,
                                            scheduledPublish: ''
                                        });
                                    }
                                }}
                            />
                        </div>

                        <div className={styles.editorControls}>
                            {saveStatus === 'success' && (
                                <span className={`${styles.statusMessage} ${styles.success}`}>
                  Post saved successfully!
                </span>
                            )}

                            {saveStatus === 'error' && (
                                <span className={`${styles.statusMessage} ${styles.error}`}>
                  Error saving post
                </span>
                            )}

                            {saveStatus === 'saving' && (
                                <span className={`${styles.statusMessage} ${styles.saving}`}>
                  Saving...
                </span>
                            )}

                            <button
                                className={styles.cancelButton}
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className={styles.saveButton}
                                onClick={handleSave}
                                disabled={saveStatus === 'saving'}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {isAdmin() && !isEditing && (
                    <>
                        <button
                            className={styles.editButton}
                            onClick={handleAdminClick}
                            aria-label="Edit post"
                        >
                            ✏️
                        </button>
                        <button
                            className={`${styles.editButton} ${styles.deleteButton}`}
                            onClick={() => setShowDeleteModal(true)}
                            aria-label="Delete post"
                        >
                            🗑️
                        </button>
                    </>
                )}

                {showDeleteModal && (
                    <div className={styles.deleteModal}>
                        <div className={styles.deleteModalContent}>
                            <h3>Delete Blog Post</h3>
                            <p>This action cannot be undone. Please type <strong>&#34;{post?.title}&#34;</strong> to confirm.</p>

                            <div className={styles.deleteConfirmField}>
                                <input
                                    type="text"
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    placeholder="Type blog title to confirm"
                                />
                            </div>

                            <div className={styles.deleteModalButtons}>
                                <button
                                    className={styles.cancelDeleteButton}
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteConfirmation('');
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmDeleteButton}
                                    onClick={handleDelete}
                                    disabled={deleteStatus === 'deleting' || deleteConfirmation !== post?.title}
                                >
                                    {deleteStatus === 'deleting' ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>

                            {deleteStatus === 'error' && (
                                <p className={styles.deleteError}>Failed to delete post. Please try again.</p>
                            )}
                        </div>
                    </div>
                    )}
                )
            </main>
        </DotBackground>
    );
}