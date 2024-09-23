"use client";
import React, { useEffect, useState } from "react";
import { Twitter, Globe, Send, MoveUp, MoveDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../css/IndToken.css";
import "../css/Home.css";

// Define the type for the trendingToken data
interface trendingToken {
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

const Hero: React.FC = () => {
  // State to store the trendingToken data
  const [trendingToken, setTrendingToken] = useState<trendingToken | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const response = await fetch("/api/getKingOfHill");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`
          );
        }
        const result = await response.json();
        setTrendingToken(result.data.tokens[0]);
        setLoading(false);
      } catch (err: unknown) {
        console.error("Error fetching data:", err); // Log the actual error
        
        if (err instanceof Error) {
            setError(err.message); // Access message if it's an Error object
        } else {
            setError(String(err)); // Fallback in case it's not an Error object
        }
    
        setLoading(false);
    }    
    };

    fetchTrendingData();
  }, []);

  const truncateAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatUrl = (url: string): string => {
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M"; // If number is 1 million or more
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + "k"; // If number is 1 thousand or more
    } else {
      return num.toFixed(2); // Otherwise, just round to two decimal places
    }
  };

  const handleCardClick = (token: trendingToken) => {
    router.push(`/token/${token.contractAddress}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home-wrapper flex justify-between p-6">
      <div className="text_left_container flex flex-col justify-center gap-3">
        <h1 className="text-[30px]">MetaTLDs</h1>
        <p>Permissionless TLDs and Domains: One Click Away</p>
        <p>
          Create and manage your own TLDs with ease. Stake ETH, deploy with one
          click, and enjoy transparent, decentralized domain registration and
          management, without the need for central approval or developers.
        </p>
      </div>
      <div className="trending_data_container flex items-center justify-center">
        <div className="_badge_container">MetaTLDs: Illuminate the Peak</div>

        <div className="_card_container">
          <div className="_card_data">
            {/* Display fetched API data here */}
            {trendingToken && (
              <div
                className="bg-[#151527] rounded-lg _card_child_container"
                onClick={() => handleCardClick(trendingToken)}
              >
                <div className="relative">
                  <Image
                    src={trendingToken.logoUrl}
                    alt={trendingToken.name}
                    className="rounded-lg w-[180px] h-[180px] "
                  />
                  <div
                    className={`_price_tag_common ${
                      trendingToken.priceChange24Hr > 0
                        ? "_price_tag"
                        : `${
                            trendingToken.priceChange24Hr === 0
                              ? "_price_tag2"
                              : "_price_tag3"
                          }`
                    }`}
                  >
                    {trendingToken.priceChange24Hr}%{" "}
                    {trendingToken.priceChange24Hr > 0 ? (
                      <MoveUp size={15} strokeWidth={3} />
                    ) : trendingToken.priceChange24Hr < 0 ? (
                      <MoveDown size={15} strokeWidth={3} />
                    ) : (
                      <MoveUp size={15} strokeWidth={3} />
                    )}
                  </div>
                </div>

                <div className="right_container_trending p-4">
                  <div className="flex justify-between mb-[5px] items-center">
                    <p className="text-sm text-gray-400">
                      <span className="font-medium">Created by:</span>{" "}
                      <span
                        className="text-[#c1a0ff] underline font-medium cursor-pointer"
                        title="View in Tronscan"
                        onClick={(event) => {
                          window.open(
                            `https://tronscan.org/#/address/${trendingToken.ownerAddress}`,
                            "_blank"
                          );
                          event.stopPropagation();
                        }}
                      >
                        {truncateAddress(trendingToken.ownerAddress)}
                      </span>
                    </p>
                    <div className="flex items-center space-x-2">
                      {trendingToken.twitterUrl &&
                        trendingToken.twitterUrl !==
                          "https://error-sunpump.com" &&
                        trendingToken.twitterUrl !==
                          "https://disconnect-sunpump.com/" && (
                          <a
                            href={formatUrl(trendingToken.twitterUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white"
                            onClick={(event) => event.stopPropagation()} // Prevent parent click
                          >
                            <Twitter size={16} className="hover:scale-125" />
                          </a>
                        )}
                      {trendingToken.websiteUrl &&
                        trendingToken.websiteUrl !==
                          "https://error-sunpump.com" &&
                        trendingToken.websiteUrl !==
                          "https://disconnect-sunpump.com/" && (
                          <a
                            href={formatUrl(trendingToken.websiteUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white"
                            onClick={(event) => event.stopPropagation()} // Prevent parent click
                          >
                            <Globe size={16} className="hover:scale-125" />
                          </a>
                        )}
                      {trendingToken.telegramUrl &&
                        trendingToken.telegramUrl !==
                          "https://error-sunpump.com" &&
                        trendingToken.telegramUrl !==
                          "https://disconnect-sunpump.com/" && (
                          <a
                            href={formatUrl(trendingToken.telegramUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white"
                            onClick={(event) => event.stopPropagation()} // Prevent parent click
                          >
                            <Send size={16} className="hover:scale-125" />
                          </a>
                        )}
                    </div>
                  </div>
                  <h1 className="name_symbol_trending">
                    {trendingToken.name} (${trendingToken.symbol})
                  </h1>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-[5px]"></div>
                  <p className="description_class">
                    {trendingToken.description}
                  </p>
                  <p className="text-sm font-semibold text-gray-300 mt-[3rem]">
                    Market Cap:{" "}
                    <span className="text-[#a682e5] font-medium">
                      ${formatNumber(trendingToken.marketCap)}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
