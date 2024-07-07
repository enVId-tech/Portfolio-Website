import React from "react";
import Image from "next/image";
import styles from "@/styles/resourcesSlide.module.scss";

const ResourceSlideAnim: React.FC<{ title: string; description: string; link: string }> = (props: { title: string; description: string; link: string }): JSX.Element => {
    return (
        <div className={styles.resourceCard}>
            <Image src="/images/scrollDown.svg" alt="Scroll Down" width={50} height={50} className={styles.image}/>
        </div>
    );
};

export default ResourceSlideAnim;