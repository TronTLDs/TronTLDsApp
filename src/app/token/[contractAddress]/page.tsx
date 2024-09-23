"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Twitter,
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

  if (!token) return <div>Loading...</div>;

  return (
    <div className="bg-[#090920] text-white min-h-screen p-[2rem] m-[2rem]">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-xl text-gray-400 hover:text-white"
        >
          <ArrowLeft size={22} className="mr-2" />
          Back
        </button>
        <p className="text-sm text-gray-500 flex gap-1 items-center">
          <ShieldAlert size={16} />
          <span className="font-medium">
            Disclaimer: Tokens listed are not affiliated with the platform.
            Proceed at your own risk.
          </span>
        </p>
      </div>

      <div className="bg-[#151527] rounded-lg p-6 flex">
        <Image
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
              <p className="text-sm text-gray-400">
                <span className="font-medium">Created by:</span>{" "}
                <span
                  className="text-[#c1a0ff] underline font-bold cursor-pointer"
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
            <div className="flex items-center justify-between text-sm text-gray-400 mb-[1rem]">
              <div className="flex items-center">
                <p className="mr-2">
                  Contract:{" "}
                  <span className="contract text-white">
                    {token.contractAddress}
                  </span>
                </p>
                <button className="text-gray-400 hover:text-white mr-2">
                  <div className="cursor-pointer" title="Copy">
                    <Copy
                      size={16}
                      className="cursor-pointer hover:text-white text-gray-400"
                      onClick={() => {
                        handleCopy(token.contractAddress);
                      }}
                    />
                  </div>
                </button>
                <button className="text-gray-400 hover:text-white">
                  <div className="cursor-pointer" title="Tron Link">
                    <ExternalLink
                      size={16}
                      className="cursor-pointer hover:text-white text-gray-400"
                      onClick={() => {
                        handleTronLink();
                      }}
                    />
                  </div>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                {token.twitterUrl &&
                  token.twitterUrl !== "https://error-sunpump.com" &&
                  token.twitterUrl !== "https://disconnect-sunpump.com/" && (
                    <a
                      href={formatUrl(token.twitterUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <Twitter size={18} />
                    </a>
                  )}
                {token.websiteUrl &&
                  token.websiteUrl !== "https://error-sunpump.com" &&
                  token.websiteUrl !== "https://disconnect-sunpump.com/" && (
                    <a
                      href={formatUrl(token.websiteUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <Globe size={18} />
                    </a>
                  )}
                {token.telegramUrl &&
                  token.telegramUrl !== "https://error-sunpump.com" &&
                  token.telegramUrl !== "https://disconnect-sunpump.com/" && (
                    <a
                      href={formatUrl(token.telegramUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <Send size={18} />
                    </a>
                  )}
              </div>
            </div>
            <p className="description_class">{token.description}</p>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-[#202038] p-4 rounded">
              <h3 className="text-xs text-gray-400 mb-1">
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
              <p className="text-lg font-bold">
                {token.priceInTrx.toFixed(6)} TRX
              </p>
            </div>
            <div className="bg-[#202038] p-4 rounded">
              <h3 className="text-xs text-gray-400 mb-1">Marketcap</h3>
              <p className="text-lg font-bold">
                ${formatNumber(token.marketCap)}
              </p>
            </div>
            <div className="bg-[#202038] p-4 rounded">
              <h3 className="text-xs text-gray-400 mb-1">Virtual Liquidity</h3>
              <p className="text-lg font-bold">
                ${formatNumber(token.virtualLiquidity)}
              </p>
            </div>
            <div className="bg-[#202038] p-4 rounded">
              <h3 className="text-xs text-gray-400 mb-1">24H Volume</h3>
              <p className="text-lg font-bold">
                {formatNumber(token.volume24Hr)} TRX
              </p>
            </div>
            <div className="bg-[#202038] p-4 rounded">
              <h3 className="text-xs text-gray-400 mb-1">Token Created</h3>
              <p className="text-lg font-bold">
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
              "linear-gradient(13.51deg,#151527 70.81%,rgba(96,1,255,.5) 103.08%)",
            borderImageSlice: 1,
            background:
              "linear-gradient(153.51deg,#151527 70.81%,rgba(96,1,255,.5) 103.08%)",
            color: "white",
          },
        }}
      />
    </div>
  );
};

export default TokenPage;
