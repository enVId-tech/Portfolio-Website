import React from 'react';
import styles from '@/styles/topnavbar.module.scss';
import { Work_Sans } from 'next/font/google';
import { exportLogos } from '@/modules/exportConsts';

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

const TopNavBar: React.FC = (): React.JSX.Element => {
    const [isScrolled, setIsScrolled] = React.useState<boolean>(false);

    const navbarRef: React.RefObject<HTMLElement> = React.createRef<HTMLElement>();

    React.useEffect(() => {
        // // Add event listeners for scrolling
        // window.addEventListener("scroll", () => {
        //     // If the user scrolls past a certain point, change the navbar's background color
        //     if (window.scrollY >= 50) {
        //         setIsScrolled(isScrolled);
        //     } else {
        //         setIsScrolled(!isScrolled);
        //     }
        // });

        // if (isScrolled) {
        //     navbarRef.current!.classList.add(styles.topNavbarScrolled);
        // }
    }, []);

    return (
        <section className={`${styles.topNavbar}`} ref={navbarRef}>
            <div className={`${styles.topNavbarLeft}`}>
                <p className={`${styles.navbarItem} ${Work_Sans_300.className}`}>Home</p>
                <p className={`${styles.navbarItem} ${Work_Sans_300.className}`}>About</p>
                <p className={`${styles.navbarItem} ${Work_Sans_300.className}`}>Projects</p>
                <p className={`${styles.navbarItem} ${Work_Sans_300.className}`}>Contact</p>
            </div>
            <div className={`${styles.topNavbarRight}`}>
            <img src={`${exportLogos.enVId.src}`} width={30} height={30} className={styles.navbarLogo} onClick={() => window.location.href = "/"}/>
            <p className={`${styles.navbarItem} ${Work_Sans_300.className}`}>Erick Tran</p>
            </div>
        </section>
    )
};

export default TopNavBar;