import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.scss';

const PersonalWebsite: React.FC<AppProps> = ({ Component, pageProps }): React.JSX.Element => {
    try {
        return <Component {...pageProps} />
    } catch (error: unknown) {
        console.error(error as string);
        return <></>
    }
}


export default PersonalWebsite;