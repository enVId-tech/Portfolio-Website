import React from 'react';
import styles from './scss/footer.module.scss';
import { Work_Sans } from 'next/font/google';

const Work_Sans_300 = {
    weight: "300",
    style: 'normal',
    subsets: ['latin']
}

const Footer: React.FC = (): JSX.Element => {
    try {
        return (
            <div className={`${styles.footerDiv}`}>
                <div className={`${styles.footerLeft}`}>
                    <p className={`${styles.label}`}></p>
                </div>
                <div className={`${styles.footerRight}`}>
                    <p className={`${styles.brandName}`}>enVId Tech</p>
                    <p>Latest Update: 11-10-2023, Revision 0.0.01</p>
                </div>
            </div>
        )
    } catch (err: unknown) {
        console.error(err as string);

        return (
            <div>
                <div>
                    <h1></h1>
                    <h6>Latest Update: 11-10-2023, Revision 0.0.03</h6>
                </div>
            </div>
        )
    }
}

export default Footer;