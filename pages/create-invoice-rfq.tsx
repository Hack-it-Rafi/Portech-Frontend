import("@portech/create-invoice-form");
import Head from "next/head";
import { useEffect, useRef } from "react";
import { config } from "@/utils/config";
import { useAppContext } from "@/utils/context";
import { CreateInvoiceFormProps } from "@/types";
import { useRouter } from "next/router";
import useStore from "@/hooks/useCredentials";

export default function CreateInvoice() {
  const formRef = useRef<CreateInvoiceFormProps>(null);
  const { wallet, requestNetwork } = useAppContext();
  const router = useRouter();
  const { loggedIn } = useStore();

  useEffect(() => {
    // if (!loggedIn) {
    //   router.push("/register");
    // }
    if (formRef.current) {
      formRef.current.config = config;
      formRef.current.invoiceType = "RFQ";

      if (wallet && requestNetwork) {
        formRef.current.signer = wallet.accounts[0].address;
        formRef.current.requestNetwork = requestNetwork;
        formRef.current.invoiceType = "RFQ";
      }
    }
  }, [wallet, requestNetwork, loggedIn, router]);

  return (
    <>
      <Head>
        <title>Request Payment - Create an Invoice</title>
      </Head>
      <div className="container m-auto  w-[100%]">
        <create-invoice-form ref={formRef} />
      </div>
    </>
  );
}
