import './globals.css';  // Adjusted path to match your file location
import type { AppProps } from 'next/app'
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";

function MyApp({ Component, pageProps }: AppProps) {
 <AuthKitProvider><Component {...pageProps} /></AuthKitProvider>;
}

export default MyApp
