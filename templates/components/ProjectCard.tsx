import React from "react";

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
        <div className="projectCard">
            <img src={props.img} alt={props.title} />
            <p>{props.title}</p>
            <p>{props.description}</p>
            <a href={props.link} target="_blank" rel="noreferrer">Link</a>
        </div>
    );
};

export default ProjectCard;