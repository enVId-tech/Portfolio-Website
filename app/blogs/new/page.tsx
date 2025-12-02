"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/blogpost.module.scss';
import { M_400, M_600 } from "@/utils/globalFonts";
import { useAuth } from "@/context/AuthContext";
import DotBackground from "@/_components/dotbackground";
import {nanoid} from "nanoid";

export default function NewBlogPost() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const [post, setPost] = useState({
    id: nanoid(10),
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    author: '',
    coverImage: '',
    tags: [] as string[],
    excerpt: '',
    publishStatus: 'published' as 'published' | 'private' | 'unlisted',
    scheduledPublish: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'published' && e.target.type === 'checkbox') {
      setPost({
        ...post,
        publishStatus: (e.target as HTMLInputElement).checked ? 'published' : 'private'
      });
    } else {
      setPost({
        ...post,
        [name]: value
      });
    }
  };

  const handleTagChange = (tags: string[]) => {
    setPost({
      ...post,
      tags
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin()) {
      alert("You need admin privileges to create posts");
      return;
    }

    setSaveStatus('saving');

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus('success');

        setTimeout(() => {
          router.push(`/blog/${data.blog.id}`);
        }, 1000);
      } else {
        setSaveStatus('error');
        console.error('Error creating post:', data.error);
      }
    } catch (error) {
      setSaveStatus('error');
      console.error('Error creating post:', error);
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

  if (!isAdmin()) {
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
          <div className={styles.blogPost}>
            <h1>Unauthorized</h1>
            <p>You need to be logged in as an admin to create new blog posts.</p>
          </div>
        </main>
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

        <form onSubmit={handleSubmit} className={`${styles.editorContainer} ${M_400}`}>
          <h2>Create New Blog Post</h2>

          <div className={styles.editorField}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={post.title}
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
              value={post.date}
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
              value={post.author}
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
              value={post.coverImage}
              onChange={handleChange}
            />
          </div>

          <div className={styles.editorField}>
            <label htmlFor="tags">Tags</label>
            <TagsInput
              tags={post.tags}
              onChange={handleTagChange}
            />
          </div>

          <div className={styles.editorField}>
            <label htmlFor="content">Content (HTML)</label>
            <textarea
              id="content"
              name="content"
              value={post.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.editorField}>
            <div className={styles.checkboxField}>
              <input
                type="checkbox"
                id="published"
                name="published"
                onChange={handleChange}
              />
              <label htmlFor="published">Publish immediately</label>
            </div>
          </div>

          <div className={styles.editorField}>
            <label htmlFor="publishStatus">Publish Status</label>
            <select
                id="publishStatus"
                name="publishStatus"
                value={post.publishStatus}
                onChange={handleChange}
            >
              <option value="published">Published</option>
              <option value="private">Private (Only admins)</option>
              <option value="unlisted">Unlisted (Only with link)</option>
            </select>
          </div>


          <div className={styles.editorField}>
            <label htmlFor="scheduledPublish">
              Schedule Publish Date
            </label>
            <div className={styles.schedulingOptions}>
              <div className={styles.radioOption}>
                <input
                    type="radio"
                    id="publishNow"
                    name="publishType"
                    checked={!post.scheduledPublish}
                    onChange={() => {
                      setPost({
                        ...post,
                        scheduledPublish: '',
                        publishStatus: 'published'
                      });
                    }}
                />
                <label htmlFor="publishNow">Publish immediately</label>
              </div>

              <div className={styles.radioOption}>
                <input
                    type="radio"
                    id="schedulePublish"
                    name="publishType"
                    checked={!!post.scheduledPublish}
                    onChange={() => {
                      // Set default scheduled time to tomorrow
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      tomorrow.setMinutes(0);

                      setPost({
                        ...post,
                        scheduledPublish: tomorrow.toISOString().substring(0, 16),
                        publishStatus: 'private'
                      });
                    }}
                />
                <label htmlFor="schedulePublish">Schedule for later</label>
              </div>
            </div>

            {post.scheduledPublish && (
                <div className={styles.dateTimeSelector}>
                  <input
                      type="datetime-local"
                      id="scheduledPublish"
                      name="scheduledPublish"
                      value={post.scheduledPublish.substring(0, 16)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPost({
                          ...post,
                          scheduledPublish: value,
                          publishStatus: 'private'
                        });
                      }}
                  />
                  <div className={styles.scheduledInfo}>
                    This post will be published on: {new Date(post.scheduledPublish).toLocaleString()}
                  </div>
                </div>
            )}
          </div>

          <div className={styles.editorControls}>
            {saveStatus === 'success' && (
              <span className={`${styles.statusMessage} ${styles.success}`}>
                Post created successfully!
              </span>
            )}

            {saveStatus === 'error' && (
              <span className={`${styles.statusMessage} ${styles.error}`}>
                Error creating post
              </span>
            )}

            {saveStatus === 'saving' && (
              <span className={`${styles.statusMessage} ${styles.saving}`}>
                Creating...
              </span>
            )}

            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.push('/blog')}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={saveStatus === 'saving'}
            >
              Create Post
            </button>
          </div>
        </form>
      </main>
    </DotBackground>
  );
}