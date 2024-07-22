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
    const nameRef = React.useRef<HTMLInputElement | null>(null);
    const emailRef = React.useRef<HTMLInputElement | null>(null);
    const messageRef = React.useRef<HTMLTextAreaElement | null>(null);



    return (
        <div className={styles.contactDiv} id="contact">
            <p className={`${styles.sectionHeading} ${Work_Sans_500.className}`}>Contact Me</p>
            <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                    <p>Want to start a project or say hi? Email me at:
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=erick.tran@etran.dev" target="_blank" rel="noopener" className={`${styles.contactLink} ${Work_Sans_300.className}`}>
                        <br/>erick.tran@etran.dev
                    </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Contact;