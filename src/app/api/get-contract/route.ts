import { NextRequest, NextResponse } from "next/server";
import { TronWeb } from "tronweb";

// Import your ABIs
import domainRecordsAbi from "../../DomainRecords.json";

// Initialize TronWeb (moved inside the API route function to avoid conflicts with Next.js)
const initTronWeb = () => {
  return new TronWeb({
    fullHost: "https://nile.trongrid.io",
    headers: { "TRON-PRO-API-KEY": process.env.TRON_PRO_API_KEY },
    privateKey: process.env.WALLET_PRIVATE_KEY,
  });
};

// Contract addresses
const contractAddress = process.env.NEXT_PUBLIC_DOMAIN_RECORDS_ADDRESS; // DomainRecords contract address

// Function to get domains by owner and include the factory contract address
async function getDomainsByOwnerWithFactory(ownerAddress: string) {
  const tronWeb = initTronWeb();

  try {
    // Get the DomainRecords contract instance
    const contract = tronWeb.contract(domainRecordsAbi.abi, contractAddress);

    // Call the 'getDomainsByOwner' function with the owner's address
    const result = await contract.getDomainsByOwner(ownerAddress).call();

    // Check if the result is empty
    if (result.length === 0) {
      return {
        message: "You haven't registered any domains on the platform.",
      };
    }

    // Collect all domains with their factory address
    const domainsWithFactory = [];

    // Loop through the registered domains and get the factory address for each
    for (const domainIndex of result) {
      const domain = await contract.getDomainByIndex(domainIndex).call();

      // Ensure BigInt values are handled as strings
      const domainInfo = {
        nameWithTld: domain.nameWithTld,
        owner: domain.owner,
        registrationDate: new Date(Number(BigInt(domain.registrationDate.toString())) * 1000).toLocaleString(), // Convert BigInt to string
        expirationDate: new Date(Number(BigInt(domain.expirationDate.toString())) * 1000).toLocaleString(),     // Convert BigInt to string
        registrationPrice: tronWeb.fromSun(tronWeb.toDecimal(domain.registrationPrice)) + "TRX", // Convert BigInt to string
      };

      // Find the factory address for the current domain
      const factoryAddress = await findFactoryForDomain(domainIndex, contract);

      domainsWithFactory.push({
        ...domainInfo,
        factoryAddress: factoryAddress, // Adding factory address
      });
    }

    // Return all domains with the factory address included
    return {
      registeredDomains: domainsWithFactory,
    };
  } catch (error) {
    console.error("Error fetching domains or resolving factory:", error);
    throw new Error("An error occurred while processing the request.");
  }
}

// Helper function to find the factory address for a domain
async function findFactoryForDomain(domainIndex: number, contract: any) {
  // Fetch the list of factories and domains for each factory
  const domainsByFactory = await contract.domainsByFactory().call();

  // Iterate through the factories to find the domain index
  for (const [factory, indices] of Object.entries(domainsByFactory)) {
    if ((indices as string[]).includes(domainIndex.toString())) {
      return factory;
    }
  }

  return "Unknown"; // If not found
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ownerAddress = searchParams.get("ownerAddress");

  if (!ownerAddress) {
    return NextResponse.json(
      { error: "ownerAddress is required" },
      { status: 400 }
    );
  }

  try {
    const result = await getDomainsByOwnerWithFactory(ownerAddress);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}