/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import Image from "next/image";
import styles from "@/styles/resourcesSlide.module.scss";

interface ResourceSlideAnimProps {
    title: string;
    description: string;
    image: string;
    link: string;
}

const ResourceSlideAnim: React.FC<ResourceSlideAnimProps> = (props: ResourceSlideAnimProps): JSX.Element => {
    return (
        <div className={styles.resourceCard}>
            <img src={props.image} width={50} height={50} className={styles.image} />
        </div>
    );
};

export default ResourceSlideAnim;