// src/api/components/TokenCard.tsx
"use client";
import React, { useState, useEffect } from "react";

interface Token {
  id: number;
  name: string;
  symbol: string;
  logoUrl: string;
  description: string;
  marketCap: number;
  ownerAddress: string;
}

const TokenCard: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Keep track of the page number
  const [hasMore, setHasMore] = useState(true); // To disable "Load More" when no more data

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tokens.map((token, index) => (
          <div
            key={token.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <img
              src={token.logoUrl}
              alt={token.name}
              className="w-full h-32 object-contain rounded-md mb-4"
            />

            {/* New Field - Created by */}
            <p className="text-gray-400 mb-2">
              Created by: <span className="text-orange-500">{token.ownerAddress.slice(0,4) + "...." + token.ownerAddress.slice(-4)}</span>
            </p>

            <h3 className="text-lg font-bold text-white">
              {token.name}{" "}
              <span className="text-gray-400">(${token.symbol})</span>
            </h3>
            <p className="text-sm text-gray-400 mb-2">{token.description}</p>
            <p className="font-semibold text-gray-300">
              Market Cap: ${token.marketCap.toLocaleString()}
            </p>
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
