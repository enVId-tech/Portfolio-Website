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
 * Type for repository filter mode.
 */
type RepoFilterMode = 'include' | 'exclude' | 'all';

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
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={`${styles.projectLink} ${styles.demoLink} ${M_400}`}>
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
    const [isClient, setIsClient] = useState(false);

    // Ensure client-side rendering for buttons to avoid hydration mismatch
    useEffect(() => {
        setIsClient(true);
    }, []);

    const fetchGithubRepos = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch projects from server-side cache
            // The server handles all GitHub API calls and caching
            const response = await fetch(`/api/projects?filterMode=${filterMode}`, {
                cache: 'no-store' // Let the server handle caching
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to load projects');
            }

            // Set the projects from the server cache
            setGithubProjects(data.projects || []);

            console.log('GitHub projects fetched:', data.projects);

            // Log cache status for debugging
            if (data.cached) {
                console.log('Projects loaded from server cache', {
                    stale: data.stale,
                    timestamp: new Date(data.timestamp).toLocaleString(),
                    expiresAt: data.expiresAt ? new Date(data.expiresAt).toLocaleString() : 'N/A'
                });
            } else {
                console.log('Projects fetched fresh from GitHub API');
            }

            // Show warning if serving stale data
            if (data.stale && data.warning) {
                console.warn('Serving stale cache:', data.warning);
            }

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
    }, [filterMode]);

// Set up intelligent fetching with caching
    useEffect(() => {
        // Initial fetch when component mounts
        fetchGithubRepos();

        // Set up interval for periodic refresh (once every 20 minutes)
        // The server cache refreshes every 15 minutes, so we check slightly after
        const interval = setInterval(fetchGithubRepos, 20 * 60 * 1000);

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

    // Set filter mode handlers
    const handleSetIncludeMode = useCallback(() => {
        setFilterMode('include');
    }, []);

    const handleSetExcludeMode = useCallback(() => {
        setFilterMode('exclude');
    }, []);

    const handleSetAllMode = useCallback(() => {
        setFilterMode('all');
    }, []);

    return (
        <div className={styles.container} id={"projects"}>
            <h2 className={`${styles.projectsTitle} ${M_600}`}>
                My Projects
                {isClient && (
                    <div className={styles.filterModeButtons}>
                        <button
                            onClick={handleSetIncludeMode}
                            className={`${styles.filterModeButton} ${filterMode === 'include' ? styles.active : ''}`}
                        >
                            Included
                        </button>
                        <button
                            onClick={handleSetExcludeMode}
                            className={`${styles.filterModeButton} ${filterMode === 'exclude' ? styles.active : ''}`}
                        >
                            Excluded
                        </button>
                        <button
                            onClick={handleSetAllMode}
                            className={`${styles.filterModeButton} ${filterMode === 'all' ? styles.active : ''}`}
                        >
                            All
                        </button>
                    </div>
                )}
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