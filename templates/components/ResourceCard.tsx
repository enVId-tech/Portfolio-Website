/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "@/styles/resourceCard.module.scss";
import { Montserrat, Work_Sans } from "next/font/google";

interface ResourceSlideAnimProps {
    title: string;
    description: string;
    image: string;
    link: string;
}

const Work_Sans400 = Work_Sans({
    weight: "400",
    style: 'normal',
    subsets: ['latin']
});

const Montserrat400 = Montserrat({
    weight: "400",
    style: 'normal',
    subsets: ['latin']
});

const ResourceCard: React.FC<ResourceSlideAnimProps> = (props: ResourceSlideAnimProps): JSX.Element => {
    return (
        <div className={styles.resourceCard}>
            <img src={props.image} width={50} height={50} className={styles.image} />
            <h3 className={`${styles.title} ${Work_Sans400.className}`}>{props.title}</h3>
            <p className={`${styles.description} ${Montserrat400.className}`}>{props.description}</p>
        </div>
    );
};

export default ResourceCard;