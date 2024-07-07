import { exportLogos } from "@/templates/ts/exportConsts"
import { ResourcesPropsType } from "@/templates/ts/exportTypes"

export const ResourcesProps: ResourcesPropsType = {
    resources: [
        {
            title: "ReactJS",
            description: "React is a JavaScript library for building user interfaces.",
            image: exportLogos.react.src,
            link: "https://reactjs.org"
        },
        {
            title: "NextJS",
            description: "Next.js is a React framework that enables functionality like server-side rendering and static site generation.",
            image: exportLogos.next.src,
            link: "https://nextjs.org"
        },
        {
            title: "NodeJS",
            description: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
            image: exportLogos.node.src,
            link: "https://nodejs.org"
        },
        {
            title: "JavaScript",
            description: "JavaScript is a programming language that conforms to the ECMAScript specification.",
            image: exportLogos.js.src,
            link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
        },
        {
            title: "MongoDB",
            description: "MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.",
            image: exportLogos.mongo.src,
            link: "https://www.mongodb.com"
        },
        {
            title: "ExpressJS",
            description: "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
            image: exportLogos.express.src,
            link: "https://expressjs.com"
        },
        {
            title: "TypeScript",
            description: "TypeScript is an open-source language which builds on JavaScript, one of the world’s most used tools, by adding static type definitions.",
            image: exportLogos.ts.src,
            link: "https://www.typescriptlang.org"
        },
        {
            title: "Python",
            description: "Python is a programming language that lets you work quickly and integrate systems more effectively.",
            image: exportLogos.python.src,
            link: "https://www.python.org"
        },
        {
            title: "Java",
            description: "Java is a class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.",
            image: exportLogos.java.src,
            link: "https://www.java.com"
        },
        {
            title: "C++",
            description: "C++ is a general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language, or 'C with Classes'.",
            image: exportLogos.cpp.src,
            link: "https://www.cplusplus.com"
        },
        {
            title: "HTML",
            description: "HTML is the standard markup language for documents designed to be displayed in a web browser.",
            image: exportLogos.html.src,
            link: "https://developer.mozilla.org/en-US/docs/Web/HTML"
        },
        {
            title: "SASS/SCSS",
            description: "Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.",
            image: exportLogos.scss.src,
            link: "https://sass-lang.com"
        }
    ]
}