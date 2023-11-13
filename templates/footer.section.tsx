import React from 'react';
import styles from './scss/footer.module.scss';
import { Work_Sans } from 'next/font/google';

const Work_Sans_300 = {
    weight: "300",
    style: 'normal',
    subsets: ['latin']
}

const Footer: React.FC = (): JSX.Element => {
    const latestUpdate: string = 'Latest Update: 11-11-2023, Revision 0.0.30';
    const brandName: string = 'enVId Tech';
    try {
        return (
            <div className={`${styles.footerDiv}`}>
                <div className={`${styles.footerLeft}`}>
                    <p className={`${styles.label}`}></p>
                </div>
                <div className={`${styles.footerRight}`}>
                    <p className={`${styles.brandName}`}>{brandName}</p>
                    <p>{latestUpdate}</p>
                </div>
            </div>
        )
    } catch (err: unknown) {
        console.error(err as string);

        return (
            <div>
                <div>
                    <h1>{brandName}</h1>
                    <h6>{latestUpdate}</h6>
                </div>
            </div>
        )
    }
}

export default Footer;