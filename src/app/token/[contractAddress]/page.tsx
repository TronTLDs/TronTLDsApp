"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaXTwitter } from "react-icons/fa6";
// import Image from "next/image";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Globe,
  Send,
  ShieldAlert,
  Info,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import copy from "copy-to-clipboard";
import { useToken } from "@/app/context/TokenContext";
import fallback_img from "../../../../assets/default_image2.png";
import { X, ChevronRight, CircleArrowRight } from "lucide-react";
import "../../css/IndToken.css";
import "../../css/RegisterTLD.css";

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

interface StoredToken {
  userAddress: string;
  token: {
    name: string;
    symbol: string;
    description: string;
    logoUrl: string;
    contractAddress: string;
    ownerAddress: string;
  };
  tronbase58Address: string;
}

const TokenPage = () => {
  const { contractAddress } = useParams();
  const router = useRouter();
  const [token, setToken] = useState<Token | null>(null);
  const { token: contextToken } = useToken();
  const [storedToken, setStoredToken] = useState<StoredToken | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(true); // Set to true to open on page load
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Automatically open the pop-up on page load
    setIsOpen(true);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    };
    if (setIsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  useEffect(() => {
    const fetchTokenData = async () => {
      if (contextToken) {
        setToken(contextToken);
        // Fetch stored token data
        console.log(contractAddress);
        setIsLoading(true); // Start loading
        const storedRes = await fetch(`/api/get-token/${contractAddress}`);
        const storedResult = await storedRes.json();
        if (storedResult.token) {
          setStoredToken(storedResult.token);
        }
        setIsLoading(false); // End loading
      } else if (contractAddress) {
        try {
          setIsLoading(true); // Start loading
          const res = await fetch(`/api/proxy/token/${contractAddress}`);
          const result = await res.json();
          setToken(result.data);

          // Fetch stored token data
          const storedRes = await fetch(`/api/get-token/${contractAddress}`);
          const storedResult = await storedRes.json();
          if (storedResult.token) {
            console.log(storedResult.token);
            setStoredToken(storedResult.token);
          }
        } catch (error) {
          console.error("Error fetching token data:", error);
          toast.error("Failed to load token data");
        } finally {
          setIsLoading(false); // End loading
        }
      }
    };

    fetchTokenData();
  }, [contextToken, contractAddress]);

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

  const handleDomainAction = () => {
    if (isLoading) {
      // Don't do anything if still loading
      return;
    }

    if (storedToken) {
      // Logic for registering domain
      router.push(
        `/domain/${storedToken.tronbase58Address}?symbol=${storedToken.token.symbol}&contractAddress=${contractAddress}`
      );
    } else {
      // Logic for deploying TLD
      handlePurchaseDomain();
    }
  };

  const handlePurchaseDomain = () => {
    if (token) {
      const formattedName = token.name.replace(/\s+/g, "").toLowerCase();
      const formattedSymbol = token.symbol.replace("$", "").toLowerCase();
      router.push(
        `/purchaseDomain/${formattedName}?symbol=${formattedSymbol}&contractAddress=${contractAddress}`
      );
    }
  };

  // const handleDomainPage = () => {
  //   router.push("/domain");
  // };

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

      {!token ? (
        <div className="bg-[#010f02] rounded-lg p-6 flex">
          <div className="w-64 h-64 rounded-lg mr-6 bg-gray-400 animate-pulse"></div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between mb-[20px] items-center">
                <div className="w-64 h-7 bg-gray-400 rounded animate-pulse mt-2"></div>
                <div className="w-36 h-4 bg-gray-400 rounded animate-pulse mt-2"></div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300 mb-[20px]">
                <div className="w-96 h-4 bg-gray-400 rounded animate-pulse"></div>
                <div className="w-4 h-4 bg-gray-400 rounded-[4px] animate-pulse"></div>
                <div className="w-4 h-4 bg-gray-400 rounded-[4px] animate-pulse"></div>
              </div>
              <div className="h-12 bg-gray-400 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-gray-400 p-4 rounded animate-pulse">
                <div className="w-20 h-4 bg-gray-400 rounded mb-2"></div>
                <div className="w-16 h-6 bg-gray-400 rounded"></div>
              </div>
              <div className="bg-gray-400 p-4 rounded animate-pulse">
                <div className="w-20 h-4 bg-gray-400 rounded mb-2"></div>
                <div className="w-16 h-6 bg-gray-400 rounded"></div>
              </div>
              <div className="bg-gray-400 p-4 rounded animate-pulse">
                <div className="w-20 h-4 bg-gray-400 rounded mb-2"></div>
                <div className="w-16 h-6 bg-gray-400 rounded"></div>
              </div>
              <div className="bg-gray-400 p-4 rounded animate-pulse">
                <div className="w-20 h-4 bg-gray-400 rounded mb-2"></div>
                <div className="w-16 h-6 bg-gray-400 rounded"></div>
              </div>
              <div className="bg-gray-400 p-4 rounded animate-pulse">
                <div className="w-20 h-4 bg-gray-400 rounded mb-2"></div>
                <div className="w-16 h-6 bg-gray-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#151b15] rounded-lg p-6 flex">
          <img
            src={token.logoUrl === null ? fallback_img.src : token.logoUrl}
            alt={token.name}
            className="w-64 h-64 rounded-lg mr-6 object-cover"
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
                    <div className="cursor-pointer" title="TronLink">
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
              <p className="description_class line-clamp-3 text-gray-200">
                {token.description}
              </p>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-[#262b24] p-4 rounded">
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
              <div className="bg-[#262b24] p-4 rounded">
                <h3 className="text-xs text-gray-300 mb-1">Marketcap</h3>
                <p className="text-lg font-semibold">
                  ${formatNumber(token.marketCap)}
                </p>
              </div>
              <div className="bg-[#262b24] p-4 rounded">
                <h3 className="text-xs text-gray-300 mb-1">
                  Virtual Liquidity
                </h3>
                <p className="text-lg font-semibold">
                  ${formatNumber(token.virtualLiquidity)}
                </p>
              </div>
              <div className="bg-[#262b24] p-4 rounded">
                <h3 className="text-xs text-gray-300 mb-1">24H Volume</h3>
                <p className="text-lg font-semibold">
                  {formatNumber(token.volume24Hr)} TRX
                </p>
              </div>
              <div className="bg-[#262b24] p-4 rounded">
                <h3 className="text-xs text-gray-300 mb-1">Total Supply</h3>
                <p className="text-lg font-semibold">
                  {formatNumber(token.totalSupply)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 mt-[2rem]">
        <button
          className="submit-button relative"
          onClick={handleDomainAction}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex justify-center items-center w-24">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <span>{storedToken ? "Register Domain" : "Deploy TLD"}</span>
          )}
        </button>
      </div>

      <div>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div
              className="relative p-6 rounded-lg max-w-xl text-center"
              style={{
                background: "linear-gradient(90deg, #151527, #337709)",
                boxShadow:
                  "0px 0px 20px rgba(116, 255, 31, 0.6), 0px 0px 15px rgba(95, 199, 30, 0.2)",
              }}
              ref={popupRef}
            >
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-2 right-3 text-white text-xl font-bold hover:text-gray-300 p-2 bg-gray-700 rounded-full"
              >
                <X
                  size={20}
                  className="hover:text-emerald-400 hover:scale-110"
                />
              </button>

              <h2 className="text-2xl text-[#fcff72] font-medium mb-4">
                Deploy TLD or Register Domain
              </h2>

              <h3 className="text-justify mb-1 text-lg">
                You will see one of the two options below
              </h3>

              <div className="flex gap-2 items-center mb-1 mt-4">
                <ChevronRight
                  className="text-[#74ff1f]"
                  size={16}
                  style={{
                    border: "1px solid #74ff1f",
                    borderRadius: "10px",
                  }}
                />
                <h1
                  className="inline-block py-1 text-[#74ff1f] text-sm"
                  style={{
                    borderRadius: "8px",
                    fontSize: "1.2rem",
                    textAlign: "justify",
                  }}
                >
                  Deploy TLD
                </h1>
              </div>

              <div className="text-justify mb-2 text-md">
                This option appears if no TLD has been deployed for the token.
                Once you deploy a TLD, it will be listed under "All Deployed
                TLDs" in the navbar
              </div>

              <div className="flex mt-4 gap-2 items-center mb-1">
                <ChevronRight
                  className="text-[#74ff1f]"
                  size={16}
                  style={{
                    border: "1px solid #74ff1f",
                    borderRadius: "10px",
                  }}
                />
                <h1
                  className="inline-block py-1 text-[#74ff1f] text-sm"
                  style={{
                    borderRadius: "8px",
                    fontSize: "1.2rem",
                    textAlign: "justify",
                  }}
                >
                  Register Domain
                </h1>
              </div>

              <div className="text-justify mb-2 text-md">
                If a TLD has already been deployed, you can register a domain
                based on that TLD. Your registered domains can be found in the
                "Profile" section, allowing you to keep track of your domains
                effectively
              </div>

              <button
                onClick={closePopup}
                className="submit-button mt-4 px-4 py-2 text-white rounded hover:bg-green-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
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
