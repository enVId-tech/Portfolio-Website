type TitlePropsType = { titlePlate: string; subTitlePlate: string; titlePlateDelay: number; subTitlePlateDelay: number; timeBetweentitleAndSubTitle?: number; waitTime?: number; };
type AboutPropsType = { aboutScrollHeight: number; aboutText: string[]; };
type ResourcesPropsType = { resources: { title: string; description: string; image: string; link: string; }[]; };
type ProjectsPropType = { projects: { title: string; description: string; embed: string; link: string; githubLink: string; techStack: string[]; }[]; };
type FooterPropsType = { latestUpdate: string; dateUpdated: string; brandName: string; };

export type {
    TitlePropsType,
    AboutPropsType,
    ResourcesPropsType,
    ProjectsPropType,
    FooterPropsType
}