import React from 'react';
import styles from '@/styles/footer.module.scss';
import { Work_Sans } from 'next/font/google';
import { FooterProps } from '../ts/exportInterfaces.ts';

const Work_Sans_300 = Work_Sans({
    weight: "300",
    style: 'normal',
    subsets: ['latin']
});

const Footer: React.FC<FooterProps> = (props: FooterProps): JSX.Element => {
    const latestUpdate: string = `Latest Update: ${props.dateUpdated}, Revision ${props.latestUpdate}`;
    const brandName: string = props.brandName;
    try {
        return (
            <div className={`${styles.footerDiv}`}>
                <div className={`${styles.footerLeft}`}>
                    <p className={`${styles.name} ${Work_Sans_300.className}`}>Erick Tran</p>
                </div>
                <div className={`${styles.footerRight} ${Work_Sans_300.className}`}>
                    <p className={`${styles.brandName} ${Work_Sans_300.className}`}>{brandName}</p>
                    <p className={`${styles.latestUpdateLabel} ${Work_Sans_300.className}`}>{latestUpdate}</p>
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