import React from "react";

const ProjectCard: React.FC<{ title: string; description: string; link: string; img: string }> = (props: { title: string; description: string; link: string; img: string }): JSX.Element => {
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