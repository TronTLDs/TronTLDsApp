"use client";
import React, { useEffect, useState } from "react";
import { Globe, MoveUp, MoveDown, BadgeHelp } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoo from "../../../assets/gold3.png";
import "../css/IndToken.css";
import { useToken } from "../context/TokenContext";
import { Tooltip } from "antd";
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
  const { setToken } = useToken();

  const handleCardClick = (token: trendingToken) => {
    setToken(token); // Set the selected token globally
    router.push(`/token/${token.contractAddress}`);
  };

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

  if (loading) {
    console.log("loading");
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home-wrapper flex justify-between pt-[1.2rem]">
      <div className="text_left_container flex flex-col justify-center gap-3">
        <h1 className="font-medium text-5xl mb-[10px] bg-clip-text text-transparent bg-gradient-to-r from-[#74ff1f] via-white to-[#469913]">
          PumpDomains
        </h1>
        <h2 className="text-xl">Effortless, Permissionless Domain Creation</h2>
        <p>
          Claim your unique domain and bring your token’s vision to life in the
          digital space. Increase token utility and market value with integrated
          domain creation and ownership features. No approvals, no limits—just a
          seamless way to manage your token and its digital presence.
        </p>
      </div>
      <div className="trending_data_container flex items-center justify-center">
        <div className="flex items-center mx-auto">
          <div className="absolute">
            <Image
              src={logoo}
              alt="logoo"
              width={60}
              height={60}
              className="block z-20"
            ></Image>
          </div>
          
          <div className="bg-black rounded p-[6px] pl-[1.7rem] ml-[2.2rem] text-white font-[18px] flex gap-1 items-center">
            <span>PumpDomains: TLD Titans Leading the Charge</span>
            <Tooltip
              title="These TLD Titans lead the memetoken revolution, being the most purchased and highly coveted on our platform. PumpDomains is decentralized and impartial, with no endorsement of meme coins. (Make sure to do your own research)!"
              placement="bottom"
            >
              <BadgeHelp
                strokeWidth={1.75}
                size={20}
                className="cursor-pointer hover:text-[#74ff1f]"
              />
            </Tooltip>
          </div>
        </div>

        <div className="_card_container">
          <div className="_card_data">
            {/* Display fetched API data and Skeleton loaders here */}
            {loading ? (
              <div className="bg-[#151527] rounded-lg _card_child_container animate-pulse">
                <div className="relative">
                  <div className="w-[180px] h-[180px] bg-gray-300 rounded-lg"></div>
                  <div className="_price_tag_common bg-gray-300 w-[70px] h-6 rounded"></div>
                </div>

                <div className="right_container_trending p-4">
                  <div className="flex justify-between mb-[5px] items-center">
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <span className="font-medium">Created by:</span>
                      <span className="bg-gray-300 rounded w-24 h-4"></span>
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gray-300 rounded"></div>
                      <div className="w-5 h-5 bg-gray-300 rounded"></div>
                      <div className="w-5 h-5 bg-gray-300 rounded"></div>
                    </div>
                  </div>

                  <div className="name_symbol_trending mt-2">
                    <div className="bg-gray-300 h-5 w-24 rounded mb-2"></div>
                  </div>

                  <p className="description_class bg-gray-300 h-8 w-full rounded mb-2 mt-[13px]"></p>

                  <p className="text-sm font-semibold text-gray-300 mt-[35px] flex items-center gap-1">
                    <span>Market Cap: </span>
                    <span className="bg-gray-300 rounded w-16 h-4"></span>
                  </p>
                </div>
              </div>
            ) : (
              trendingToken && (
                <div
                  className="bg-[#151527] rounded-lg _card_child_container fire-effect"
                  onClick={() => handleCardClick(trendingToken)}
                >
                  <div className="relative">
                    <img
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
                          className="text-[#75ec2b] underline font-medium cursor-pointer"
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
                          urlErrorChecker(trendingToken.twitterUrl) && (
                            <a
                              href={formatUrl(trendingToken.twitterUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-200 hover:text-white"
                              onClick={(event) => event.stopPropagation()} // Prevent parent click
                            >
                              <FaXTwitter
                                size={16}
                                className="hover:scale-125"
                              />
                            </a>
                          )}
                        {trendingToken.websiteUrl &&
                          urlErrorChecker(trendingToken.websiteUrl) && (
                            <a
                              href={formatUrl(trendingToken.websiteUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-200 hover:text-white"
                              onClick={(event) => event.stopPropagation()} // Prevent parent click
                            >
                              <Globe size={16} className="hover:scale-125" />
                            </a>
                          )}
                        {trendingToken.telegramUrl &&
                          urlErrorChecker(trendingToken.telegramUrl) && (
                            <a
                              href={formatUrl(trendingToken.telegramUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-200 hover:text-white"
                              onClick={(event) => event.stopPropagation()} // Prevent parent click
                            >
                              <FaTelegramPlane
                                size={16}
                                className="hover:scale-125"
                              />
                            </a>
                          )}
                      </div>
                    </div>
                    <h1 className="name_symbol_trending">
                      <span className="font-extrabold">
                        {trendingToken.name} (${trendingToken.symbol})
                      </span>
                    </h1>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-[5px]"></div>
                    <p className="description_class text-sm text-gray-400 line-clamp-2">
                      {trendingToken.description}
                    </p>
                    <p className="text-sm font-semibold text-gray-300 mt-[26px]">
                      Market Cap:{" "}
                      <span className="text-[#FCFF72] font-medium">
                        ${formatNumber(trendingToken.marketCap)}
                      </span>
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
