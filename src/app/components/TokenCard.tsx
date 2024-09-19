// src/api/components/TokenCard.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  SearchCode,
  MoveUp,
  ArrowUp,
  MoveDown,
  Copy,
  Twitter,
  Globe,
  Send,
  RefreshCw,
  RotateCw,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  X,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import copy from "copy-to-clipboard";
import CheckboxApp from "./Checkbox";
import "../css/TokenCard.css";

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
  twitterUrl: string;
  telegramUrl: string;
  websiteUrl: string;
}

const TokenCard: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("tokenCreatedInstant:DESC");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const router = useRouter();

  const handleCardClick = (token: Token) => {
    router.push(`/token/${token.contractAddress}`);
  };

  const fetchTokens = useCallback(async (
    page: number,
    sort = sortOption,
    query = debouncedSearchQuery
  ) => {
    try {
      setLoading(true);

      const encodedQuery = query.replace(/\s/g, "+");
      const apiUrl = encodedQuery
        ? `/api/proxy?query=${encodedQuery}&page=${page}&sort=${sort}`
        : `/api/proxy?page=${page}&sort=${sort}`;

      const res = await fetch(apiUrl);
      const result = await res.json();
      const newTokens = result.data.tokens;

      if (newTokens.length === 0) {
        setHasMore(false);
      } else {
        setTokens((prevTokens) => {
          return page === 1 ? newTokens : [...prevTokens, ...newTokens];
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      setLoading(false);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
    setTokens([]);
    fetchTokens(1, sortOption, debouncedSearchQuery);
  }, [debouncedSearchQuery, sortOption, fetchTokens]);

  const options = [
    "Launched Time",
    "Trading Volume",
    "Market Cap",
    "24H Price Increase",
  ];

  const handleSelect = (option: string) => {
    setSelectedOption(option);

    const sortMapping: { [key: string]: string } = {
      "Launched Time": "tokenCreatedInstant",
      "Trading Volume": "volume24Hr",
      "Market Cap": "marketCap",
      "24H Price Increase": "priceChange24Hr",
    };

    const newSortOption = `${sortMapping[option]}:${sortDirection}`;
    setSortOption(newSortOption);
    setIsOpen(false);
  };

  const handleRefresh = () => {
    setPage(1);
    setTokens([]);
    fetchTokens(1, sortOption);
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === "DESC" ? "ASC" : "DESC";
    setSortDirection(newDirection);
    const [field] = sortOption.split(":");
    setSortOption(`${field}:${newDirection}`);
  };

  // Utility function to format large numbers with 'k' or 'm' and round to two decimal places
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M"; // If number is 1 million or more
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + "k"; // If number is 1 thousand or more
    } else {
      return num.toFixed(2); // Otherwise, just round to two decimal places
    }
  };

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("✅ Copied 🎊🎉");
  };

  const loadMoreTokens = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchTokens(nextPage, sortOption, debouncedSearchQuery); // Fetch the next set of tokens
      return nextPage;
    });
  };

  // Ensure the URL has the protocol
  const formatUrl = (url: string): string => {
    return url.startsWith("http") ? url : `https://${url}`;
  };

  return (
    <div className="p-6">
      <h1 className="mb-3">Tokens data</h1>
      <div className="flex justify-between">
        <div className="search-bar w-[30%] relative">
          <SearchCode className="ml-[20px]" />
          <input
            type="text"
            className="search-input p-2"
            placeholder="Search for tokens"
            value={searchQuery}
            onChange={handleSearchChange} // Call handleSearchChange on input
          ></input>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-[13px] top-1/2 transform -translate-y-1/2"
              title="Clear search"
            >
              <X size={17} className="text-gray-400 font-bold hover:text-white hover:scale-125" />
            </button>
          )}
        </div>
        <div className="flex gap-5 items-center">
          <div className="relative inline-block text-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex justify-center items-center w-48 px-4 py-2 rounded-md shadow-sm *:focus:outline-none dropdown-container truncate"
            >
              {selectedOption || "Launched Time"}
              <svg
                className={`w-5 h-5 ml-2 transform transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.292 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute z-10 mt-2 w-48 rounded-full shadow-lg">
                <ul className="rounded-full">
                  {options.map((option, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleSelect(option)}
                        title={`${option}`}
                        className={`block w-full px-4 py-2 text-center dropdown-container2 ${
                          option === selectedOption
                            ? "text-[#b482ff]"
                            : "text-white"
                        }`}
                      >
                        <span className="hover:scale-110">{option}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <CheckboxApp />
          <button
            onClick={toggleSortDirection}
            className="direction_sort p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            title={`Sort ${
              sortDirection === "DESC" ? "Ascending" : "Descending"
            }`}
          >
            {sortDirection === "DESC" ? (
              <ArrowUpNarrowWide size={20} />
            ) : (
              <ArrowDownWideNarrow size={20} />
            )}
          </button>
          <button
            onClick={handleRefresh}
            className="refresh p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            title="Refresh"
          >
            <RotateCw size={20} className="refreshIcon" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-[18px]">
        {tokens.map((token, index) => (
          <div
            key={token.id}
            onClick={() => handleCardClick(token)}
            className="_card token-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer relative h-[468px]"
          >
            <img
              src={token.logoUrl}
              alt={token.name}
              className="w-full h-[240px] rounded-md mb-4"
            />

            <div
              className={`_price_tag_common ${
                token.priceChange24Hr > 0
                  ? "_price_tag"
                  : `${
                      token.priceChange24Hr === 0
                        ? "_price_tag2"
                        : "_price_tag3"
                    }`
              }`}
            >
              {token.priceChange24Hr}%{" "}
              {token.priceChange24Hr > 0 ? (
                <MoveUp size={15} strokeWidth={3} />
              ) : token.priceChange24Hr < 0 ? (
                <MoveDown size={15} strokeWidth={3} />
              ) : (
                <MoveUp size={15} strokeWidth={3} />
              )}
            </div>

            <div className="pt-[4px] px-[16px] pb-[16px] flex flex-col gap-[8px]">
              <div className="text-gray-400 flex justify-between items-center">
                <div className="flex gap-1 items-center">
                  <span className="text-gray-100 text-[12px]">
                    Created by:{" "}
                  </span>
                  <span className="text-orange-500 text-[12px]">
                    {token.ownerAddress.slice(0, 3) +
                      "...." +
                      token.ownerAddress.slice(-3)}
                  </span>
                  <div className="cursor-pointer" title="Copy">
                    <Copy
                      size={12}
                      className="cursor-pointer hover:text-white text-gray-400 hover:scale-125"
                      onClick={(event) => {
                        event.stopPropagation(); // Prevent the outer onClick from firing
                        handleCopy(token.ownerAddress);
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(token.twitterUrl && token.twitterUrl !== "https://error-sunpump.com" && token.twitterUrl !== "https://disconnect-sunpump.com/") && (
                    <button
                      className="text-gray-400 hover:text-white"
                      onClick={(event) => event.stopPropagation()} // Prevent parent click
                    >
                      <a
                        href={formatUrl(token.twitterUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter size={16} className="hover:scale-125" />
                      </a>
                    </button>
                  )}
                  {(token.websiteUrl && token.websiteUrl !== "https://error-sunpump.com" && token.websiteUrl !== "https://disconnect-sunpump.com/") && (
                    <button
                      className="text-gray-400 hover:text-white"
                      onClick={(event) => event.stopPropagation()} // Prevent parent click
                    >
                      <a
                        href={formatUrl(token.websiteUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe size={16} className="hover:scale-125" />
                      </a>
                    </button>
                  )}
                  {(token.telegramUrl && token.telegramUrl !== "https://error-sunpump.com" && token.telegramUrl !== "https://disconnect-sunpump.com/") && (
                    <button
                      className="text-gray-400 hover:text-white"
                      onClick={(event) => event.stopPropagation()} // Prevent parent click
                    >
                      <a
                        href={formatUrl(token.telegramUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Send size={16} className="hover:scale-125" />
                      </a>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-1 items-center mt-[-6px]">
                <span className="text-gray-100 text-[12px]">
                  Contract Address:{" "}
                </span>
                <span className="text-orange-500 text-[12px]">
                  {token.contractAddress.slice(0, 3) +
                    "...." +
                    token.contractAddress.slice(-4)}
                </span>
                <div className="cursor-pointer" title="Copy">
                  <Copy
                    size={12}
                    className="cursor-pointer hover:text-white text-gray-400 hover:scale-125"
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent the outer onClick from firing
                      handleCopy(token.contractAddress);
                    }}
                  />
                </div>
              </div>

              <h3 className="text-md font-bold text-white">
                {token.name}{" "}
                <span className="text-gray-300 font-bold">
                  (${token.symbol})
                </span>
              </h3>

              <div className="h-16 overflow-hidden">
                <p className="text-sm text-gray-400 line-clamp-3 mt-2">
                  {token.description}
                </p>
              </div>

              <p className="text-sm font-semibold text-gray-300 mt-[13px]">
                Market Cap:{" "}
                <span className="text-[#a682e5] font-medium">
                  ${formatNumber(token.marketCap)}
                </span>
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
      <Toaster
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

export default TokenCard;
