import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  trustWallet,
  zerionWallet,
  rainbowWallet,
  phantomWallet,
  ChainId,
} from "@thirdweb-dev/react";
import { ToastContainer } from "react-toastify";

import { env } from "@/env.mjs";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const chainId =
  env.NEXT_PUBLIC_NODE_ENV !== "production" ? ChainId.Mumbai : ChainId.Polygon;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThirdwebProvider
        activeChain={chainId}
        clientId="YOUR_CLIENT_ID"
        supportedWallets={[
          metamaskWallet(),
          coinbaseWallet(),
          walletConnect(),
          trustWallet(),
          zerionWallet(),
          rainbowWallet(),
          phantomWallet(),
        ]}
      >
        <main className="bg-background">
          <Component {...pageProps} />
        </main>
        <ToastContainer />
      </ThirdwebProvider>
    </ThemeProvider>
  );
}

export default MyApp;
