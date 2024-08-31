/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import { ArrowUpRight } from "@/icons";
import { Button, Dropdown } from "../common";
import { truncateAddress } from "@/utils/walletUtils";
import useStore from "@/hooks/useCredentials";

const Navbar = () => {
  const router = useRouter();
  const [{ wallet }, connect] = useConnectWallet();
  const { loggedIn } = useStore()

  const links = [
    {
      name: "All Invoices",
      href: "/dashboard",
    },
  ];

  const invoiceLinks = [
    
    {
      name: "RFQ",
      href: "/create-invoice-rfq",
    },
  ];

  const handleNavigate = () => {
    router.push("/");
  };

  return (
    <nav className="h-full flex items-center p-[20px] gap-[60px] bg-white shadow-small">
      <button onClick={handleNavigate}>
        <img
          src="/logoPortech.png"
          alt="Request Network Logo"
          className="w-[170px]"
        />
      </button>
      {router.pathname !== "/" && (
        <ul className="h-full flex gap-[60px] justify-center items-center">
          {links.map((link, index) => (
            <li className={`h-full relative text-black`} key={index}>
              <Link href={link.href}>{link.name}</Link>
              <div
                className={`${
                  router.pathname === link.href &&
                  "h-[4px] bg-green w-full absolute bottom-[-28px]"
                }`}
              ></div>
            </li>
          ))}
          <Dropdown title="Create Project" items={invoiceLinks} />
        </ul>
      )}
      <div className="flex items-center gap-[35px] ml-auto">
      {/* { loggedIn ? ( */}
          <Button
          text={
            wallet
              ? truncateAddress(wallet.accounts[0].address)
              : "Connect Wallet"
          }
          onClick={() => {
            connect();
          }}
        />
        {/* ) : (
          "Please Login"
        )} */}
      </div>
    </nav>
  );
};

export default Navbar;
