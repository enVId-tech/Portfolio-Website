"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/styles/blog.module.scss';
import DotBackground from "@/app/_components/dotbackground";
import { useAuth } from "@/context/AuthContext";
import { M_600 } from "@/utils/globalFonts";
import { BlogInterface } from '@/models/Blog';
import { IoArrowBack, IoHome } from 'react-icons/io5'; // Added icon imports

export default function Blog() {
    const router = useRouter();
    const { user, login, logout, isAdmin } = useAuth();
    const [filteredTag, setFilteredTag] = useState<string | null>(null);
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [blogPosts, setBlogPosts] = useState<BlogInterface[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                let url = filteredTag
                    ? `/api/blogs?tag=${encodeURIComponent(filteredTag)}`
                    : '/api/blogs';

                if (isAdmin()) {
                    url += `${url.includes('?') ? '&' : '?'}includePrivate=true`;
                }

                const response = await fetch(url, {
                    // Add cache busting to ensure fresh data
                    headers: { 'Cache-Control': 'no-cache' }
                });
                const data = await response.json();

                if (data.success) {
                    setBlogPosts(data.blogs);
                }
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
            }
        };

        fetchBlogs();
    }, [filteredTag, isAdmin]);

    useEffect(() => {
        const checkScheduledPosts = async () => {
            try {
                const response = await fetch('/api/cron/publish-scheduled');
                const data = await response.json();

                // If posts were published, refresh the blog list
                if (data.success && data.updatedCount > 0) {
                    console.log(`${data.updatedCount} posts were published, refreshing blog list`);
                    fetchBlogs();
                }
            } catch (error) {
                console.error('Failed to check scheduled posts:', error);
            }
        };

        const fetchBlogs = async () => {
            try {
                let url = filteredTag
                    ? `/api/blogs?tag=${encodeURIComponent(filteredTag)}`
                    : '/api/blogs';

                if (isAdmin()) {
                    url += `${url.includes('?') ? '&' : '?'}includePrivate=true`;
                }

                const response = await fetch(url, {
                    headers: { 'Cache-Control': 'no-cache' }
                });
                const data = await response.json();

                if (data.success) {
                    setBlogPosts(data.blogs);
                }
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
            }
        };

        // Check every 10 seconds
        const interval = setInterval(checkScheduledPosts, 10000);

        return () => clearInterval(interval);
    }, [filteredTag, isAdmin]);

    const allTags = [...new Set(blogPosts.flatMap(post => post.tags))];
    const filteredPosts = filteredTag
        ? blogPosts.filter(post => post.tags.includes(filteredTag))
        : blogPosts;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        const success = await login(username, password);

        if (success) {
            setShowLogin(false);
            setUsername('');
            setPassword('');
        } else {
            setLoginError('Invalid username or password');
        }
    };

    const handleLogout = () => {
        logout();
    };

    const navigateToHome = () => {
        router.push('/');
    };

    return (
        <DotBackground config={{
            spacingBetweenDots: 40,
            dotSize: 1.2,
            dotColor: 'rgb(200, 200, 255)',
            dotOpacity: 0.3,
            maxDistance: 150,
            friction: 0.8,
        }}>
            <main className={`${styles.blogContainer} ${M_600}`}>
                {/* Top navigation button */}
                <div className={styles.topNavigation}>
                    <button
                        className={`${styles.homeButton} ${M_600}`}
                        onClick={navigateToHome}
                        aria-label="Return to home page"
                    >
                        <IoArrowBack /> Back to Home
                    </button>
                </div>

                <section className={styles.blogHeader}>
                    <h1>Blog</h1>
                    <p>Insights, tutorials, and updates from me!</p>
                </section>

                <div className={styles.topControls}>
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

                    <div className={styles.authSection}>
                        {user ? (
                            <div className={styles.loggedInActions}>
                                {isAdmin() && (
                                    <button
                                        className={styles.newPostButton}
                                        onClick={() => router.push('/blog/new')}
                                    >
                                        <span className={styles.plusIcon}>+</span> New Post
                                    </button>
                                )}
                                <button
                                    className={styles.logoutButton}
                                    onClick={handleLogout}
                                >
                                    Logout ({user.username})
                                </button>
                            </div>
                        ) : (
                            <button
                                className={styles.loginButton}
                                onClick={() => setShowLogin(!showLogin)}
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>

                {showLogin && !user && (
                    <div className={styles.loginModal}>
                        <div className={styles.loginContent}>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowLogin(false)}
                            >
                                ×
                            </button>
                            <h2>Admin Login</h2>
                            {loginError && <p className={styles.loginError}>{loginError}</p>}
                            <form onSubmit={handleLogin}>
                                <div className={styles.formField}>
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className={styles.submitButton}>
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {filteredPosts.length > 0 ? (
                    <section className={styles.blogGrid}>
                        {filteredPosts.map(post => (
                            <article key={post.id} className={styles.blogCard}>
                                {post.coverImage && (
                                    <div className={styles.imageContainer}>
                                        <img src={post.coverImage} alt={post.title} />
                                    </div>
                                )}
                                {isAdmin() && post.publishStatus !== 'published' && (
                                    <div className={`${styles.statusBadge} ${styles[post.publishStatus]}`}>
                                        {post.publishStatus}
                                        {post.scheduledPublish && (
                                            <span className={styles.scheduledTime}>
                        {new Date(post.scheduledPublish).toLocaleString()}
                      </span>
                                        )}
                                    </div>
                                )}
                                <div className={styles.blogContent}>
                                    <div className={styles.meta}>
                    <span className={styles.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                      })}
                    </span>
                                        <span className={styles.author}>{post.author}</span>
                                    </div>
                                    <h2>{post.title}</h2>
                                    <p>{post.excerpt}</p>
                                    <div className={styles.tags}>
                                        {post.tags.map(tag => (
                                            <span key={tag} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>
                                    <Link href={`/blog/${post.id}`} className={`${styles.readMore} ${M_600}`}>
                                        Read More →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </section>
                ) : (
                    <div className={styles.emptyState}>
                        <p>No blog posts found for this tag.</p>
                    </div>
                )}

                {/* Bottom navigation button */}
                <div className={styles.bottomNavigation}>
                    <button
                        className={`${styles.homeButton} ${M_600}`}
                        onClick={navigateToHome}
                        aria-label="Return to home page"
                    >
                        <IoHome /> Home
                    </button>
                </div>
            </main>
        </DotBackground>
    );
}