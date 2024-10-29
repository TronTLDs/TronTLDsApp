"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { IoWarning } from "react-icons/io5";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Timer,
  FileChartColumnIncreasing,
  Crown,
  Calendar,
  Wallet2,
  Clock,
  DollarSign,
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
}

interface DomainCardProps {
  domain: Domain;
  onSetPrimary: (domainName: string) => void;
  isSettingPrimary: boolean;
}

const DomainCard: React.FC<DomainCardProps> = ({
  domain,
  onSetPrimary,
  isSettingPrimary,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = (addr: string) => {
    copy(addr);
    toast.info("✅ Copied 🎊🎉");
  };

  // console.log(domain.nameWithTld.split(".")[0])

  return (
    <div
      className={`transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-br from-[#1a2b1a] to-[#2a3b2a] border border-transparent ${
        isHovered ? "shadow-xl shadow-[#75ec2b]/20" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-[#A8F981]">
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
        </div>

        {/* <button
          onClick={() => onSetPrimary(domain.nameWithTld.split(".")[0])}
          disabled={isSettingPrimary}
          className={`mt-4 w-full py-2 rounded-lg font-medium transition-all duration-300
            ${
              isSettingPrimary
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-[#74ff1f] to-[#469913] hover:from-[#469913] hover:to-[#74ff1f] text-black"
            }`}
        >
          {isSettingPrimary ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#A8F981]" />
              <span>Setting Primary...</span>
            </div>
          ) : (
            "Set as Primary Domain"
          )}
        </button> */}
      </div>
    </div>
  );
};

const DomainManager = () => {
  const { walletAddress } = useParams();
  const [domains, setDomains] = useState<Domain[]>([]);
  const { address, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);
  const [transactionLink, setTransactionLink] = useState("");

  console.log(walletAddress);

  const DOMAIN_RECORDS_ADDRESS = process.env.NEXT_PUBLIC_DOMAIN_RECORDS_ADDRESS;

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

  const handleSetPrimaryDomain = async (domainName: string) => {
    console.log("inside function of primary")
    try {
      setIsSettingPrimary(true);
      toast.info("Transaction initiated! 🚀", { autoClose: 5000 });

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

      const contract = await tronWeb.contract(abiOfPumpDomains, walletAddress);
      const result = await contract
        .setPrimaryDomain(domainName.toLowerCase())
        .send();

      setTransactionLink(result);
      toast.info("Setting as primary domain... ⚡");

      await waitForConfirmation(result);
      toast.success("Primary domain set successfully! 🌟");
    } catch (error) {
      console.error("Error setting primary domain:", error);
      toast.error("Failed to set primary domain");
    } finally {
      setIsSettingPrimary(false);
    }
  };

  const getDomainHashes = useCallback(async () => {
    setIsLoading(true);
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

      console.log(deployResult);

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
      // console.log("Domains fetched successfully:", formattedDomains);
    } catch (error) {
      console.error("Error Fetching Registered Domains:", error);
      setDomains([]);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, DOMAIN_RECORDS_ADDRESS]);

  // UseEffect to fetch data when component is mounted
  useEffect(() => {
    if (connected && walletAddress) {
      getDomainHashes(); // Automatically fetch domains when component mounts
    } else {
      setDomains([]); // Clear domains if the wallet is disconnected
    }
  }, [connected, walletAddress, getDomainHashes]);

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
            Domain Manager
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Manage your registered domains and set your primary domain for a
            seamless web3 identity experience.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#A8F981]"></div>
          </div>
        ) : (
          <>
            {connected && domains.length === 0 ? (
              <div className="bg-[#2a3b2a] border border-transparent rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-[#A8F981] mb-4">
                  No Domains Found
                </h3>
                <p className="text-gray-300">
                  Start your web3 journey by registering your first domain on
                  the PumpDomains platform.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {domains.map((domain, index) => (
                  <DomainCard
                    key={index}
                    domain={domain}
                    onSetPrimary={handleSetPrimaryDomain}
                    isSettingPrimary={isSettingPrimary}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {transactionLink && (
          <div className="mt-8 p-6 bg-[#2a3b2a] rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-yellow-500">
              <Timer className="w-5 h-5" />
              <span>Transaction in progress (2-3 minutes)</span>
            </div>
            <div className="flex items-center gap-2 text-[#75ec2b]">
              <FileChartColumnIncreasing className="w-5 h-5" />
              <a
                href={`https://nile.tronscan.org/#/transaction/${transactionLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#A8F981]"
              >
                View transaction on TronScan
              </a>
            </div>
          </div>
        )}

        {!connected && (
          <div className="flex items-center justify-center gap-2 p-4 bg-yellow-500/10 rounded-lg text-yellow-500">
            <IoWarning className="w-6 h-6" />
            <span>Please connect your wallet to manage your domains</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainManager;
