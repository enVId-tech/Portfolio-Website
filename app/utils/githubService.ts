/**
 * GitHub API service with intelligent caching and rate limiting
 */

import { cache, persistentCache } from './cache';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages_url: string;
  default_branch: string;
  updated_at: string;
  created_at: string;
  stargazers_count: number;
  forks_count: number;
}

interface LanguageData {
  [language: string]: number;
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  name?: string;
  version?: string;
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  used: number;
}

class GitHubService {
  private readonly baseUrl = 'https://api.github.com';
  private readonly username = 'enVId-tech';
  private readonly token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  private rateLimitInfo: RateLimitInfo | null = null;
  
  // Rate limiting configuration
  private readonly minRequestsRemaining = 10; // Reserve requests for critical operations
  private readonly rateLimitCheckInterval = 5 * 60 * 1000; // Check every 5 minutes
  
  constructor() {
    // Warn if no token is provided
    if (!this.token) {
      console.warn('GitHub token not found. Rate limits will be more restrictive.');
      console.warn('Checked environment variables: GITHUB_TOKEN, NEXT_PUBLIC_GITHUB_TOKEN');
    } else {
      console.log('GitHub token loaded successfully. Enhanced rate limits available.');
      console.log(`Token starts with: ${this.token.substring(0, 8)}...`);
    }
    
    // Periodically check rate limit status
    setInterval(() => this.updateRateLimitInfo(), this.rateLimitCheckInterval);
  }

  /**
   * Check if we can safely make API requests
   */
  private canMakeRequest(): boolean {
    if (!this.rateLimitInfo) {
      console.log('No rate limit info yet, allowing first request');
      return true; // First request
    }
    
    const now = Date.now() / 1000;
    
    // If rate limit has reset, we're good to go
    if (now >= this.rateLimitInfo.reset) {
      console.log('Rate limit has reset, allowing request');
      return true;
    }
    
    const canMake = this.rateLimitInfo.remaining > this.minRequestsRemaining;
    console.log(`Rate limit check: ${this.rateLimitInfo.remaining} remaining, min required: ${this.minRequestsRemaining}, can make request: ${canMake}`);
    
    // Check if we have enough requests remaining
    return canMake;
  }

  /**
   * Update rate limit information from GitHub headers
   */
  private updateRateLimitFromHeaders(headers: Headers): void {
    this.rateLimitInfo = {
      limit: parseInt(headers.get('x-ratelimit-limit') || '0'),
      remaining: parseInt(headers.get('x-ratelimit-remaining') || '0'),
      reset: parseInt(headers.get('x-ratelimit-reset') || '0'),
      used: parseInt(headers.get('x-ratelimit-used') || '0')
    };
  }

  /**
   * Get authorization headers for GitHub API requests
   */
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  /**
   * Update rate limit information from GitHub API
   */
  private async updateRateLimitInfo(): Promise<void> {
    try {
      console.log('Updating rate limit info...');
      const response = await fetch(`${this.baseUrl}/rate_limit`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        console.warn(`Rate limit check failed: ${response.status} ${response.statusText}`);
        return;
      }
      
      const data = await response.json();
      console.log('Rate limit response:', data);
      
      if (data.rate) {
        this.rateLimitInfo = data.rate;
        if (this.rateLimitInfo) {
          console.log(`Updated rate limit: ${this.rateLimitInfo.remaining}/${this.rateLimitInfo.limit} remaining, resets at ${new Date(this.rateLimitInfo.reset * 1000).toLocaleString()}`);
        }
      }
      
      this.updateRateLimitFromHeaders(response.headers);
    } catch (error) {
      console.warn('Failed to update rate limit info:', error);
    }
  }

  /**
   * Make a GitHub API request with rate limit handling
   */
  private async githubFetch<T>(
    endpoint: string,
    cacheKey: string,
    cacheTTL: number = 30 * 60 * 1000 // 30 minutes default
  ): Promise<T> {
    // Check cache first
    let cached = cache.get<T>(cacheKey);
    if (cached) return cached;
    
    cached = persistentCache.get<T>(cacheKey);
    if (cached) {
      cache.set(cacheKey, cached);
      return cached;
    }
    
    // Check rate limit
    if (!this.canMakeRequest()) {
      const resetTime = this.rateLimitInfo ? new Date(this.rateLimitInfo.reset * 1000) : new Date();
      throw new Error(`GitHub API rate limit exceeded. Resets at: ${resetTime.toLocaleTimeString()}`);
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.getAuthHeaders()
    });
    
    // Update rate limit info from response headers
    this.updateRateLimitFromHeaders(response.headers);
    
