"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import styles from '@/styles/projects.module.scss';
import { M_400, M_600 } from "@/utils/globalFonts";
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { githubService } from '@/utils/githubService';
import { cachedFetch } from '@/utils/cache';

// Types - moved to the top for better code organization
/**
 * Represents a technology used in a project.
 */
interface ProjectTechnology {
    name: string;
    icon?: string;
}

/**
 * Represents a project with its details.
 */
interface Project {
    title: string;
    description: string;
    imageUrl?: string;
    demoUrl?: string;
    githubUrl?: string;
    technologies: ProjectTechnology[];
    isFromGitHub?: boolean;
}

/**
 * Represents a GitHub repository.
 */
interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    languages_url: string;
    default_branch: string;
}

/**
 * Represents the API response for GitHub repository settings.
 */
interface GitHubReposApiResponse {
    success: boolean;
    includedRepos?: string[];
    excludedRepos?: string[];
}

/**
 * Type for repository filter mode.
 */
type RepoFilterMode = 'include' | 'exclude';

// Framework detection mapping - moved outside component to prevent recreation
const frameworkDetection = {
    'React': ['react', 'react-dom'],
    'Next.js': ['next'],
    'Vue': ['vue'],
    'Angular': ['@angular/core'],
    'Svelte': ['svelte'],
    'Express': ['express'],
    'ElectronJS': ['electron'],
};

// Individual project card component - extracted and memoized
/**
 * Component to display a single project card.
 * @param {Object} props - The component props.
 * @param {Project} props.project - The project to display.
 * @returns {React.ReactElement} The rendered project card component.
 */
// eslint-disable-next-line react/display-name
const ProjectCard = React.memo(({ project }: { project: Project }) => (
    <div className={styles.projectCard}>
        {project.imageUrl && (
            <div className={styles.projectImageContainer}>
                <img
                    src={project.imageUrl}
                    alt={project.title}
                    className={styles.projectImage}
                    loading="lazy" // Add lazy loading for images
                />
            </div>
        )}

        <div className={styles.projectContent}>
            <h3 className={`${styles.projectTitle} ${M_600}`}>
                {project.title}
                {project.isFromGitHub && (
                    <span className={styles.githubBadge}>GitHub</span>
                )}
            </h3>
            <p className={`${styles.projectDescription} ${M_400}`}>{project.description}</p>

            <div className={styles.techList}>
                {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className={`${styles.techBadge} ${M_400}`}>
                        {tech.name}
                    </span>
                ))}
            </div>

            <div className={styles.projectLinks}>
                {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={`${styles.projectLink} ${M_400}`}>
                        <FaGithub /> GitHub
                    </a>
                )}
                {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={`${styles.projectLink} ${M_400}`}>
                        <FaExternalLinkAlt /> Live Demo
                    </a>
                )}
            </div>
        </div>
    </div>
));

// Filter button component - extracted and memoized
/**
 * Component to display a filter button.
 * @param {Object} props - The component props.
 * @param {string} props.technology - The technology name.
 * @param {boolean} props.isActive - Whether the filter is active.
 * @param {() => void} props.onClick - The click handler for the button.
 * @returns {React.ReactElement} The rendered filter button component.
 */
// eslint-disable-next-line react/display-name
const FilterButton = React.memo(({
                                     technology,
                                     isActive,
                                     onClick
                                 }: {
    technology: string;
    isActive: boolean;
    onClick: () => void;
}) => (
    <button
        className={`${styles.filterButton} ${isActive ? styles.active : ''} ${M_400}`}
        onClick={onClick}
    >
        {technology}
    </button>
));

/**
 * Main component to display projects.
 * @returns {React.ReactElement} The rendered projects component.
 */
