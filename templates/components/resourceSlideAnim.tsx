import React from "react";

const ResourceSlideAnim: React.FC<{ title: string; description: string; link: string }> = (props: { title: string; description: string; link: string }): JSX.Element => {
    return (
        <div className="resourceSlideAnim">
            <p>{props.title}</p>
            <p>{props.description}</p>
            <a href={props.link} target="_blank" rel="noreferrer">Link</a>
        </div>
    );
};

export default ResourceSlideAnim;