"use client";
import React, { useState } from "react";
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
          <a
            href="/"
            aria-label="PumpDomains"
            // here height isssue is there so try to give height and navbar will not shift down
            className="w-[200px] h-[61px] relative"
          >
            <Image
              alt="logo_img"
              src={logo}
              objectFit="contain"
              width={200}
              height={200}
            />
          </a>
          <div className="flex items-center gap-8">
            <div className="w-[120px]">
              {" "}
              {/* Fixed width container for profile button */}
              {connected && (
                <a href={href_link}>
                  <div className="flex items-center gap-[5px] p-3 px-6 text-white font-medium hover:border-gray-300 hover:bg-slate-600 border-2 border-gray-500 rounded-lg cursor-pointer">
                    <CircleUser strokeWidth={2} />
                    <span className="font-medium">Profile</span>
                  </div>
                </a>
              )}
            </div>
            <div className="w-[200px]">
              {" "}
              {/* Fixed width container for wallet button */}
              {connected ? (
                <WalletActionButton className="flex items-center p-3 px-6 text-white font-medium bg-[#5fc71e] hover:border-white border-2 hover:bg-[#4ca613] rounded-lg cursor-pointer tron_btn w-full justify-center">
                  <span className="text-sm font-bold">
                    {truncateAddress(address || "")}
                  </span>
                </WalletActionButton>
              ) : (
                <WalletActionButton className="flex items-center p-3 px-6 text-white font-medium bg-[#5fc71e] hover:border-white border-2 hover:bg-[#4ca613] rounded-lg cursor-pointer tron_btn w-full justify-center">
                  Connect Wallet
                </WalletActionButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
