"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../../assets/PumpDomains.png";
import { CircleUser } from "lucide-react";
import { WalletActionButton } from "@tronweb3/tronwallet-adapter-react-ui";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { useRouter } from "next/navigation";
import "../css/Navbar.css";

const Navbar = () => {
  const { address, connected } = useWallet();
  const [primaryDomain, setPrimaryDomain] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPrimaryDomain = async () => {
      if (connected && address) {
        setIsLoading(true); // Start loading
        try {
          const response = await fetch(
            `/api/get-primary-domain?ownerAddress=${address}`
          );
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

  const handleShowAllTlds = () => {
    router.push("/allTLDs");
  };

  return (
    <div className="border-b-2 border-gray-700 hidden lg:block bg-gradient-to-b from-[#0a1f0a] to-[#1a2f1a]">
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
          <div className="flex items-center gap-5">
            <div className="w-[120px]">
              {connected ? (
                <a href={href_link}>
                  <div className="flex items-center gap-[5px] p-3 px-6 text-white font-medium border-2 border-gray-300 rounded-lg cursor-pointer _btnNavbar">
                    <CircleUser strokeWidth={2} />
                    <span className="font-medium">Profile</span>
                  </div>
                </a>
              ) : (
                <div className="relative group">
                  <div
                    className="flex items-center gap-[5px] p-3 px-6 text-white font-medium border-2 border-gray-500 rounded-lg cursor-not-allowed"
                    onClick={(e) => e.preventDefault()}
                  >
                    <CircleUser strokeWidth={2} />
                    <span className="font-medium">Profile</span>
                  </div>
                  <div className="absolute invisible group-hover:visible bg-[#1f1f3b] text-white text-sm rounded-md py-2 px-4 -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    Please connect your wallet first
                  </div>
                </div>
              )}
            </div>

            <div>
              <button onClick={handleShowAllTlds}>
                <div className="flex items-center gap-[5px] p-3 px-6 text-white font-medium border-2 border-gray-300 rounded-lg cursor-pointer _btnNavbar">
                  <span className="font-medium">All Deployed TLDs</span>
                </div>
              </button>
            </div>

            <div className="w-[200px]">
              {connected ? (
                <WalletActionButton className="flex items-center p-3 px-6 text-white font-medium bg-[#5fc71e] hover:border-white border-2 hover:bg-[#4ca613] rounded-lg cursor-pointer tron_btn w-full justify-center">
                  {isLoading ? (
                    <div className="flex justify-center items-center w-24">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#A8F981]"></div>
                    </div>
                  ) : (
                    <span className="text-sm font-bold">
                      {primaryDomain
                        ? primaryDomain
                        : truncateAddress(address || "")}
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
