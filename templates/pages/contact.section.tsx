import React from "react";
import styles from "@/styles/contact.module.scss";
import { Work_Sans } from 'next/font/google';

const Work_Sans_300 = Work_Sans({
    weight: "300",
    style: 'normal',
    subsets: ['latin']
});

const Work_Sans_500 = Work_Sans({
    weight: "500",
    style: 'normal',
    subsets: ['latin']
});

const Contact: React.FC = (): React.JSX.Element => {
    return (
        <div className={styles.contactDiv} id="contact">
            <p className={`${styles.sectionHeading} ${Work_Sans_500.className}`}>Contact Me</p>
            <div className={styles.divider}></div>
            <div className={styles.contactInfo}>
                <p className={`${styles.contactItem} ${Work_Sans_300.className}`}>Email:
                    <a href="mailto:" className={styles.contactLink}>
                    
                    </a>
                </p>
                <p className={`${styles.contactItem} ${Work_Sans_300.className}`}>GitHub:
                    <a href="" className={styles.contactLink}>
                    
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Contact;