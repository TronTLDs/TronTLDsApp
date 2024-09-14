'use client'
import React from "react";
import { ArrowLeft, X, Globe, Send } from "lucide-react";
import { useRouter } from "next/navigation";

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
}

interface TokenDetailPageProps {
  token: Token;
}

const TokenDetailPage: React.FC<TokenDetailPageProps> = ({ token }) => {
  const router = useRouter();

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatTRX = (num: number): string => {
    return num.toFixed(6) + " TRX";
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-gray-400"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <p className="text-xs text-gray-500">
          Disclaimer: Tokens listed are not affiliated with the platform.
          Proceed at your own risk.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-start mb-6">
          <img
            src={token.logoUrl}
            alt={token.name}
            className="w-24 h-24 rounded-lg mr-4"
          />
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">
                {token.name} (${token.symbol})
              </h1>
              <div className="flex space-x-2">
                <button className="text-gray-400">
                  <X size={20} />
                </button>
                <button className="text-gray-400">
                  <Globe size={20} />
                </button>
                <button className="text-gray-400">
                  <Send size={20} />
                </button>
              </div>
            </div>
            <p className="text-sm text-purple-400 mb-2">
              Created by: {token.ownerAddress}
            </p>
            <p className="text-sm text-gray-400 mb-2">
              Contract: {token.contractAddress}
            </p>
            <p className="text-sm text-gray-300">{token.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="text-xs text-gray-400 mb-1">
              Price {token.priceChange24Hr >= 0 ? "+" : ""}
              {token.priceChange24Hr.toFixed(2)}%
            </h3>
            <p className="text-lg font-bold">{formatTRX(token.priceInTrx)}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="text-xs text-gray-400 mb-1">Marketcap</h3>
            <p className="text-lg font-bold">{formatNumber(token.marketCap)}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="text-xs text-gray-400 mb-1">Virtual Liquidity</h3>
            <p className="text-lg font-bold">
              {formatNumber(token.virtualLiquidity)}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="text-xs text-gray-400 mb-1">24H Volume</h3>
            <p className="text-lg font-bold">
              {token.volume24Hr.toFixed(2)} TRX
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="text-xs text-gray-400 mb-1">Token Created</h3>
            <p className="text-lg font-bold">{token.priceChange24Hr}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailPage;
