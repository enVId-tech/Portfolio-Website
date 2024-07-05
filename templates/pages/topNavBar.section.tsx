import React from "react";
import styles from "@/styles/topNavBar.module.scss";
import { Work_Sans } from "next/font/google";

const WorkSans300 = Work_Sans({
    weight: "300",
    style: "normal",
    subsets: ["latin"]
})

const WorkSans500 = Work_Sans({
    weight: "500",
    style: "normal",
    subsets: ["latin"]
})

const TopNavBar: React.FC = (): React.JSX.Element => {
    return (
        <div className={styles.topNavBar}>
            <h1 className={styles.title}>enVId Tech</h1>
            <nav className={styles.nav}>
                <ul>
                    <li><a href={'#'}>Home</a></li>
                    <li><a href={'#'}>About</a></li>
                    <li><a href={'#'}>Projects</a></li>
                    <li><a href={'#'}>Contact</a></li>
                </ul>
            </nav>
        </div>
    );
}

export default TopNavBar;