"use client";
import React from "react";
import Image from "next/image";
import logo from "../../../assets/PumpDomains.png";
import { CircleUser } from "lucide-react";
import { WalletActionButton } from "@tronweb3/tronwallet-adapter-react-ui";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import "../css/Navbar.css";

const Navbar = () => {
  const { address, connected } = useWallet();

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const href_link = `/profile/${address}`;

  return (
    <div className="border-b-2 border-gray-700">
      <div className="mx-[8px] py-5 px-16">
        <div className="relative flex items-center justify-between">
          <a href="/" aria-label="PumpDomains">
            <Image alt="logo_img" src={logo} width={200} height={200} />
          </a>
          <div className="flex items-center gap-8">
            {connected && (
              <a href={href_link}>
                <div className="flex items-center gap-[5px] p-3 px-6 text-white font-medium] hover:border-gray-300 hover:bg-slate-600 border-2 border-gray-500 rounded-lg cursor-pointer">
                  <CircleUser strokeWidth={2} />
                  <span className="font-medium">Profile</span>
                </div>
              </a>
            )}
            {connected ? (
              <div className="flex items-center space-x-2">
                <WalletActionButton className="flex items-center p-3 px-6 text-white font-medium bg-[#5fc71e] hover:border-white border-2 hover:bg-[#4ca613] rounded-lg cursor-pointer tron_btn">
                  <span className="text-sm font-bold">
                    {truncateAddress(address || "")}
                  </span>
                </WalletActionButton>
              </div>
            ) : (
              <WalletActionButton className="flex items-center p-3 px-6 text-white font-medium bg-[#5fc71e] hover:border-white border-2 hover:bg-[#4ca613] rounded-lg cursor-pointer tron_btn">
                Connect Wallet
              </WalletActionButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;