import { Geist, Geist_Mono } from "next/font/google";
import { AppProps } from "next/app";
import { useEffect } from "react";
import "../styles/globals.css";

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
        <div className={`${geistSans.variable} ${geistMono.variable}`}>
            <Component {...pageProps} />
        </div>
    );
}

export default MyApp; 