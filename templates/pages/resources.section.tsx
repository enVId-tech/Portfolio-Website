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
    const [isEnabled, setIsEnabled] = React.useState<boolean>(false);

    const resourceCardRef: React.RefObject<HTMLDivElement> | null = React.createRef<HTMLDivElement>();
    
    // Add a slide animation to the resource cards
    React.useEffect((): void => {
        const resourceCards: NodeListOf<Element> = document.querySelectorAll(`.${styles.resourceCard}`);

        if (!resourceCardRef!.current) return;

        if (resourceCardRef!.current?.scrollLeft > 0) {
            let lastResourceCard: Element = resourceCards[resourceCards.length - 1];
            let firstResourceCard: Element = resourceCards[0];

            resourceCardRef!.current!.scrollTo({
                left: lastResourceCard.getBoundingClientRect().left,
                behavior: "smooth",
            });

            // When the scroll animation is complete, move the first resource card to the end
            lastResourceCard.addEventListener("scroll", (event: Event): void => {
                if (resourceCardRef!.current!.scrollLeft === lastResourceCard.getBoundingClientRect().left) {
                    resourceCardRef!.current!.scrollTo({
                        left: firstResourceCard.getBoundingClientRect().left,
                        behavior: "auto",
                    });
                }
            });
        }
    }, [resourceCardRef!.current?.scrollLeft]);

    return (
        isEnabled ?
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
        :
        <div className={styles.resourcesDiv2} id="resources">
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