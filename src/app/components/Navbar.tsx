"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../../assets/PumpDomains.png";
import { CircleUser } from "lucide-react";
import { WalletActionButton } from "@tronweb3/tronwallet-adapter-react-ui";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import "../css/Navbar.css";

const Navbar = () => {
  const { address, connected } = useWallet();
  const [primaryDomain, setPrimaryDomain] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPrimaryDomain = async () => {
      if (connected && address) {
        setIsLoading(true); // Start loading
        try {
          const response = await fetch(`/api/get-primary-domain?ownerAddress=${address}`);
          const data = await response.json();
          
          // Check if the API response has a primary domain
          if (data.domain) {
            setPrimaryDomain(data.domain);
          }
        } catch (error) {
          console.error("Error fetching primary domain:", error);
        } finally {
          setIsLoading(false); // Stop loading
        }
      }
    };

    fetchPrimaryDomain();
  }, [connected, address]);

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
              {connected ? (
                <WalletActionButton className="flex items-center p-3 px-6 text-white font-medium bg-[#5fc71e] hover:border-white border-2 hover:bg-[#4ca613] rounded-lg cursor-pointer tron_btn w-full justify-center">
                  {isLoading ? (
                    <div className="animate-pulse h-4 w-28 bg-gray-200 rounded"></div>
                  ) : (
                    <span className="text-sm font-bold">
                      {primaryDomain ? primaryDomain : truncateAddress(address || "")}
                    </span>
                  )}
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
