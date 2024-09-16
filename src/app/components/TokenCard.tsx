// src/api/components/TokenCard.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchCode, MoveUp, ArrowUp, MoveDown } from "lucide-react";
import CheckboxApp from "./Checkbox";
import Dropdown from "./DropDown";
import "../css/Searchbar.css";

interface Token {
  id: number;
  name: string;
  symbol: string;
  logoUrl: string;
  description: string;
  marketCap: number;
  ownerAddress: string;
  contractAddress: string;
  priceChange24Hr: number;
}

const TokenCard: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Keep track of the page number
  const [hasMore, setHasMore] = useState(true); // To disable "Load More" when no more data
  const router = useRouter();

  const handleCardClick = (token: Token) => {
    router.push(`/token/${token.contractAddress}`);
  };

  useEffect(() => {
    fetchTokens(page);
  }, [page]);

  const fetchTokens = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/proxy?page=${page}`); // Pass the page as a query param
      const result = await res.json();
      const newTokens = result.data.tokens;

      if (newTokens.length === 0) {
        setHasMore(false); // If no more tokens, disable Load More
      } else {
        // Append only unique tokens based on their ID
        setTokens((prevTokens) => {
          const tokenIds = new Set(prevTokens.map((token) => token.id)); // Create a Set of existing token IDs
          const uniqueNewTokens = newTokens.filter(
            (token: { id: number }) => !tokenIds.has(token.id)
          ); // Filter out any tokens that already exist in the list
          return [...prevTokens, ...uniqueNewTokens]; // Append only the unique tokens
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      setLoading(false);
    }
  };

  const loadMoreTokens = () => {
    setPage((prevPage) => prevPage + 1); // Increment page count on click
  };

  return (
    <div className="p-6">
      <h1 className="mb-3">Tokens data</h1>
      <div className="flex justify-between">
        <div className="search-bar mb-4 w-[30%]">
          <SearchCode className="ml-[20px]" />
          <input
            type="text"
            className="search-input p-2"
            placeholder="Search for tokens"
            value=""
          ></input>
        </div>
        <div className="flex gap-5">
          <Dropdown />
          <CheckboxApp />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tokens.map((token, index) => (
          <div
            key={token.id}
            onClick={() => handleCardClick(token)}
            className="_card token-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
          >
            <img
              src={token.logoUrl}
              alt={token.name}
              className="w-full h-[240px] rounded-md mb-4"
            />

            <div className={`_price_tag_common ${token.priceChange24Hr > 0 ? "_price_tag" : `${token.priceChange24Hr === 0 ? "_price_tag2" : "_price_tag3"}`}`}>
              {token.priceChange24Hr}%{" "}
              {token.priceChange24Hr > 0 ? (
                <MoveUp
                  size={15}
                  strokeWidth={3}
                />
              ) : token.priceChange24Hr < 0 ? (
                <MoveDown
                  size={15}
                  strokeWidth={3}
                />
              ) : (
                <MoveUp
                  size={15}
                  strokeWidth={3}
                />
              )}
            </div>
            
            <div className="p-4">
              <p className="text-gray-400 mb-2">
                Created by:{" "}
                <span className="text-orange-500">
                  {token.ownerAddress.slice(0, 4) +
                    "...." +
                    token.ownerAddress.slice(-4)}
                </span>
              </p>

              <h3 className="text-lg font-bold text-white">
                {token.name}{" "}
                <span className="text-gray-400">(${token.symbol})</span>
              </h3>
              <p className="text-sm text-gray-400 mb-2 break-words">
                {token.description}
              </p>
              <p className="font-semibold text-gray-300">
                Market Cap: ${token.marketCap.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {hasMore && (
          <button
            onClick={loadMoreTokens}
            className="flex items-center justify-center p-3 px-10 bg-blue-400 rounded-lg cursor-pointer"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
        {!hasMore && <p>No more tokens to load</p>}
      </div>
    </div>
  );
};

export default TokenCard;
