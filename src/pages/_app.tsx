import { Geist, Geist_Mono } from "next/font/google";
import { AppProps } from "next/app";
import { useEffect } from "react";
import Head from "next/head";
import "../styles/globals.css";
import { BountyProvider } from '../context/BountyContext';
import Navbar from '../components/Navbar';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

function MyApp({ Component, pageProps }: AppProps) {
    // Force dark mode
    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    return (
        <BountyProvider>
            <Navbar />
            <div className={`${geistSans.variable} ${geistMono.variable}`}>
                <Head>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        /* Fix for blurry pink text */
                        .timelineStatus,
                        .value,
                        .timelineItem:before,
                        .timelineItem,
                        .bountyDetail::before,
                        .navLink {
                            text-rendering: geometricPrecision !important;
                            -webkit-font-smoothing: antialiased !important;
                            -moz-osx-font-smoothing: grayscale !important;
                            font-weight: 600 !important;
                            transform: translateZ(0) !important;
                            backface-visibility: hidden !important;
                            will-change: transform !important;
                            color: #FF0080 !important;
                        }
                    `}} />
                </Head>
                <Component {...pageProps} />
            </div>
        </BountyProvider>
    );
}

export default MyApp; 