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
    const [myPathScrolled, setMyPathScrolled] = React.useState<boolean>(false);

    const onScroll = React.useCallback((): void => {
        const scrollY = window;
        console.log("scrollY: ", scrollY.scrollY);

        if (scrollY.scrollY >= props.myPathScrollHeight) {
            setMyPathScrolled(true);
        }
    }, [props.myPathScrollHeight]);

    React.useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [onScroll]);
    return (
        <div className={`${styles.myPathDiv}`}>
            <div className={`${styles.myPathMain } ${myPathScrolled ? styles.contentAnimLeft : ""}`}>
                
            </div>
        </div>
    )
};

export default MyPath;