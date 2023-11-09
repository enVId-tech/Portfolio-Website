import '../styles/globals.scss';
import { AppProps } from 'next/app';

function PersonalWebsite({ Component, pageProps }: AppProps) {
    try {
        return <Component {...pageProps} />
    } catch (error: unknown) {
        console.error(error as string);
    }
}


export default PersonalWebsite;