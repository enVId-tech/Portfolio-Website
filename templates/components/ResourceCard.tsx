/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "@/styles/resourceCard.module.scss";
import { Montserrat, Work_Sans } from "next/font/google";

interface ResourceSlideAnimProps {
    title: string;
    description: string;
    image: string;
    link: string;
}

const Work_Sans400 = Work_Sans({
    weight: "400",
    style: 'normal',
    subsets: ['latin']
});

const Montserrat400 = Montserrat({
    weight: "400",
    style: 'normal',
    subsets: ['latin']
});

const ResourceCard: React.FC<ResourceSlideAnimProps> = (props: ResourceSlideAnimProps): JSX.Element => {
    const [isEnabled, setIsEnabled] = React.useState<boolean>(false);
    const cardRef: React.RefObject<HTMLDivElement> | null = React.createRef<HTMLDivElement>();

    const setEnabledClicked = (): void => {
        setIsEnabled(!isEnabled);
        console.log(isEnabled);
    }

    // Turn off all resource cards other than the one clicked
    React.useEffect((): void => {
        const resourceCards: NodeListOf<Element> = document.querySelectorAll(`.${styles.resourceCard}`);
        const resourceCard: Element = cardRef!.current!;

        if (!resourceCard) return;

        if (isEnabled) {
            resourceCards.forEach((card: Element): void => {
                if (card !== resourceCard) {
                    card.classList.add(styles.resourceCard2);
                    card.classList.remove(styles.resourceCard);
                }
            });
        } else {
            resourceCards.forEach((card: Element): void => {
                if (card !== resourceCard) {
                    card.classList.add(styles.resourceCard);
                    card.classList.remove(styles.resourceCard2);
                }
            });
        }
    }, [isEnabled]);

    return (
        isEnabled ?
            <div className={styles.resourceCard} id="resources" onClick={setEnabledClicked} ref={cardRef}>
                <img src={props.image} width={50} height={50} className={styles.image} />
                <h3 className={`${styles.title} ${Work_Sans400.className}`}>{props.title}</h3>
                <p className={`${styles.description} ${Montserrat400.className}`}>{props.description}</p>
            </div>
            :
            <div className={styles.resourceCard2} id="resources" onClick={setEnabledClicked} ref={cardRef}>
                <img src={props.image} width={50} height={50} className={styles.image} />
                <h3 className={`${styles.title} ${Work_Sans400.className}`}>{props.title}</h3>
            </div>
    );
};

export default ResourceCard;