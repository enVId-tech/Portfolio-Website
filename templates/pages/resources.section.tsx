import React from "react";
import styles from "@/styles/resources.module.scss";
import { Work_Sans } from "next/font/google";
import ResourceSlideAnim from "@/templates/components/resourceSlideAnim.ts";

const Work_Sans_300 = Work_Sans({
    weight: "300",
    style: "normal",
    subsets: ["latin"],
});

interface ResourcesProps {
    resources: {
        title: string;
        description: string;
        link: string;
    }[];
}

const Resources: React.FC<ResourcesProps> = (props: ResourcesProps): JSX.Element => {
    return (
        <div className={styles.resourcesDiv} id="resources">
            <p className={`${styles.sectionHeading} ${Work_Sans_300.className}`}>Resources</p>
            <div className={styles.resourceCards}>
                {props.resources.map((resource, index) => {
                    return (
                        <ResourceSlideAnim
                            key={index}
                            title={resource.title}
                            description={resource.description}
                            link={resource.link}
                        />
                    );
                })}
            </div>
        </div>
    );
};