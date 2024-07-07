import React from "react";
import styles from "@/styles/resources.module.scss";
import { Work_Sans } from "next/font/google";
import ResourceCard from "@/templates/components/ResourceCard.tsx";
import { ResourcesProps } from "@/templates/ts/exportInterfaces.ts";

const Work_Sans_300 = Work_Sans({
    weight: "300",
    style: "normal",
    subsets: ["latin"],
});

const Resources: React.FC<ResourcesProps> = (props: ResourcesProps): React.JSX.Element => {
    const resourceCardRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    
    // Add a slide animation to the resource cards
    React.useEffect((): void => {
        const resourceCards: NodeListOf<Element> = document.querySelectorAll(`.${styles.resourceCards}`);

        console.log(resourceCards);

        let i: number = 0;

        resourceCards.forEach((card: Element, index: number) => {
            if (!resourceCardRef.current) {
                return;
            };

            if (resourceCardRef.current?.scrollLeft >= card.clientWidth * index - (card.clientWidth * 2)) {
                resourceCardRef.current.prepend(card);
                i++;
            }
        })
    }, [resourceCardRef!.current?.scrollLeft]);

    return (
        <div className={styles.resourcesDiv} id="resources">
            <p className={`${styles.sectionHeading} ${Work_Sans_300.className}`}>Top Resources</p>
            <div className={styles.resourceCards} ref={resourceCardRef}>
                {props.resources.map((resource, index) => {
                    return (
                        <ResourceCard
                            key={index}
                            title={resource.title}
                            description={resource.description}
                            image={resource.image}
                            link={resource.link}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Resources;