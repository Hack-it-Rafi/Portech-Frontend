import "@/styles/globals.css";
import { Montserrat } from "next/font/google";
import type { AppProps } from "next/app";
import { Navbar } from "../components";
import { Provider } from "@/utils/context";
import { init, Web3OnboardProvider } from "@web3-onboard/react";
import { onboardConfig } from "../utils/connectWallet";
import { ProjectProvider } from "@/customComponents/projectProvider";

const montserrat = Montserrat({ subsets: ["latin"] });

const wen3Onboard = init({
  connect: {
    autoConnectAllPreviousWallet: true,
  },
  ...onboardConfig,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${montserrat.className} max-w-[1300px] mx-auto`}>
      <Web3OnboardProvider web3Onboard={wen3Onboard}>
        <ProjectProvider>
          <Provider>
            <Navbar />
            <Component {...pageProps} />
          </Provider>
        </ProjectProvider>
      </Web3OnboardProvider>
    </div>
  );
}
