import React from "react";
import styles from '@/styles/projectCard.module.scss';

interface ProjectCardProps {
    title: string;
    description: string;
    embed: string;
    link: string;
    githubLink: string;
    techStack: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = (props: ProjectCardProps): JSX.Element => {
    return (
        <div className={styles.projectCard}>
            <h3 className={styles.projectTitle}>{props.title}</h3>
            <p className={styles.projectDescription}>{props.description}</p>
            <iframe src={props.embed} title={props.title} frameBorder="0" allowFullScreen className={styles.embed}></iframe>
            <a href={props.link} target="_blank" rel="noreferrer" className={styles.projectLink}>Link</a>

        </div>
    );
};

export default ProjectCard;