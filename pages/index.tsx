import Head from 'next/head';
import React from 'react';

const HomePage: React.FC = (): JSX.Element => {
    try {
        return (
            <div>
                <Head>
                    <title>enVId Tech - Home Page</title>
                </Head>
                <h1>Home Page</h1>
                <h6>Latest Update: 11-9-2023, Revision 0.0.01</h6>
            </div>
        )
    } catch (err: unknown) {
        console.error(err as string);
        setTimeout((): void => {
            window.location.href = '/';
        }, 2000);
        return (
            <Head>
                <title>Redirecting...</title>
            </Head>
        )
    }
};

export default HomePage;