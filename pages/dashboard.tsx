import("@portech/invoice-dashboard");
import Head from "next/head";
import { useEffect, useRef } from "react";
import { config } from "@/utils/config";
import { useAppContext } from "@/utils/context";
import { InvoiceDashboardProps } from "@/types";
import { useConnectWallet } from "@web3-onboard/react";
import { useProject } from "@/customComponents/projectProvider";
import useStore from "@/hooks/useCredentials";
import { useRouter } from "next/router";
import { useAuth } from "@/customComponents/isLoggedInProvider";

export default function InvoiceDashboard() {
  const router = useRouter();
  const [{ wallet }] = useConnectWallet();
  const { requestNetwork } = useAppContext();
  const dashboardRef = useRef<InvoiceDashboardProps>(null);
  const { loggedIn } = useAuth();
  const { projectName } = useProject();
  // console.log("Hello ",projectName);

  useEffect(() => {
    if (!loggedIn) {
      router.push("/register");
    }
    if (dashboardRef.current) {
      dashboardRef.current.config = config;
      if (projectName) {
        dashboardRef.current.projectName = projectName;
      }

      if (wallet && requestNetwork) {
        dashboardRef.current.wallet = wallet;
        dashboardRef.current.requestNetwork = requestNetwork;
        if (projectName) {
          dashboardRef.current.projectName = projectName;
        }
      }
    }
  }, [wallet, requestNetwork, projectName, loggedIn, router]);

  return (
    <>
      <Head>
        <title>Request Payment</title>
      </Head>
      <div className="container m-auto w-[100%]">
        <invoice-dashboard ref={dashboardRef} />
      </div>
    </>
  );
}
