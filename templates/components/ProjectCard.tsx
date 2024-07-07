import React from "react";
import styles from '@/styles/projectCard.module.scss';
import { Work_Sans } from "next/font/google";
import { ProjectCardProps } from "../ts/exportInterfaces.ts";

const Work_Sans_300 = Work_Sans({
    weight: "300",
    style: 'normal',
    subsets: ['latin']
});

const ProjectCard: React.FC<ProjectCardProps> = (props: ProjectCardProps): JSX.Element => {
    return (
        <div className={`${styles.projectCard} ${Work_Sans_300.style}`} id="projects">
            <h3 className={`${styles.projectTitle} ${Work_Sans_300.style}`}>{props.title}</h3>
            <p className={`${styles.projectDescription} ${Work_Sans_300.style}`}>{props.description}</p>
            <iframe src={props.embed} title={props.title} frameBorder="0" allowFullScreen className={styles.embed}></iframe>
            <a href={props.link} target="_blank" rel="noreferrer" className={styles.projectLink}>Link</a>

        </div>
    );
};

export default ProjectCard;