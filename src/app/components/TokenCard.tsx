// src/api/components/TokenCard.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  SearchCode,
  MoveUp,
  MoveDown,
  Copy,
  Globe,
  RotateCw,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  X,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import copy from "copy-to-clipboard";
import { useToken } from "../context/TokenContext";
import "../css/TokenCard.css";

interface Token {
  id: string;
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

const TokenCard = ({ }) => {
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
  const { setToken } = useToken();

  const handleCardClick = (token: Token) => {
    setToken(token); // Set the selected token globally and in localStorage
    router.push(`/token/${token.contractAddress}`);
  };

  // useEffect(() => {
  //   // Set a timer to hide the skeleton loader after 10 seconds
  //   const timer = setTimeout(() => {
  //     setLoading(false); // Hide the loader after 10 seconds
  //   }, 1000000000); // 10 seconds = 10000 milliseconds

  //   return () => clearTimeout(timer); // Clear the timer when the component unmounts
  // }, []);

  const fetchTokens = useCallback(
    async (page: number, sort = sortOption, query = debouncedSearchQuery) => {
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
    },
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  useEffect(() => {
    console.log(page);
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

  const SkeletonLoader = () => (
    <div className="_card token-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative h-[468px]">
      <div className="w-full h-[240px] bg-gray-300 rounded-t-lg mb-4 animate-pulse"></div>
      <div className="_price_tag_common _price_tag bg-gray-300 h-6 w-20 absolute top-3 right-3 rounded-full animate-pulse"></div>
      <div className="pt-[4px] px-[16px] pb-[16px] flex flex-col gap-[8px]">
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <div className="h-3 bg-gray-300 w-24 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex gap-1 items-center mt-[-6px]">
          <div className="h-3 bg-gray-300 w-32 rounded animate-pulse"></div>
        </div>
        <div className="h-5 bg-gray-300 w-3/4 rounded mt-2 animate-pulse"></div>
        <div className="h-12 mt-5">
          <div className="h-8 bg-gray-300 w-full rounded mb-1 animate-pulse"></div>
        </div>
        <div className="h-4 bg-gray-300 w-2/3 rounded mt-[8px] animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text_container mb-6 text-3xl font-medium text-white">
        Tokens Explorer
      </h2>
      <div className="search_container flex justify-between">
        <div className="search-bar w-[30%] relative -ml-[7px]">
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
              <X
                size={17}
                className="text-gray-200 font-bold hover:text-[#74ff1f] hover:scale-125"
              />
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
              <div className="absolute z-10 mt-2 w-48 border-2 rounded-md border-[#74ff1f]">
                <ul className="rounded-full">
                  {options.map((option, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleSelect(option)}
                        title={`${option}`}
                        className={`block w-full px-4 py-2 text-center dropdown-container2 ${
                          option === selectedOption
                            ? "text-[#74ff1f]"
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

      <div className="grid_container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array(24)
              .fill(null)
              .map((_, index) => <SkeletonLoader key={index} />)
          : tokens.map((token) => (
              <div
                key={token.id}
                onClick={() => handleCardClick(token)}
                className="_card token-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer relative h-[468px]"
              >
                <img
                  src={token.logoUrl}
                  alt={token.name}
                  className="w-full h-[240px] object-cover rounded-md mb-4"
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
                      <span className="text-gray-100 text-[12px] line-clamp-1">
                        Created by:{" "}
                      </span>
                      <span className="text-[#75ec2b] text-[12px]">
                        {token.ownerAddress.slice(0, 3) +
                          "...." +
                          token.ownerAddress.slice(-3)}
                      </span>
                      <div className="cursor-pointer" title="Copy">
                        <Copy
                          size={12}
                          className="cursor-pointer hover:text-[#FCFF72] text-white hover:scale-125"
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent the outer onClick from firing
                            handleCopy(token.ownerAddress);
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {token.twitterUrl &&
                        urlErrorChecker(token.twitterUrl) && (
                          <button
                            className="text-gray-200 hover:text-white"
                            onClick={(event) => event.stopPropagation()} // Prevent parent click
                          >
                            <a
                              href={formatUrl(token.twitterUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaXTwitter
                                size={14}
                                className="hover:scale-125"
                              />
                            </a>
                          </button>
                        )}
                      {token.websiteUrl &&
                        urlErrorChecker(token.websiteUrl) && (
                          <button
                            className="text-gray-200 hover:text-white"
                            onClick={(event) => event.stopPropagation()} // Prevent parent click
                          >
                            <a
                              href={formatUrl(token.websiteUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Globe size={14} className="hover:scale-125" />
                            </a>
                          </button>
                        )}
                      {token.telegramUrl &&
                        urlErrorChecker(token.telegramUrl) && (
                          <button
                            className="text-gray-200 hover:text-white"
                            onClick={(event) => event.stopPropagation()} // Prevent parent click
                          >
                            <a
                              href={formatUrl(token.telegramUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaTelegramPlane
                                size={14}
                                className="hover:scale-125"
                              />
                            </a>
                          </button>
                        )}
                    </div>
                  </div>

                  <div className="flex gap-1 items-center mt-[-6px]">
                    <span className="text-gray-100 text-[12px]">
                      Contract Address:{" "}
                    </span>
                    <span className="text-[#75ec2b] text-[12px]">
                      {token.contractAddress.slice(0, 3) +
                        "...." +
                        token.contractAddress.slice(-4)}
                    </span>
                    <div className="cursor-pointer" title="Copy">
                      <Copy
                        size={12}
                        className="cursor-pointer hover:text-[#FCFF72] text-white hover:scale-125"
                        onClick={(event) => {
                          event.stopPropagation(); // Prevent the outer onClick from firing
                          handleCopy(token.contractAddress);
                        }}
                      />
                    </div>
                  </div>

                  <h3 className="text-md font-semibold text-white line-clamp-1">
                    {token.name}{" "}
                    <span className="text-gray-100 font-semibold">
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
                    <span className="text-[#FCFF72] font-medium">
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
            className="flex items-center p-3 px-10 text-white font-medium bg-[#5fc71e] hover:border-white border-2 hover:bg-[#4ca613] rounded-lg cursor-pointer"
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

export default TokenCard;
