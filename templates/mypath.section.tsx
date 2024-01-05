import React from 'react';
import styles from './scss/mypath.module.scss';
import { Work_Sans } from 'next/font/google';

const Work_Sans_300 = Work_Sans({
    weight: "300",
    style: 'normal',
    subsets: ['latin']
});

const Work_Sans_400 = Work_Sans({
    weight: "400",
    style: 'normal',
    subsets: ['latin']
});

interface MyPathProps {
    myPathScrollHeight: number;
}

const MyPath: React.FC<MyPathProps> = (props: MyPathProps): JSX.Element => {
    return (
        <div className={`${styles.myPathDiv}`}>
        </div>
    )
};

export default MyPath;