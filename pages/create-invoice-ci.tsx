import("@portech/create-invoice-form");
import Head from "next/head";
import { useEffect, useRef } from "react";
import { config } from "@/utils/config";
import { useAppContext } from "@/utils/context";
import { CreateInvoiceFormProps } from "@/types";
import { useProject } from "@/customComponents/projectProvider";
import { useRouter } from "next/router";

export default function CreateInvoice() {
  const formRef = useRef<CreateInvoiceFormProps>(null);
  const { wallet, requestNetwork } = useAppContext();
  const { projectName } = useProject();
  const router = useRouter();

  useEffect(() => {
    if (formRef.current) {
      formRef.current.config = config;
      formRef.current.invoiceType = "CI";
      if (router.query.query) {
        formRef.current.projectName = router.query.query as string;
      }

      if (wallet && requestNetwork) {
        formRef.current.signer = wallet.accounts[0].address;
        formRef.current.requestNetwork = requestNetwork;
        if (router.query.query) {
          formRef.current.projectName = router.query.query as string;
        }
      }
    }
  }, [wallet, requestNetwork, router.query.query]);

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
