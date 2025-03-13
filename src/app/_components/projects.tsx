"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import styles from '@/styles/projects.module.scss';
import { M_400, M_600 } from "@/utils/globalFonts";
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

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
    description: string;
    html_url: string;
    homepage: string | null;
    languages_url: string;
    default_branch: string;
}

/**
 * Represents language data for a GitHub repository.
 */
interface LanguageData {
    [language: string]: number;
}

/**
 * Represents the structure of a package.json file.
 */
interface PackageJson {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
    const [filterMode, setFilterMode] = useState<RepoFilterMode>('include');
    const [githubProjects, setGithubProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>("All");

    // Cache key for localStorage
    const cacheKey = useMemo(() => `github-projects-cache-${filterMode}`, [filterMode]);

    // Process raw GitHub repo data into project format
    const processRepo = useCallback(async (repo: GitHubRepo): Promise<Project> => {
        try {
            // Get languages
            const langResponse = await fetch(repo.languages_url);
            const languageData: LanguageData = langResponse.ok ? await langResponse.json() : {};

            // Calculate total bytes
            const totalBytes = Object.values(languageData).reduce((sum, bytes) => sum + bytes, 0);

            // Get primary languages (>= 15%)
            const primaryLanguages = Object.entries(languageData)
                .filter(([, bytes]) => (bytes / totalBytes) >= 0.15)
                .map(([language]) => language);

            const frameworks: string[] = [];

            // Only try to fetch package.json for JavaScript/TypeScript projects
            if (languageData['JavaScript'] || languageData['TypeScript']) {
                try {
                    const packageJsonUrl = `https://raw.githubusercontent.com/enVId-tech/${repo.name}/${repo.default_branch}/package.json`;
                    const packageResponse = await fetch(packageJsonUrl);

                    if (packageResponse.ok) {
                        const packageJson: PackageJson = await packageResponse.json();
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

    // Fetch GitHub repos with caching
    useEffect(() => {
        const includedRepos = ["Portfolio-Website"];
        const excludedRepos = ["dotfiles", "notes", "test-repo"];

        const fetchGithubRepos = async () => {
            // Try to get from cache first
            try {
                const cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    // Use cache if less than 1 hour old
                    if (Date.now() - timestamp < 3600000) {
                        setGithubProjects(data);
                        return;
                    }
                }
            } catch (e) {
                console.error("Cache retrieval error:", e);
            }

            // Fetch fresh data if cache miss or expired
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('https://api.github.com/users/enVId-tech/repos?sort=updated&direction=desc');

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }

                const repos: GitHubRepo[] = await response.json();

                // Filter repositories based on mode
                const filteredRepos = filterMode === 'include'
                    ? repos.filter(repo => includedRepos.includes(repo.name))
                    : repos.filter(repo => !excludedRepos.includes(repo.name));

                // Process in batches to avoid overwhelming the browser
                const batchSize = 3;
                const processedProjects: Project[] = [];

                for (let i = 0; i < filteredRepos.length; i += batchSize) {
                    const batch = filteredRepos.slice(i, i + batchSize);
                    const batchResults = await Promise.all(batch.map(processRepo));
                    processedProjects.push(...batchResults);

                    // Update state incrementally for better UX
                    if (i === 0) {
                        setGithubProjects(batchResults);
                    } else {
                        setGithubProjects(prev => [...prev, ...batchResults]);
                    }
                }

                // Cache the final result
                try {
                    localStorage.setItem(
                        cacheKey,
                        JSON.stringify({
                            data: processedProjects,
                            timestamp: Date.now()
                        })
                    );
                } catch (e) {
                    console.error("Cache storage error:", e);
                }

            } catch (error) {
                console.error('Error fetching GitHub repositories:', error);
                setError('Failed to load GitHub projects');
            } finally {
                setIsLoading(false);
            }
        };

        fetchGithubRepos();
    }, [filterMode, cacheKey, processRepo]);

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
        <div className={styles.container}>
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