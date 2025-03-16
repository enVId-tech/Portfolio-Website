"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DotBackground from "@/app/_components/dotbackground";
import styles from '@/styles/register.module.scss';
import { M_400, M_600 } from "@/utils/globalFonts";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!username || !password) {
      setError('Username and password are required');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ username, password, role }),
      // });
      //
      // const data = await response.json();

      const data = {
        success: true,
        error: null,
      }

      if (!data.success) {
        setError(data.error || 'Registration failed');
      } else {
        setSuccess(true);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/blog');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
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
      <main className={styles.registerContainer}>
        <div className={styles.registerForm}>
          <h1 className={`${styles.title} ${M_600}`}>Create Account</h1>

          {success ? (
            <div className={styles.successMessage}>
              <p>Account created successfully!</p>
              <p>Redirecting to the blog...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className={styles.errorMessage}>{error}</div>}

              <div className={styles.formField}>
                <label htmlFor="username" className={M_400}>Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="password" className={M_400}>Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="confirmPassword" className={M_400}>Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="role" className={M_400}>Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/*<div className={styles.formControls}>*/}
              {/*  <button*/}
              {/*    type="submit"*/}
              {/*    className={styles.submitButton}*/}
              {/*    disabled={loading}*/}
              {/*  >*/}
              {/*    {loading ? 'Creating account...' : 'Register'}*/}
              {/*  </button>*/}
              {/*</div>*/}

              <div className={styles.loginLink}>
                <p className={M_400}>
                  Already have an account? <Link href="/blog">Return to blog</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>
    </DotBackground>
  );
}