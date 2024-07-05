import React from "react";
import Head from "next/head";
import TitleDiv from "@/templates/pages/titleDiv.section";

const HomePage: React.FC = (): React.JSX.Element => {
    return (
        <div className={'placeholder'}>
            <Head>
            <title>enVId Tech - Home Page</title>
            </Head>
            <TitleDiv title={`Hi! I'm Erick!`} />
        </div>
    );
};