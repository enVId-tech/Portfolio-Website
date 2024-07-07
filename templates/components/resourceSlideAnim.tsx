import React from "react";
import styles from "@/styles/resourcesSlide.module.scss";

const ResourceSlideAnim: React.FC<{ title: string; description: string; link: string }> = (props: { title: string; description: string; link: string }): JSX.Element => {
    return (
        <div className={styles.resourceCard}>
            <img src="/images/scrollDown.svg" className={styles.scrollDown} />
        </div>
    );
};

export default ResourceSlideAnim;