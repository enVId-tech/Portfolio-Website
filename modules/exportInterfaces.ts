import { StaticImageData } from "next/image";

interface TitleDivProps {
    titlePlate: string;
    subTitlePlate: string;
    titlePlateDelay: number;
    subTitlePlateDelay: number;
    timeBetweentitleAndSubTitle?: number;
    waitTime?: number;
}

interface ResourcesProps {
    resources: {
        title: string;
        description: string;
        image: string;
        link: string;
    }[];
}

interface ProjectsProps {
    projects: {
        title: string;
        description: string;
        embed: string;
        link: string;
        githubLink: string;
        techStack: string[];
    }[]
}

interface FooterProps {
    latestUpdate: string;
    dateUpdated: string;
    brandName: string;
}

interface PaddingElementProps {
    height: number;
}

interface AboutProps {
    aboutScrollHeight: number;
    aboutText: string[];
}

interface ResourceSlideAnimProps {
    title: string;
    description: string;
    image: string;
    link: string;
}

interface ProjectCardProps {
    title: string;
    description: string;
    embed: string;
    link: string;
    githubLink: string;
    techStack: string[];
}

interface exportConstsInterface {
    react: StaticImageData;
    next: StaticImageData;
    node: StaticImageData;
    js: StaticImageData;
    mongo: StaticImageData;
    express: StaticImageData;
    ts: StaticImageData;
    python: StaticImageData;
    java: StaticImageData;
    cpp: StaticImageData;
    html: StaticImageData;
    scss: StaticImageData;
    enVId: StaticImageData;
}

export type {
    TitleDivProps,
    ResourcesProps,
    ProjectsProps,
    FooterProps,
    PaddingElementProps,
    AboutProps,
    ResourceSlideAnimProps,
    ProjectCardProps,
    exportConstsInterface
}