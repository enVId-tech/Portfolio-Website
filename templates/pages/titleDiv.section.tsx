import React from "react";

interface TitleDivProps {
    title: string;
}

const TitleDiv: React.FC<TitleDivProps> = ({ title }): React.JSX.Element => {
    return (
        <div>
            <h1>{title}</h1>
        </div>
    );
};

export default TitleDiv;