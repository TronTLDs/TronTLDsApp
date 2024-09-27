"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaXTwitter } from "react-icons/fa6";
// import Image from "next/image";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Globe,
  Send,
  ShieldAlert,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import copy from "copy-to-clipboard";
import "../../css/IndToken.css";

interface Token {
  name: string;
  symbol: string;
  logoUrl: string;
  description: string;
  ownerAddress: string;
  marketCap: number;
  priceInTrx: number;
  virtualLiquidity: number;
  volume24Hr: number;
  priceChange24Hr: number;
  contractAddress: string;
  twitterUrl: string;
  telegramUrl: string;
  websiteUrl: string;
  totalSupply: number;
}

const TokenPage = () => {
  const { contractAddress } = useParams();
  const [token, setToken] = useState<Token | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTokenData = async () => {
      const res = await fetch(`/api/proxy/token/${contractAddress}`);
      const result = await res.json();
      setToken(result.data);
    };

    fetchTokenData();
  }, [contractAddress]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + "k";
    } else {
      return num.toFixed(2);
    }
  };

  const truncateAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Ensure the URL has the protocol
  const formatUrl = (url: string): string => {
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("✅ Copied 🎊🎉");
  };

  const handleTronLink = () => {
    toast("❌ There is no TronLink");
  };

  const urlErrorChecker = (url: string): boolean => {
    return (
      url !== "https://error-sunpump.com" &&
      url !== "https://error-sunpump.com/" &&
      url !== "error-sunpump.com" &&
      url !== "error-sunpump.com/" &&
      url !== "disconnect-sunpump.com" &&
      url !== "disconnect-sunpump.com/" &&
      url !== "https://disconnect-sunpump.com" &&
      url !== "https://disconnect-sunpump.com/"
    );
  };

  if (!token) return <div>Loading...</div>;

  return (
    <div className="text-white h-[100vh] p-[2rem] bg_ind_token">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-xl text-gray-400 hover:text-white"
        >
          <ArrowLeft size={22} className="mr-2" />
          Back
        </button>
        <p className="text-sm text-white flex gap-1 items-center">
          <ShieldAlert size={16} />
          <span className="font-medium">
            Disclaimer: Tokens listed are not affiliated with the platform.
            Proceed at your own risk.
          </span>
        </p>
      </div>

      <div className="bg-[#010f02] rounded-lg p-6 flex">
        <img
          src={token.logoUrl}
          alt={token.name}
          className="w-64 h-64 rounded-lg mr-6"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between mb-[12px] items-center">
              <h1 className="name_symbol">
                {token.name} (${token.symbol})
              </h1>
              <p className="text-sm text-gray-200">
                <span className="font-medium">Created by:</span>{" "}
                <span
                  className="text-[#75ec2b] underline font-medium cursor-pointer"
                  title="View in Tronscan"
                  onClick={(event) => {
                    window.open(
                      `https://tronscan.org/#/address/${token.ownerAddress}`,
                      "_blank"
                    );
                    event.stopPropagation();
                  }}
                >
                  {truncateAddress(token.ownerAddress)}
                </span>
              </p>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-300 mb-[1rem]">
              <div className="flex items-center">
                <p className="mr-2">
                  Contract:{" "}
                  <span className="contract text-white">
                    {token.contractAddress}
                  </span>
                </p>
                <button className="text-gray-300 hover:text-white mr-2">
                  <div className="cursor-pointer" title="Copy">
                    <Copy
                      size={16}
                      className="cursor-pointer hover:scale-110 hover:text-white text-gray-200"
                      onClick={() => {
                        handleCopy(token.contractAddress);
                      }}
                    />
                  </div>
                </button>
                <button className="text-gray-300 hover:text-white">
                  <div className="cursor-pointer" title="Tron Link">
                    <ExternalLink
                      size={16}
                      className="cursor-pointer hover:scale-110 hover:text-white text-gray-200"
                      onClick={() => {
                        handleTronLink();
                      }}
                    />
                  </div>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                {token.twitterUrl && urlErrorChecker(token.twitterUrl) && (
                  <a
                    href={formatUrl(token.twitterUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white hover:scale-110"
                  >
                    <FaXTwitter size={16} />
                  </a>
                )}
                {token.websiteUrl && urlErrorChecker(token.websiteUrl) && (
                  <a
                    href={formatUrl(token.websiteUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white hover:scale-110"
                  >
                    <Globe size={16} />
                  </a>
                )}
                {token.telegramUrl && urlErrorChecker(token.telegramUrl) && (
                  <a
                    href={formatUrl(token.telegramUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white hover:scale-110"
                  >
                    <Send size={16} />
                  </a>
                )}
              </div>
            </div>
            <p className="description_class text-gray-200">{token.description}</p>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-[#0e1443] p-4 rounded">
              <h3 className="text-xs text-gray-300 mb-1">
                Price{" "}
                <span
                  className={
                    token.priceChange24Hr > 0
                      ? "text-green-400"
                      : token.priceChange24Hr === 0
                      ? "text-cyan-300"
                      : "text-red-400"
                  }
                >
                  {token.priceChange24Hr >= 0 ? "+" : ""}
                  {token.priceChange24Hr.toFixed(2)}%
                </span>
              </h3>
              <p className="text-lg font-semibold">
                {token.priceInTrx.toFixed(6)} TRX
              </p>
            </div>
            <div className="bg-[#0e1443] p-4 rounded">
              <h3 className="text-xs text-gray-300 mb-1">Marketcap</h3>
              <p className="text-lg font-semibold">
                ${formatNumber(token.marketCap)}
              </p>
            </div>
            <div className="bg-[#0e1443] p-4 rounded">
              <h3 className="text-xs text-gray-300 mb-1">Virtual Liquidity</h3>
              <p className="text-lg font-semibold">
                ${formatNumber(token.virtualLiquidity)}
              </p>
            </div>
            <div className="bg-[#0e1443] p-4 rounded">
              <h3 className="text-xs text-gray-300 mb-1">24H Volume</h3>
              <p className="text-lg font-semibold">
                {formatNumber(token.volume24Hr)} TRX
              </p>
            </div>
            <div className="bg-[#0e1443] p-4 rounded">
              <h3 className="text-xs text-gray-300 mb-1">Total Supply</h3>
              <p className="text-lg font-semibold">
                {formatNumber(token.totalSupply)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster
        reverseOrder={true}
        toastOptions={{
          style: {
            border: "1px solid transparent",
            borderImage:
              "linear-gradient(13.51deg,#74ff1f 70.81%,#74ff1f 53.08%)",
            borderImageSlice: 1,
            background:
              "linear-gradient(153.51deg,#010f02 70.81%,#469913 95.08%)",
            color: "white",
          },
        }}
      />
    </div>
  );
};

export default TokenPage;
