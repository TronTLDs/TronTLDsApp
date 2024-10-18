'use client'
import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { IoWarning } from "react-icons/io5";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import abi from "../../DomainRecords.json";

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
  const [isLoading, setIsLoading] = useState(false);

  console.log(walletAddress);

  const DOMAIN_RECORDS_ADDRESS = process.env.NEXT_PUBLIC_DOMAIN_RECORDS_ADDRESS;

  const getDomainHashes = useCallback(async () => {
    setIsLoading(true);
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
          registrationPrice: tronWeb.fromSun(tronWeb.toDecimal(domain[4])) + " TRX",
        };
      });

      setDomains(formattedDomains);
      console.log("Domains fetched successfully:", formattedDomains);
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
      getDomainHashes();  // Automatically fetch domains when component mounts
    } else {
      setDomains([]);  // Clear domains if the wallet is disconnected
    }
  }, [connected, walletAddress, getDomainHashes]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-[#A8F981]"></div>
          </div>
        ) : (
          <>
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
          </>
        )}
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