    if (!response.ok) {
      if (response.status === 403) {
        const resetHeader = response.headers.get('x-ratelimit-reset');
        const resetTime = resetHeader ? new Date(parseInt(resetHeader) * 1000) : new Date();
        throw new Error(`GitHub API rate limit exceeded. Resets at: ${resetTime.toLocaleTimeString()}`);
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data: T = await response.json();
    
    // Cache the result
    cache.set(cacheKey, data, cacheTTL);
    persistentCache.set(cacheKey, data, cacheTTL);
    
    return data;
  }

  /**
   * Get all repositories for the user
   */
  async getRepositories(): Promise<GitHubRepo[]> {
    const cacheKey = 'github-repos-all';
    const cacheTTL = 30 * 60 * 1000; // 30 minutes
    
    return this.githubFetch<GitHubRepo[]>(
      `/users/${this.username}/repos?sort=updated&direction=desc&per_page=100`,
      cacheKey,
      cacheTTL
    );
  }

  /**
   * Get languages for a specific repository
   */
  async getRepositoryLanguages(repoName: string): Promise<LanguageData> {
    const cacheKey = `github-languages-${repoName}`;
    const cacheTTL = 60 * 60 * 1000; // 1 hour (languages don't change often)
    
    return this.githubFetch<LanguageData>(
      `/repos/${this.username}/${repoName}/languages`,
      cacheKey,
      cacheTTL
    );
  }

  /**
   * Get package.json for a repository (with fallback caching)
   */
  async getPackageJson(repoName: string, branch: string = 'main'): Promise<PackageJson | null> {
    const cacheKey = `github-package-${repoName}-${branch}`;
    const cacheTTL = 2 * 60 * 60 * 1000; // 2 hours
    
    // Check cache first
    let cached = cache.get<PackageJson | null>(cacheKey);
    if (cached !== undefined) return cached;
    
    cached = persistentCache.get<PackageJson | null>(cacheKey);
    if (cached !== undefined) {
      cache.set(cacheKey, cached);
      return cached;
    }
    
    try {
      // Use raw GitHub content API with authentication if available
      const url = `https://raw.githubusercontent.com/${this.username}/${repoName}/${branch}/package.json`;
      const headers: HeadersInit = {};
      
      // Add authentication for private repos if token is available
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        // Cache null result to avoid repeated failed requests
        cache.set(cacheKey, null, cacheTTL);
        persistentCache.set(cacheKey, null, cacheTTL);
        return null;
      }
      
      const packageJson: PackageJson = await response.json();
      
      // Cache the result
      cache.set(cacheKey, packageJson, cacheTTL);
      persistentCache.set(cacheKey, packageJson, cacheTTL);
      
      return packageJson;
    } catch (error) {
      console.warn(`Failed to fetch package.json for ${repoName}:`, error);
      // Cache null result to avoid repeated failed requests
      cache.set(cacheKey, null, cacheTTL);
      persistentCache.set(cacheKey, null, cacheTTL);
      return null;
    }
  }

  /**
   * Get current rate limit status
   */
  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo;
  }

  /**
   * Check if API is currently available
   */
  isApiAvailable(): boolean {
    return this.canMakeRequest();
  }

  /**
   * Get time until rate limit resets (in milliseconds)
   */
  getTimeUntilReset(): number | null {
    if (!this.rateLimitInfo) return null;
    
    const now = Date.now() / 1000;
    const resetTime = this.rateLimitInfo.reset;
    
    return resetTime > now ? (resetTime - now) * 1000 : 0;
  }

  /**
   * Get remaining requests
   */
  getRemainingRequests(): number {
    return this.rateLimitInfo?.remaining ?? 5000; // Default for unauthenticated requests
  }

  /**
   * Clean up cached data for repositories that are not in the valid repos list
   * This removes language and package.json cache entries for repos that are no longer being tracked
   */
  cleanupUnusedRepoCache(validRepoNames: string[]): { deletedCount: number; keys: string[] } {
    const deletedKeys: string[] = [];
    let deletedCount = 0;
    
    // Get all cache keys
    const allKeys = cache.getKeys();
    
    // Find repository-specific cache keys (languages and package.json)
    const repoSpecificKeys = allKeys.filter(key => 
      key.startsWith('github-languages-') || key.startsWith('github-package-')
    );
    
    // Check each key to see if it belongs to a valid repo
    repoSpecificKeys.forEach(key => {
      let repoName: string | undefined;
      
      if (key.startsWith('github-languages-')) {
        repoName = key.replace('github-languages-', '');
      } else if (key.startsWith('github-package-')) {
        // Format: github-package-{repoName}-{branch}
        const parts = key.replace('github-package-', '').split('-');
        // Repo name is everything except the last part (branch)
        repoName = parts.slice(0, -1).join('-');
      }
      
      // If repo name is not in the valid list, delete the cache entry
      if (repoName && !validRepoNames.includes(repoName)) {
        if (cache.delete(key)) {
          deletedKeys.push(key);
          deletedCount++;
        }
        // Also delete from persistent cache
        persistentCache.delete(key);
      }
    });
    
    console.log(`Cleaned up ${deletedCount} cache entries for unused repos:`, deletedKeys);
    
    return { deletedCount, keys: deletedKeys };
  }
}

// Export singleton instance
export const githubService = new GitHubService();
