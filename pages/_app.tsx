import "../styles/globals.css";
import type { AppProps } from "next/app";
import { DM_Sans } from "@next/font/google";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

const chainId =
  process.env.NEXT_PUBLIC_NODE_ENV !== "production" ? ChainId.Mumbai : ChainId.Polygon;

// const dmSans = DM_Sans({
//   weight: "400",
//   subsets: ["latin"],
// });


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={chainId}>
      <main className="bg-background">
        <Component {...pageProps} />
      </main>
    </ThirdwebProvider>
  );
}

export default MyApp;
