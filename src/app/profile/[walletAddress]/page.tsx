"use client";
import Image from "next/image";
import { useState, useCallback } from "react";
import { IoWarning } from "react-icons/io5";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import abi from "../../DomainRecords.json";

interface DomainCardProps {
  domain: string;
}

const DomainCard: React.FC<DomainCardProps> = ({ domain }) => (
  <div className="bg-[#2a3b2a] rounded-lg p-4 flex items-center space-x-4">
    <Image
      src="/placeholder.svg?height=48&width=48"
      alt="Avatar"
      width={48}
      height={48}
      className="rounded-full"
    />
    <div>
      <h3 className="text-white font-semibold">{domain}</h3>
      <p className="text-gray-300 text-sm">Domain details</p>
    </div>
  </div>
);

export default function DomainManager() {
  const [error, setError] = useState<string | null>(null);
  // const [result, setResult] = useState([]);
  const { address, connected } = useWallet();

  const DOMAIN_RECORDS_ADDRESS = process.env.NEXT_PUBLIC_DOMAIN_RECORDS_ADDRESS;

  const getDomainHashes = useCallback(async () => {
    try {
      const tronWeb = window.tronWeb;
      console.log(tronWeb);
      console.log("inside try block");
      if (!tronWeb) {
        throw new Error(
          "TronWeb not found. Please make sure TronLink is installed and connected."
        );
      }

      // Address of deployed Register Domain contract
      const domainRecordsAddress = DOMAIN_RECORDS_ADDRESS;
      console.log("before instance, address:", domainRecordsAddress);

      // Get the contract instance using the TronWeb object
      const domainRecordsContract = await tronWeb.contract(
        abi.abi,
        domainRecordsAddress
      );

      console.log("instance created", domainRecordsContract);

      console.log("Fetching Domain Data...");
      console.log(address);

      const deployResult = await domainRecordsContract
        .getDomainsByOwner(address)
        .call();

      // setResult(deployResult);

      console.log("Domains fetched successfully:", deployResult);
    } catch (error: unknown) {
      console.error("Error Fetching Registered Domains:", error);

      // Check if error is an instance of Error and has a message
      if (error instanceof Error) {
        setError(
          `An error occurred while fetching the Domains: ${error.message}`
        );
      } else {
        setError("An unknown error occurred while fetching the Domain.");
      }
    }
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-[#A8F981] text-2xl font-medium mb-4">TLD</h2>
          <DomainCard domain="spiderman.tron" />
        </section>

        <section>
          <h2 className="text-[#A8F981] text-2xl font-medium mb-4">Domain</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DomainCard domain="spiderman.tron" />
            <DomainCard domain="spiderman.tron" />
            <DomainCard domain="spiderman.tron" />
          </div>
        </section>
      </div>

      <div className="flex items-center justify-center mt-8">
        <button
          disabled={!connected}
          onClick={getDomainHashes}
          className={`flex items-center p-3 px-10 text-white font-medium bg-[#5fc71e] hover:border-white border-2 hover:bg-[#4ca613] rounded-lg ${connected ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
        >
          Get Domain hashes
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-center error-message mt-4 text-red-500">
          {error}
        </div>
      )}
      {!connected && (
        <div className="flex items-center justify-center gap-1 mt-4 text-yellow-500">
          <IoWarning />
          <span>Please connect your wallet to register a domain.</span>
        </div>
      )}
    </div>
  );
}
