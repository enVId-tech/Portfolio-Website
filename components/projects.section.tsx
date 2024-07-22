import React from "react";
import styles from "@/styles/projects.module.scss";
import { Work_Sans, Montserrat } from "next/font/google";
import ProjectCard from "@/templates/ProjectCard";
import { ProjectsProps } from "@/modules/exportInterfaces";

const Work_Sans_300 = Work_Sans({
    weight: "300",
    style: "normal",
    subsets: ["latin"],
});

const Montserrat_400 = Montserrat({
    weight: "400",
    style: "normal",
    subsets: ["latin"],
});

const Projects: React.FC<ProjectsProps> = (props: ProjectsProps): JSX.Element => {
    if (!props) {
        return <></>
    }

    return (
        <div className={styles.projectsDiv} id="projects">
            <p className={`${styles.sectionHeading} ${Work_Sans_300.className}`}>Projects</p>
            <div className={styles.projectCards}>
                {props.projects.map((project, index) => {
                    return (
                        <ProjectCard
                            key={index}
                            title={project.title}
                            description={project.description}
                            embed={project.embed}
                            link={project.link}
                            githubLink={project.githubLink}
                            techStack={project.techStack}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Projects;