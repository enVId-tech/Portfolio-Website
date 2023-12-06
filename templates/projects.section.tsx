import React from "react";
import styles from "./scss/projects.module.scss";
import { Work_Sans } from "next/font/google";

const Work_Sans_300 = Work_Sans({
  weight: "300",
  style: "normal",
  subsets: ["latin"],
});

interface ProjectProps {
    carouselURLS: string[];
}

const Projects: React.FC<ProjectProps> = (props: ProjectProps): JSX.Element => {
    const [projectsScrolled, setProjectsScrolled] = React.useState<boolean>(false);
    const [carouselIndex, setCarouselIndex] = React.useState<number>(0);
    const [carouselURLS, setCarouselURLS] = React.useState<string[]>(props.carouselURLS);

    return (
        <div className={`${styles.projectsMainDiv}`}>
            <p className={`${styles.projectsTitle} ${Work_Sans_300.className}`}>My Projects</p>
        </div>
    )
}

export default Projects;