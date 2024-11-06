"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { IoWarning } from "react-icons/io5";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
// import { toast, Toaster } from "react-hot-toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Crown,
  Calendar,
  Wallet2,
  Clock,
  DollarSign,
  FileChartColumnIncreasing,
  Timer,
  Hash,
} from "lucide-react";
import abi from "../../DomainRecords.json";
import abiOfPumpDomains from "../../PumpDomains.json";
import { Copy } from "lucide-react";
import copy from "copy-to-clipboard";
import "../../css/RegisterTLD.css";

interface Domain {
  nameWithTld: string;
  owner: string;
  registrationDate: string;
  expirationDate: string;
  registrationPrice: string;
  tronbase58Address?: string;
}

interface DomainCardProps {
  domain: Domain;
  onSetPrimary: (
    domainName: string,
    tronbase58Address: string
  ) => Promise<void>;
  isSettingPrimary: boolean;
  currentSettingDomain: string;
}

interface Token {
  token: any;
  tronbase58Address: string;
}

const DomainCard: React.FC<DomainCardProps> = ({
  domain,
  onSetPrimary,
  isSettingPrimary,
  currentSettingDomain,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isThisCardSetting =
    isSettingPrimary && currentSettingDomain === domain.nameWithTld;

  const handleCopy = (addr: string) => {
    copy(addr);
    toast.info("Copied 🎊🎉");
  };

  // console.log(domain.nameWithTld.split(".")[0])
  // Make sure we have both the domain name without TLD and the tronbase58Address
  const domainNameWithoutTld = domain.nameWithTld.split(".")[0];
  const tronbase58Address = domain.tronbase58Address || "";

  return (
    <div
      className={`border-[1.67px] border-white transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-br from-[#1a2b1a] to-[#2a3b2a] ${
        isHovered ? "shadow-xl shadow-[#75ec2b]/40" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-medium text-[#A8F981]">
            {domain.nameWithTld}
          </h3>
          <Crown className="w-8 h-8 text-yellow-500" />
        </div>

        <div className="space-y-2 text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#75ec2b]" />
            <p className="text-[15px]">Registered: {domain.registrationDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#75ec2b]" />
            <p className="text-[15px]">Expires: {domain.expirationDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <Wallet2 className="w-5 h-5 text-[#75ec2b]" />
            <div className="flex gap-1 items-center text-gray-300 text-sm">
              <span className="text-[15px] truncate">Owner: </span>
              <span>
                {domain.owner.slice(0, 5) + "..." + domain.owner.slice(-5)}
              </span>
              <div className="cursor-pointer" title="Copy">
                <Copy
                  size={12}
                  className="cursor-pointer hover:text-[#FCFF72] text-white hover:scale-125"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCopy(domain.owner);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#75ec2b]" />
            <p className="text-[15px]">Price: {domain.registrationPrice}</p>
          </div>
          {domain.tronbase58Address && (
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-[#75ec2b]" />
              <div className="flex gap-1 items-center text-gray-300 text-sm">
                <span className="text-[15px] truncate">TLD Address: </span>
                <span>
                  {domain.tronbase58Address.slice(0, 5) +
                    "..." +
                    domain.tronbase58Address.slice(-5)}
                </span>
                <div className="cursor-pointer" title="Copy">
                  <Copy
                    size={12}
                    className="cursor-pointer hover:text-[#FCFF72] text-white hover:scale-125"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleCopy(domain.tronbase58Address || "");
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="domain-register mt-4 flex justify-center">
          <button
            onClick={() =>
              onSetPrimary(domainNameWithoutTld, tronbase58Address)
            }
            disabled={isSettingPrimary}
            className="submit-button w-full"
          >
            {isThisCardSetting ? (
              <span className="animate-spin">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center">
                    <svg
                      className="w-6 h-6 text-green-700 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  </div>
                  <span>Setting as Primary...</span>
                </div>
              </span>
            ) : (
              "Set as a primary domain"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const DomainManager = () => {
  const { walletAddress } = useParams();
  const [domains, setDomains] = useState<Domain[]>([]);
  const { address, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [hasInitiallyFetched, setHasInitiallyFetched] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);
  const [currentSettingDomain, setCurrentSettingDomain] = useState("");
  const [isDataReady, setIsDataReady] = useState(false);

  console.log(tokens);

  console.log(walletAddress);

  const DOMAIN_RECORDS_ADDRESS = process.env.NEXT_PUBLIC_DOMAIN_RECORDS_ADDRESS;

  const getDomainHashes = useCallback(async () => {
    if (!hasInitiallyFetched) {
      setIsLoading(true);
    }
    try {
      const tronWeb = (window as any).tronWeb;
      if (!tronWeb) {
        throw new Error(
          "TronWeb not found. Please make sure TronLink is installed and connected."
        );
      }

      const currentNode = tronWeb.fullNode.host;

      if (currentNode.includes("api.trongrid.io")) {
        //this is mainnet node
        toast.error(
          "Oops! You're on the wrong network. Please switch to the Nile Testnet"
        );
      }

      if (currentNode.includes("api.tronstack.io")) {
        //this is mainnet node
        toast.error(
          "Oops! You're on the wrong network. Please switch to the Nile Testnet"
        );
      }

      if (currentNode.includes("api.shasta.trongrid.io")) {
        toast.error(
          "Oops! You're on the wrong network. Please switch to the Nile Testnet"
        );
      }

      const domainRecordsContract = await tronWeb.contract(
        abi.abi,
        DOMAIN_RECORDS_ADDRESS
      );

      const deployResult = await domainRecordsContract
        .getDomainsByOwner(walletAddress)
        .call();

      const formattedDomains: Domain[] = deployResult.map((domain: any) => {
        const registrationDateBigInt = BigInt(domain[2].toString());
        const expirationDateBigInt = BigInt(domain[3].toString());

        return {
          nameWithTld: domain[0],
          owner: tronWeb.address.fromHex(domain[1]),
          registrationDate: new Date(
            Number(registrationDateBigInt) * 1000
          ).toLocaleDateString(),
          expirationDate: new Date(
            Number(expirationDateBigInt) * 1000
          ).toLocaleDateString(),
          registrationPrice:
            tronWeb.fromSun(tronWeb.toDecimal(domain[4])) + " TRX",
        };
      });

      setDomains(formattedDomains);
      setIsDataReady(true);
      // console.log("Domains fetched successfully:", formattedDomains);
    } catch (error) {
      console.error("Error Fetching Registered Domains:", error);
      setDomains([]);
    } finally {
      setIsLoading(false);
      setHasInitiallyFetched(true);
    }
  }, [walletAddress, DOMAIN_RECORDS_ADDRESS, hasInitiallyFetched]);

  const matchTldWithToken = (domainName: string, tokens: Token[]) => {
    // Extract TLD from domain name (e.g., "test.xyz" -> "xyz")
    const tld = domainName.split(".").pop()?.toLowerCase();
    if (!tld) return null;

    // Find token where symbol matches TLD
    const matchingToken = tokens.find(
      (token) => token.token.symbol.toLowerCase() === tld
    );
    return matchingToken ? matchingToken.tronbase58Address : null;
  };

  const waitForConfirmation = async (
    txId: string,
    requiredConfirmations = 19,
    maxWaitTime = 10 * 60 * 1000
  ) => {
    const startTime = Date.now();
    const checkConfirmation = async (): Promise<any> => {
      try {
        const txInfo = await (window.tronWeb as any).trx.getTransactionInfo(
          txId
        );
        if (txInfo && txInfo.blockNumber) {
          const currentBlock = await (
            window.tronWeb as any
          ).trx.getCurrentBlock();
          const confirmations =
            currentBlock.block_header.raw_data.number - txInfo.blockNumber;
          if (confirmations >= requiredConfirmations) {
            return txInfo;
          }
        }
        if (Date.now() - startTime > maxWaitTime) {
          throw new Error("Max wait time reached");
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return checkConfirmation();
      } catch (error) {
        console.error("Error checking confirmation:", error);
        throw error;
      }
    };
    return checkConfirmation();
  };

  const handleSetPrimaryDomain = async (
    domainName: string,
    tronbase58Address: string
  ) => {
    try {
      console.log("tronaddressssssssss", tronbase58Address, domainName);
      setIsSettingPrimary(true);
      setCurrentSettingDomain(domainName);
      toast.info("Transaction initiated! 🚀", { autoClose: 3000 });

      const tronWeb = (window as any).tronWeb;
      const currentNode = tronWeb.fullNode.host;

      if (
        currentNode.includes("api.trongrid.io") ||
        currentNode.includes("api.tronstack.io") ||
        currentNode.includes("api.shasta.trongrid.io")
      ) {
        toast.error("Please switch to the Nile Testnet");
        return;
      }

      const contract = await tronWeb.contract(
        abiOfPumpDomains,
        tronbase58Address
      );
      const result = await contract
        .setPrimaryDomain(domainName.toLowerCase())
        .send();

      toast.info(
        `Setting as primary domain...⚡ Copy this ID and paste on Nile Scan to check status: ${result}`, { autoClose: 10000 }
      );

      const confirmedTxInfo = await waitForConfirmation(result);
      console.log("Confirmed Transaction Info:", confirmedTxInfo);

      toast.success(
        "Primary domain successfully set! 🌟 Please refresh the page to view it in the connect wallet section at Navbar"
      );
    } catch (error) {
      console.error("Error setting primary domain:", error);
      toast.error("Failed to set primary domain");
    } finally {
      setIsSettingPrimary(false);
      setCurrentSettingDomain("");
    }
  };

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

  // UseEffect to fetch data when component is mounted
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window !== "undefined") {
          const checkTronWeb = () => {
            if ((window as any).tronWeb) {
              setIsCheckingConnection(false);
            } else {
              setTimeout(checkTronWeb, 100);
            }
          };
          checkTronWeb();
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        setIsCheckingConnection(false);
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    // Reset the domain state if wallet connection changes
    if (!isCheckingConnection) {
      if (connected) {
        getDomainHashes();
      } else {
        // Clear domains and reset loading state
        setDomains([]);
        setIsLoading(false);
        setHasInitiallyFetched(false);
      }
    }
  }, [connected, walletAddress, getDomainHashes, isCheckingConnection]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1f0a] to-[#1a2f1a] p-8">
      <ToastContainer
        position="top-center"
        autoClose={4000}
        theme="dark"
        toastStyle={{
          background: "linear-gradient(90deg, #151527, #337709)",
          color: "white",
          border: "1px solid #74ff1f",
        }}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-[#A8F981] mb-4">
            Domain Overview{" "}
          </h1>
          <p className="text-white max-w-2xl mx-auto text-lg">
            Access comprehensive details of your registered domains, including
            ownership information, expiration dates, registration dates, and
            pricing
          </p>
        </div>

        {isCheckingConnection || isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#A8F981]"></div>
          </div>
        ) : (
          <>
            {connected && hasInitiallyFetched && isDataReady ? (
              <>
                {domains.length === 0 ? (
                  <div className="bg-[#2a3b2a] border border-transparent rounded-lg p-8 text-center">
                    <h3 className="text-2xl font-bold text-[#A8F981] mb-4">
                      No Domains Found
                    </h3>
                    <p className="text-gray-300">
                      Start your web3 journey by registering your first domain
                      on the PumpDomains platform.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {domains.map((domain, index) => {
                      // Add tronbase58Address to domain object
                      const domainWithAddress = {
                        ...domain,
                        tronbase58Address: matchTldWithToken(
                          domain.nameWithTld,
                          tokens
                        ),
                      };

                      return (
                        <DomainCard
                          key={index}
                          domain={domainWithAddress}
                          onSetPrimary={handleSetPrimaryDomain}
                          isSettingPrimary={isSettingPrimary}
                          currentSettingDomain={currentSettingDomain}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            ) : null}

            {!isCheckingConnection && !connected && (
              <div className="flex items-center justify-center gap-2 p-4 bg-yellow-500/10 rounded-lg text-yellow-500">
                <IoWarning className="w-6 h-6" />
                <span>Please connect your wallet to view your registered domains</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DomainManager;
