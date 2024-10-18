"use client";
import React, { useState, useEffect } from "react";
import defaultImage from "../../../assets/default_image2.png";
import { Copy } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import copy from "copy-to-clipboard";
import { useRouter } from "next/navigation";

interface TokenData {
  name: string;
  symbol: string;
  description: string;
  logoUrl: string;
  contractAddress: string;
  ownerAddress: string;
}

interface Token {
  token: TokenData;
  tronbase58Address: string;
  userAddress: string;
}

const handleCopy = (addr: string) => {
  copy(addr);
  toast("✅ Copied 🎊🎉");
};

const DomainManager = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchTokens = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/get-all-tlds");
      if (!response.ok) {
        throw new Error("Failed to fetch tokens");
      }
      const data = await response.json();

      const tokensWithAddresses = data.tokens.map((t: any) => ({
        token: t.token,
        tronbase58Address: t.tronbase58Address,
        userAddress: t.userAddress,
      }));

      setTokens(tokensWithAddresses);
    } catch (err) {
      setError("Failed to load tokens. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const TokenCard: React.FC<{ tokenData: Token }> = ({ tokenData }) => {
    const { token, tronbase58Address, userAddress } = tokenData;

    const handleRegisterDomain = () => {
      router.push(
        `/domain/${tronbase58Address}?symbol=${token.symbol}&contractAddress=${token.contractAddress}`
      );
    };

    return (
      <div
        className="bg-gradient-to-br from-[#2a3b2a] to-[#1a2b1a] rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        onClick={handleRegisterDomain}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 relative">
            <img
              src={token.logoUrl === null ? defaultImage.src : token.logoUrl}
              alt={`${token.name} logo`}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-[#A8F981] text-xl font-semibold">
              {token.name}
            </h3>
            <p className="text-gray-300 text-sm">{token.symbol}</p>
          </div>
        </div>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2 h-10">
          {token.description}
        </p>
        <div className="space-y-2">
          <div className="flex gap-1 items-center text-gray-300 text-sm">
            <span className="font-medium text-[#A8F981]">
              Contract Address:{" "}
            </span>
            <span className="text-white text-[12px]">
              {token.contractAddress.slice(0, 3) +
                "...." +
                token.contractAddress.slice(-4)}
            </span>
            <div className="cursor-pointer" title="Copy">
              <Copy
                size={12}
                className="cursor-pointer hover:text-[#FCFF72] text-white hover:scale-125"
                onClick={(event) => {
                  event.stopPropagation();
                  handleCopy(token.contractAddress);
                }}
              />
            </div>
          </div>

          {/* <div className="flex gap-1 items-center text-gray-300 text-sm">
            <span className="font-medium text-[#A8F981]">Owner Address: </span>
            <span className="text-white text-[12px]">
              {token.ownerAddress.slice(0, 3) +
                "...." +
                token.ownerAddress.slice(-4)}
            </span>
            <div className="cursor-pointer" title="Copy">
              <Copy
                size={12}
                className="cursor-pointer hover:text-[#FCFF72] text-white hover:scale-125"
                onClick={(event) => {
                  event.stopPropagation();
                  handleCopy(token.ownerAddress);
                }}
              />
            </div>
          </div> */}

          <div className="flex gap-1 items-center text-gray-300 text-sm">
            <span className="font-medium text-[#A8F981]">
              Deployed Token Address:
            </span>
            <span className="text-white text-[12px]">
              {tronbase58Address.slice(0, 6)}...{tronbase58Address.slice(-4)}
            </span>
            <div className="cursor-pointer" title="Copy">
              <Copy
                size={12}
                className="cursor-pointer hover:text-[#FCFF72] text-white hover:scale-125"
                onClick={(event) => {
                  event.stopPropagation();
                  handleCopy(tronbase58Address);
                }}
              />
            </div>
          </div>

          <div className="flex gap-1 items-center text-gray-300 text-sm">
            <span className="font-medium text-[#A8F981]">User Address:</span>
            <span className="text-white text-[12px]">
              {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </span>
            <div className="cursor-pointer" title="Copy">
              <Copy
                size={12}
                className="cursor-pointer hover:text-[#FCFF72] text-white hover:scale-125"
                onClick={(event) => {
                  event.stopPropagation();
                  handleCopy(userAddress);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8 bg-[#1a1a1a]">
      <Toaster
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
      <div className="max-w-6xl mx-auto space-y-12">
        <section>
          <h2 className="text-[#A8F981] text-3xl font-semibold mb-8 text-center">
            TLDs Deployed On Our Platform
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-[#A8F981]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
              {tokens.map((tokenData, index) => (
                <TokenCard key={index} tokenData={tokenData} />
              ))}
            </div>
          )}
        </section>
      </div>
      <div className="flex items-center justify-center mt-12">
        <button
          onClick={fetchTokens}
          disabled={isLoading}
          className={`flex items-center p-4 px-8 text-white font-medium bg-gradient-to-r from-[#5fc71e] to-[#4ca613] hover:from-[#4ca613] hover:to-[#3b8a0f] rounded-lg transition-all duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
          }`}
        >
          {isLoading ? "Loading..." : "Refresh Tokens"}
        </button>
      </div>
    </div>
  );
};

export default DomainManager;
