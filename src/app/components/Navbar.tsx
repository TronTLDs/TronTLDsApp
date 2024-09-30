'use client'
import React from "react";
import Image from "next/image";
import logo from "../../../assets/PumpDomains2.png";
import { WalletActionButton } from "@tronweb3/tronwallet-adapter-react-ui";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import '../css/Navbar.css';

const Navbar = () => {
  const { address, connected } = useWallet();

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="mx-[8px] py-5 px-16">
      <div className="relative flex items-center justify-between">
        <a href="/" aria-label="PumpDomains" title="PumpDomains">
          <Image alt="logo_img" src={logo} width={200} height={200} />
        </a>
        {connected ? (
          <div className="flex items-center space-x-2">
            <WalletActionButton className="flex items-center p-3 px-10 text-white font-medium bg-[#5fc71e] hover:border-white border-2 hover:bg-[#4ca613] rounded-lg cursor-pointer tron_btn"><span className="text-sm font-bold">{truncateAddress(address || "")}</span></WalletActionButton>
          </div>
        ) : (
          <WalletActionButton className="flex items-center p-3 px-10 text-white font-medium bg-[#5fc71e] hover:border-white border-2 hover:bg-[#4ca613] rounded-lg cursor-pointer tron_btn">Connect Wallet</WalletActionButton>
        )}
      </div>
    </div>
  );
};

export default Navbar;