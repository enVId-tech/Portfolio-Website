"use client";
import React, { useState, useMemo, useEffect } from 'react';
import styles from '@/styles/projects.module.scss';
import { M_400, M_600 } from "@/utils/globalFonts";
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

interface ProjectTechnology {
    name: string;
    icon?: string;
}

interface Project {
    title: string;
    description: string;
    imageUrl?: string;
    demoUrl?: string;
    githubUrl?: string;
    technologies: ProjectTechnology[];
    isFromGitHub?: boolean;
}

// GitHub repository interface
interface GitHubRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    homepage: string | null;
    languages_url: string;
    default_branch: string;
}

// GitHub languages interface
interface LanguageData {
    [language: string]: number;
}

// Package.json interface
interface PackageJson {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

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

// Repository filter mode type
type RepoFilterMode = 'include' | 'exclude';

export default function Projects(): React.ReactElement {
    // Manual projects
    const manualProjects: Project[] = useMemo(() => [], []);

    // Repositories to include or exclude
    const includedRepos = ["Portfolio-Website"]//, "Terminal-Commands", "DB-Reader-Electron-App", "Safety-Test", "Calendar-App", "OA-Website", "OpenCV-Object-Detection", "Classroom-Website", "Schedules"];  // Example repos to include
    const excludedRepos = ["dotfiles", "notes", "test-repo"];

    // Filter mode - change to 'include' to only show specific repositories
    const [filterMode, setFilterMode] = useState<RepoFilterMode>('include');

    const [githubProjects, setGithubProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>("All");

    useEffect(() => {
        const fetchGithubRepos = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://api.github.com/users/enVId-tech/repos?sort=updated&direction=desc');

                if (!response.ok) {
                    // throw new Error('Failed to fetch GitHub repositories');
                    return;
                }

                const repos: GitHubRepo[] = await response.json();

                // Filter repositories based on the selected mode
                const filteredRepos = filterMode === 'include'
                    ? repos.filter(repo => includedRepos.includes(repo.name))
                    : repos.filter(repo => !excludedRepos.includes(repo.name));

                // Process each repository
                const processedRepos = await Promise.all(
                    filteredRepos.map(async (repo) => {
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

                            // Try to fetch package.json to detect frameworks
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
                    })
                );

                setGithubProjects(processedRepos);
            } catch (error) {
                console.error('Error fetching GitHub repositories:', error);
                setError('Failed to load GitHub projects');
            } finally {
                setIsLoading(false);
            }
        };

        fetchGithubRepos();
    }, [filterMode]); // Only re-fetch when filter mode changes

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
            return [...allProjects].sort((a: Project, b: Project): number =>
                b.technologies.length - a.technologies.length);
        }

        return allProjects
            .filter(project => project.technologies.some(tech => tech.name === activeFilter))
            .sort((a, b) => b.technologies.length - a.technologies.length);
    }, [allProjects, activeFilter]);

    // Toggle filter mode (for demonstration purposes)
    const toggleFilterMode = () => {
        setFilterMode(prevMode => prevMode === 'exclude' ? 'include' : 'exclude');
    };

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
                    <button
                        key={tech}
                        className={`${styles.filterButton} ${tech === activeFilter ? styles.active : ''} ${M_400}`}
                        onClick={() => setActiveFilter(tech)}
                    >
                        {tech}
                    </button>
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
                    <div key={index} className={styles.projectCard}>
                        {project.imageUrl && (
                            <div className={styles.projectImageContainer}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={project.imageUrl} alt={project.title} className={styles.projectImage} />
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
                ))}
            </div>
        </div>
    );
}