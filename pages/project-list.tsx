import Head from "next/head";
import { useEffect, useState } from "react";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { useAppContext } from "@/utils/context";
import { useConnectWallet } from "@web3-onboard/react";
import { useRouter } from "next/router";
import { useProject } from "@/customComponents/projectProvider";
import { Dropdown } from "@/components/common";
import useStore from "@/hooks/useCredentials";
import { useAuth } from "@/customComponents/isLoggedInProvider";

export default function ProjectList() {
  const router = useRouter()
  const { requestNetwork } = useAppContext();
  const [{ wallet }] = useConnectWallet();
  const { loggedIn } = useAuth();
  console.log(loggedIn);

  const signer = wallet?.accounts[0]?.address;
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const { projectName, setProjectName } = useProject();

  useEffect(() => {
    if (!loggedIn) {
      router.push("/register")
    }
    const getRequests = async () => {
      try {
        const requestsData = await requestNetwork?.fromIdentity({
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: signer as string,
        });

        const uniqueProjects = new Map<string, any>();

        requestsData?.forEach((request) => {
          const data = request.getData();
          const format = data.contentData.meta.format;
          const projectName = format.split(",")[0].trim();

          if (
            data.contentData.meta.version === "RFQ" &&
            !uniqueProjects.has(projectName)
          ) {
            uniqueProjects.set(projectName, data);
          }
        });

        setFilteredRequests(Array.from(uniqueProjects.values()));
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    getRequests();
  }, [loggedIn, requestNetwork, router, signer]);

  const goToDashboard = (projectName: string) => {
    setProjectName(projectName);
    router.push("/dashboard");
  };

  const handleInvoiceRedirect = (project: string) => {
    setProjectName(project);
  };

  return (
    <>
      <Head>
        <title>Request Payment</title>
      </Head>
      <div className="container m-auto mt-20 min-h-screen  w-[100%]">
        <div className="w-[70%] mx-auto">
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="border-b-2 border-[#59D05E]">
                  <th>Created</th>
                  <th>Name</th>
                  <th>IncoTerms</th>
                  <th>Action</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((project, index) => (
                  <tr className="bg-base-200" key={index}>
                    <td>{project.contentData.creationDate}</td>
                    <td>
                      {project.contentData.meta.format.split(",")[0].trim()}
                    </td>
                    <td>
                      {project.contentData.meta.format.split(",")[1].trim()}
                    </td>
                    <td>
                      <button
                        className=""
                        onClick={() =>
                          handleInvoiceRedirect(
                            project.contentData.meta.format.split(",")[0].trim()
                          )
                        }
                      >
                        <Dropdown
                          title="Create Invoice"
                          items={[
                            {
                              name: "Dangerous Goods Form",
                              href: `/create-invoice-dgf?query=${project.contentData.meta.format
                                .split(",")[0]
                                .trim()}`,
                            },
                            {
                              name: "Proforma Invoice",
                              href: `/create-invoice-pi?query=${project.contentData.meta.format
                                .split(",")[0]
                                .trim()}`,
                            },
                            {
                              name: "Commercial Invoice",
                              href: `/create-invoice-ci?query=${project.contentData.meta.format
                                .split(",")[0]
                                .trim()}`,
                            },
                            {
                              name: "Import/Export Declaration",
                              href: `/create-invoice-iedf?query=${project.contentData.meta.format
                                .split(",")[0]
                                .trim()}`,
                            },
                            {
                              name: "Letter of Credit",
                              href: `/create-invoice-loc?query=${project.contentData.meta.format
                                .split(",")[0]
                                .trim()}`,
                            },
                            {
                              name: "Manufacturer's Declaration",
                              href: `/create-invoice-mfd?query=${project.contentData.meta.format
                                .split(",")[0]
                                .trim()}`,
                            },
                            {
                              name: "Packing List",
                              href: `/create-invoice-pl?query=${project.contentData.meta.format
                                .split(",")[0]
                                .trim()}`,
                            },
                            {
                              name: "Purchase Order",
                              href: `/create-invoice-po?query=${project.contentData.meta.format
                                .split(",")[0]
                                .trim()}`,
                            },
                            {
                              name: "Shipper's Letter of Instruction",
                              href: `/create-invoice-sli?query=${project.contentData.meta.format
                                .split(",")[0]
                                .trim()}`,
                            },
                          ]}
                        />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-success text-white"
                        onClick={() =>
                          goToDashboard(
                            project.contentData.meta.format.split(",")[0].trim()
                          )
                        }
                      >
                        Inspect Invoices
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
