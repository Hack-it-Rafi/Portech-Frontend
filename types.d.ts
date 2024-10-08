import { IConfig } from "@portech/shared";
import type { RequestNetwork } from "@requestnetwork/request-client.js";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "invoice-dashboard": InvoiceDashboardElement;
      "create-invoice-form": CreateInvoiceFormElement;
    }
  }
}

interface InvoiceDashboardElement {
  ref?: React.Ref<InvoiceDashboardProps>;
}

interface CreateInvoiceFormElement {
  ref?: React.Ref<CreateInvoiceFormProps>;
}

interface InvoiceDashboardProps extends HTMLElement {
  config: IConfig;
  wallet: any;
  requestNetwork: RequestNetwork;
  projectName?: string;
}

interface CreateInvoiceFormProps extends HTMLElement {
  config: IConfig;
  signer: string;
  requestNetwork: RequestNetwork;
  invoiceType: string;
  projectName?: string;
}
