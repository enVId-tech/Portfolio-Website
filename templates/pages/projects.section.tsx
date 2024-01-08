import React from 'react';
import styles from '@/styles/projects.module.scss';
import { Work_Sans, Montserrat } from 'next/font/google';

const Work_Sans_300 = Work_Sans({
    weight: "300",
    style: 'normal',
    subsets: ['latin']
});

const Work_Sans_400 = Work_Sans({
    weight: "400",
    style: 'normal',
    subsets: ['latin']
});

const Montserrat_400 = Montserrat({
    weight: "400",
    style: 'normal',
    subsets: ['latin']
});

interface ProjectsProps {
    defaultShow: number;
}

const PlaceholderProjects: object[] = [
    {
        title: "Project 1",
        description: "Placeholder Description",
        link: "https://www.google.com",
        image: "https://via.placeholder.com/150",
        tags: ["javascript", "react"],
    },
    {
        title: "Project 2",
        description: "Placeholder Description",
        link: "https://www.google.com",
        image: "https://via.placeholder.com/150",
        tags: ["typescript", "react"],
    },
    {
        title: "Project 3",
        description: "Placeholder Description",
        link: "https://www.google.com",
        image: "https://via.placeholder.com/150",
        tags: ["typescript", "react", "node"],
    },
    {
        title: "Project 4",
        description: "Placeholder Description",
        link: "https://www.google.com",
        image: "https://via.placeholder.com/150",
        tags: ["typescript", "react", "node", "mongodb", "express"]
    },
    {
        title: "Project 5",
        description: "Placeholder Description",
        link: "https://www.google.com",
        image: "https://via.placeholder.com/150",
        tags: ["python", "pytorch", "tensorflow", "opencv"]
    },
    {
        title: "Project 6",
        description: "Placeholder Description",
        link: "https://www.google.com",
        image: "https://via.placeholder.com/150",
        tags: ["c#", "unity", "blender"]
    },
    {
        title: "Project 7",
        description: "Placeholder Description",
        link: "https://www.google.com",
        image: "https://via.placeholder.com/150",
        tags: ["typescript", "react", "python", "flask", "django"]
    }
];

const Projects: React.FC<ProjectsProps> = (props: ProjectsProps): React.JSX.Element => {
    return (
        <div className={`${styles.projectsMainDiv}`}>
            <p className={`${styles.projectsTitle} ${Montserrat_400.className}`}>Projects</p>
            <div className={`${styles.projectsArea}`}>
                <div className={`${styles.projectsAreaLeft}`}>
                    <p>hi</p>
                    <input type="text" className={`${styles.projectsSearchBar} ${Work_Sans_300.className}`} placeholder="Search projects" />
                </div>
                <div className={`${styles.projectsAreaRight}`}>
                    <p>hi 2</p>
                </div>
            </div>
        </div>
    )
};

export default Projects;