'use client'
import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { IoWarning } from "react-icons/io5";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import abi from "../../DomainRecords.json";
import abi2 from "../../PublicResolver.json";

interface Domain {
  nameWithTld: string;
  owner: string;
  registrationDate: string;
  expirationDate: string;
  registrationPrice: string;
}

interface DomainCardProps {
  domain: Domain;
}

const DomainCard: React.FC<DomainCardProps> = ({ domain }) => (
  <div className="bg-[#2a3b2a] rounded-lg p-4 flex items-center space-x-4">
    {/* <img
      src="/placeholder.svg?height=48&width=48"
      alt="Avatar"
      width={48}
      height={48}
      className="rounded-full"
    /> */}
    <div>
      <h3 className="text-white font-semibold">{domain.nameWithTld}</h3>
      <p className="text-gray-300 text-sm">Expires: {domain.expirationDate}</p>
    </div>
  </div>
);

const DomainManager = () => {
  const { walletAddress } = useParams();
  const [domains, setDomains] = useState<Domain[]>([]);
  const { address, connected } = useWallet();

  console.log(walletAddress);

  const DOMAIN_RECORDS_ADDRESS = process.env.NEXT_PUBLIC_DOMAIN_RECORDS_ADDRESS;
  const PUBLIC_RESOLVER_ADDRESS = process.env.NEXT_PUBLIC_RESOLVER_ADDRESS;

  const getDomainHashes = useCallback(async () => {
    try {
      const tronWeb = (window as any).tronWeb;
      if (!tronWeb) {
        throw new Error("TronWeb not found. Please make sure TronLink is installed and connected.");
      }
  
      const domainRecordsContract = await tronWeb.contract(abi.abi, DOMAIN_RECORDS_ADDRESS);
      const deployResult = await domainRecordsContract.getDomainsByOwner(walletAddress).call();
  
      console.log(deployResult);  
  
      const formattedDomains: Domain[] = deployResult.map((domain: any) => {
        const registrationDateBigInt = BigInt(domain[2].toString());
        const expirationDateBigInt = BigInt(domain[3].toString());
        
        return {
          nameWithTld: domain[0],
          owner: tronWeb.address.fromHex(domain[1]),
          registrationDate: new Date(Number(registrationDateBigInt) * 1000).toLocaleDateString(),
          expirationDate: new Date(Number(expirationDateBigInt) * 1000).toLocaleDateString(),
          registrationPrice: tronWeb.fromSun(tronWeb.toDecimal(domain[4])) + " TRX"
        };
      });
  
      setDomains(formattedDomains);
      console.log("Domains fetched successfully:", formattedDomains);
    } catch (error) {
      console.error("Error Fetching Registered Domains:", error);
      setDomains([]);
    }
  }, [walletAddress, DOMAIN_RECORDS_ADDRESS]);

  const getPrimaryDomain = useCallback(async () => {
    try {
      const tronWeb = window.tronWeb;
      if (!tronWeb) {
        throw new Error("TronWeb not found. Please make sure TronLink is installed and connected.");
      }

      const resolverContract = await tronWeb.contract(abi2.abi, PUBLIC_RESOLVER_ADDRESS);
      const resolverResult = await resolverContract.resolveAddressToFullDomain(walletAddress).call();
      console.log("Primary domain fetched successfully:", resolverResult);
    } catch (error) {
      console.error("Error Fetching Primary Domain:", error);
    }
  }, [walletAddress, PUBLIC_RESOLVER_ADDRESS]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-[#A8F981] text-2xl font-medium mb-4">Your Domains</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {domains.map((domain, index) => (
              <DomainCard key={index} domain={domain} />
            ))}
          </div>
        </section>

        {domains.length > 0 && (
          <section>
            <h2 className="text-[#A8F981] text-2xl font-medium mb-4">Domain Details</h2>
            {domains.map((domain, index) => (
              <div key={index} className="bg-[#2a3b2a] rounded-lg p-4 mb-4">
                <h3 className="text-white font-semibold">Domain Name: {domain.nameWithTld}</h3>
                <p className="text-gray-300">Owner: {domain.owner}</p>
                <p className="text-gray-300">Registration Date: {domain.registrationDate}</p>
                <p className="text-gray-300">Expiration Date: {domain.expirationDate}</p>
                <p className="text-gray-300">Registration Price: {domain.registrationPrice}</p>
              </div>
            ))}
          </section>
        )}
      </div>

      <div className="flex items-center justify-center mt-8 gap-3">
        <button
          disabled={!connected}
          onClick={getDomainHashes}
          className={`flex items-center p-3 px-10 text-white font-medium bg-[#5fc71e] hover:border-white border-2 hover:bg-[#4ca613] rounded-lg ${
            connected ? "cursor-pointer" : "cursor-not-allowed opacity-50"
          }`}
        >
          Get All Domains
        </button>
        {/* <button
          disabled={!connected}
          onClick={getPrimaryDomain}
          className={`flex items-center p-3 px-10 text-white font-medium bg-[#5fc71e] hover:border-white border-2 hover:bg-[#4ca613] rounded-lg ${
            connected ? "cursor-pointer" : "cursor-not-allowed opacity-50"
          }`}
        >
          Get Primary Domain
        </button> */}
      </div>

      {!connected && (
        <div className="flex items-center justify-center gap-1 mt-4 text-yellow-500">
          <IoWarning />
          <span>Please connect your wallet to view your all registered domains.</span>
        </div>
      )}
    </div>
  );
};

export default DomainManager;