import { NextResponse } from 'next/server';
import { githubService } from '@/utils/githubService';

// Server-side cache for processed projects
interface ProcessedProject {
    title: string;
    description: string;
    imageUrl?: string;
    demoUrl?: string;
    githubUrl?: string;
    technologies: Array<{ name: string; icon?: string }>;
    isFromGitHub?: boolean;
}

interface CachedProjectsData {
    projects: ProcessedProject[];
    timestamp: number;
    expiresAt: number;
}

// In-memory cache on the server (persists across requests in the same server instance)
let serverCache: CachedProjectsData | null = null;

// Cache duration: 15 minutes
const CACHE_DURATION = 15 * 60 * 1000;

// Framework detection mapping
const frameworkDetection = {
    'React': ['react', 'react-dom'],
    'Next.js': ['next'],
    'Vue': ['vue'],
    'Angular': ['@angular/core'],
    'Svelte': ['svelte'],
    'Express': ['express'],
    'ElectronJS': ['electron'],
};

interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    languages_url: string;
    default_branch: string;
}

interface PackageJson {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

async function processRepo(repo: GitHubRepo): Promise<ProcessedProject> {
    try {
        // Get languages using GitHub service
        const languageData = await githubService.getRepositoryLanguages(repo.name);

        // Calculate total bytes
        const totalBytes = Object.values(languageData).reduce((sum: number, bytes: number) => sum + bytes, 0);

        // Get primary languages (>= 15%)
        const primaryLanguages = Object.entries(languageData)
            .filter(([, bytes]: [string, number]) => (bytes / totalBytes) >= 0.15)
            .map(([language]) => language);

        const frameworks: string[] = [];

        // Only try to fetch package.json for JavaScript/TypeScript projects
        if (languageData['JavaScript'] || languageData['TypeScript']) {
            try {
                const packageJson = await githubService.getPackageJson(repo.name, repo.default_branch || 'main');
                
                if (packageJson) {
                    const allDependencies = {
                        ...(packageJson.dependencies || {}),
                        ...(packageJson.devDependencies || {})
                    };

                    // Detect frameworks from dependencies
                    Object.entries(frameworkDetection).forEach(([framework, packages]) => {
                        if (packages.some(pkg => allDependencies[pkg] !== undefined)) {
                            frameworks.push(framework);
                        }
                    });
                }
            } catch (error) {
                console.error(`Error fetching package.json for ${repo.name}:`, error);
            }
        }

        // Combine languages and frameworks into technologies
        const technologies = [
            ...primaryLanguages.map(lang => ({ name: lang })),
            ...frameworks.map(fw => ({ name: fw }))
        ];

        return {
            title: repo.name,
            description: repo.description || "No description available",
            githubUrl: repo.html_url,
            demoUrl: repo.homepage || undefined,
            technologies: technologies.length > 0 ? technologies : [{ name: "Unknown" }],
            isFromGitHub: true
        };
    } catch (error) {
        console.error(`Error processing repository ${repo.name}:`, error);
        return {
            title: repo.name,
            description: repo.description || "No description available",
            githubUrl: repo.html_url,
            demoUrl: repo.homepage || undefined,
            technologies: [{ name: "Unknown" }],
            isFromGitHub: true
        };
    }
}

async function fetchAndCacheProjects(filterMode: 'include' | 'exclude', includedRepos: string[], excludedRepos: string[]): Promise<ProcessedProject[]> {
    console.log('Fetching projects from GitHub API...');
    
    // Check if GitHub API is available
    if (!githubService.isApiAvailable()) {
        const timeUntilReset = githubService.getTimeUntilReset();
        const resetTime = timeUntilReset ? new Date(Date.now() + timeUntilReset) : null;
        throw new Error(
            `GitHub API rate limit exceeded. ${resetTime ? 
                `Resets at: ${resetTime.toLocaleTimeString()}` : 
                'Please try again later.'}`
        );
    }

    // Fetch GitHub repositories
    const repos = await githubService.getRepositories();

    // Filter repositories based on mode
    const filteredRepos = filterMode === 'include'
        ? repos.filter((repo: GitHubRepo) => includedRepos.includes(repo.name))
        : repos.filter((repo: GitHubRepo) => !excludedRepos.includes(repo.name));

    // Process repositories in batches
    const batchSize = 2;
    const processedProjects: ProcessedProject[] = [];

    for (let i = 0; i < filteredRepos.length; i += batchSize) {
        const batch = filteredRepos.slice(i, i + batchSize);
        
        try {
            const batchResults = await Promise.all(batch.map(processRepo));
            processedProjects.push(...batchResults);

            // Small delay between batches
            if (i + batchSize < filteredRepos.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        } catch (batchError) {
            console.error(`Error processing batch ${i}-${i + batchSize}:`, batchError);
        }
    }

    return processedProjects;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const filterMode = (searchParams.get('filterMode') as 'include' | 'exclude') || 'exclude';
        const forceRefresh = searchParams.get('forceRefresh') === 'true';

        // Default repository lists
        let includedRepos: string[] = [];
        let excludedRepos: string[] = ["DockerTemplates", "enVId-tech"];

        // Fetch repository settings from database
        try {
            const reposResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/github-repos`, {
                cache: 'no-store'
            });
            const reposData = await reposResponse.json();
            
            if (reposData.success) {
                includedRepos = reposData.includedRepos || includedRepos;
                excludedRepos = reposData.excludedRepos || excludedRepos;
            }
        } catch (error) {
            console.error('Error fetching repo settings:', error);
        }

        // Generate cache key based on filter settings
        const cacheKey = `${filterMode}-${includedRepos.join(',')}-${excludedRepos.join(',')}`;

        // Check if we have valid cached data
        if (!forceRefresh && serverCache && 
            serverCache.expiresAt > Date.now() && 
            cacheKey === `${filterMode}-${includedRepos.join(',')}-${excludedRepos.join(',')}`) {
            
            console.log('Serving projects from server cache');
            return NextResponse.json({
                success: true,
                projects: serverCache.projects,
                cached: true,
                timestamp: serverCache.timestamp,
                expiresAt: serverCache.expiresAt
            });
        }

        // Fetch fresh data
        const projects = await fetchAndCacheProjects(filterMode, includedRepos, excludedRepos);

        // Update server cache
        const now = Date.now();
        serverCache = {
            projects,
            timestamp: now,
            expiresAt: now + CACHE_DURATION
        };

        console.log(`Cached ${projects.length} projects on server`);

        return NextResponse.json({
            success: true,
            projects,
            cached: false,
            timestamp: now,
            expiresAt: serverCache.expiresAt
        });

    } catch (error) {
        console.error('Error fetching projects:', error);
        
        // If we have stale cache data, return it with a warning
        if (serverCache) {
            return NextResponse.json({
                success: true,
                projects: serverCache.projects,
                cached: true,
                stale: true,
                timestamp: serverCache.timestamp,
                warning: error instanceof Error ? error.message : 'Error fetching fresh data, serving stale cache'
            });
        }
        
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch projects' 
            },
            { status: 500 }
        );
    }
}
