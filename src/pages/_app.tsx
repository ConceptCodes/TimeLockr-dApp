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

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

import { env } from "@/env.mjs";

import "../styles/globals.css";

const chainId = ChainId.Polygon;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThirdwebProvider
        activeChain="polygon"
        clientId={env.NEXT_PUBLIC_THIRD_WEB_CLIENT_ID}
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
        <Toaster />
      </ThirdwebProvider>
    </ThemeProvider>
  );
}

export default MyApp;
