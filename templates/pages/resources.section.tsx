import React from "react";
import styles from "@/styles/resources.module.scss";
import { Work_Sans } from "next/font/google";
import ResourceCard from "@/templates/components/ResourceCard.tsx";

const Work_Sans_300 = Work_Sans({
    weight: "300",
    style: "normal",
    subsets: ["latin"],
});

interface ResourcesProps {
    resources: {
        title: string;
        description: string;
        image: string;
        link: string;
    }[];
}

const Resources: React.FC<ResourcesProps> = (props: ResourcesProps): JSX.Element => {
    // Add a slide animation to the resource cards
    React.useEffect(() => {
        const resourceCards: NodeListOf<Element> = document.querySelectorAll(`.${styles.resourceCard}`);
        let i: number = 0;

        const slideIn = (): void => {
            if (i < resourceCards.length) {
                resourceCards[i].classList.add(styles.slideIn);
                i++;
                setTimeout(slideIn, 100);
            }
        };

        slideIn();
    }, []);

    return (
        <div className={styles.resourcesDiv} id="resources">
            <p className={`${styles.sectionHeading} ${Work_Sans_300.className}`}>Resources</p>
            <div className={styles.resourceCards}>
                {props.resources.map((resource, index) => {
                    return (
                        <ResourceCard
                            key={index}
                            title={resource.title}
                            description={resource.description}
                            image={resource.image}
                            link={resource.link}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Resources;