export default function Projects(): React.ReactElement {
    // Constants - moved outside of render cycle
    const manualProjects: Project[] = useMemo(() => [], []);

    // State hooks
    const [filterMode, setFilterMode] = useState<RepoFilterMode>('exclude');
    const [githubProjects, setGithubProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>("All");

    // Process raw GitHub repo data into project format
    const processRepo = useCallback(async (repo: GitHubRepo): Promise<Project> => {
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
    }, []);

    const fetchGithubRepos = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        // Default fallback repository lists
        let includedRepos: string[] = [];
        let excludedRepos: string[] = ["DockerTemplates", "enVId-tech"];

        try {
            // Fetch repository settings from MongoDB (cached)
            const reposData = await cachedFetch(
                '/api/github-repos',
                'api-github-repos',
                { headers: { 'Cache-Control': 'no-cache' } },
                5 * 60 * 1000 // 5 minutes cache
            ) as GitHubReposApiResponse;

            if (reposData.success) {
                includedRepos = reposData.includedRepos || includedRepos;
                excludedRepos = reposData.excludedRepos || excludedRepos;
            }

            // Check if GitHub API is available before making requests
            if (!githubService.isApiAvailable()) {
                const timeUntilReset = githubService.getTimeUntilReset();
                const resetTime = timeUntilReset ? new Date(Date.now() + timeUntilReset) : null;
                throw new Error(
                    `GitHub API rate limit exceeded. ${resetTime ? 
                        `Resets at: ${resetTime.toLocaleTimeString()}` : 
                        'Please try again later.'}`
                );
            }

            // Fetch GitHub repositories using the service
            const repos = await githubService.getRepositories();

            // Filter repositories based on mode
            const filteredRepos = filterMode === 'include'
                ? repos.filter((repo: GitHubRepo) => includedRepos.includes(repo.name))
                : repos.filter((repo: GitHubRepo) => !excludedRepos.includes(repo.name));

            // Process repositories in smaller batches to avoid overwhelming the API
            const batchSize = 2; // Reduced from 3 to be more conservative
            const processedProjects = [];

            for (let i = 0; i < filteredRepos.length; i += batchSize) {
                const batch = filteredRepos.slice(i, i + batchSize);
                
                try {
                    const batchResults = await Promise.all(batch.map(processRepo));
                    processedProjects.push(...batchResults);

                    // Update state incrementally for better UX
                    if (i === 0) {
                        setGithubProjects(batchResults);
                    } else {
                        setGithubProjects(prev => [...prev, ...batchResults]);
                    }

                    // Add small delay between batches to be respectful to APIs
                    if (i + batchSize < filteredRepos.length) {
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                } catch (batchError) {
                    console.error(`Error processing batch ${i}-${i + batchSize}:`, batchError);
                    // Continue with next batch instead of failing completely
                }
            }

            setGithubProjects(processedProjects);

        } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
            
            // Provide more specific error messages
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Failed to load GitHub projects');
            }
        } finally {
            setIsLoading(false);
        }
    }, [filterMode, processRepo]);

// Set up intelligent fetching with caching
    useEffect(() => {
        // Initial fetch when component mounts
        fetchGithubRepos();

        // Set up interval for periodic cache refresh (once every 10 minutes)
        // The cache will handle whether to actually fetch fresh data
        const interval = setInterval(fetchGithubRepos, 10 * 60 * 1000);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, [fetchGithubRepos]);

    // Combine manual and GitHub projects
    const allProjects = useMemo(() => {
        return [...manualProjects, ...githubProjects];
    }, [manualProjects, githubProjects]);

    // Get all unique technologies for filters
    const allTechnologies = useMemo((): string[] => {
        const techSet = new Set<string>();
        techSet.add("All");

        allProjects.forEach(project => {
            project.technologies.forEach(tech => techSet.add(tech.name));
        });

        return Array.from(techSet);
    }, [allProjects]);

    // Filter projects based on selected technology
    const filteredProjects = useMemo(() => {
        if (activeFilter === "All") {
            return [...allProjects].sort((a, b) => b.technologies.length - a.technologies.length);
        }

        return allProjects
            .filter(project => project.technologies.some(tech => tech.name === activeFilter))
            .sort((a, b) => b.technologies.length - a.technologies.length);
    }, [allProjects, activeFilter]);

    // Filter button click handler
    const handleFilterClick = useCallback((tech: string) => {
        setActiveFilter(tech);
    }, []);

    // Toggle filter mode with useCallback
    const toggleFilterMode = useCallback(() => {
        setFilterMode(prevMode => prevMode === 'exclude' ? 'include' : 'exclude');
    }, []);

    return (
        <div className={styles.container} id={"projects"}>
            <h2 className={`${styles.projectsTitle} ${M_600}`}>
                My Projects
                <button
                    onClick={toggleFilterMode}
                    className={styles.filterModeButton}
                >
                    Mode: {filterMode === 'exclude' ? 'Excluding' : 'Including'} specific repos
                </button>
            </h2>

            <div className={styles.filterContainer}>
                {allTechnologies.map((tech) => (
                    <FilterButton
                        key={tech}
                        technology={tech}
                        isActive={tech === activeFilter}
                        onClick={() => handleFilterClick(tech)}
                    />
                ))}
            </div>

            {isLoading && (
                <div className={styles.loadingMessage}>
                    <p className={M_400}>Loading projects from GitHub...</p>
                </div>
            )}

            {error && (
                <div className={styles.errorMessage}>
                    <p className={M_400}>{error}</p>
                </div>
            )}

            {!isLoading && filteredProjects.length === 0 && (
                <div className={styles.emptyMessage}>
                    <p className={M_400}>No projects found matching the current filter.</p>
                </div>
            )}

            <div className={styles.projectsGrid}>
                {filteredProjects.map((project, index) => (
                    <ProjectCard key={`${project.title}-${index}`} project={project} />
                ))}
            </div>
        </div>
    );
}