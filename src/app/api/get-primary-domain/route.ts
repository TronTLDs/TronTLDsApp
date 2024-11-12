import { NextRequest, NextResponse } from "next/server";
import { TronWeb } from "tronweb";
import { ethers } from "ethers";

// Import your ABIs
import domainRecordsAbi from "../../DomainRecords.json";
import resolverAbi from "../../PublicResolver.json";

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
const resolverAddress = process.env.NEXT_PUBLIC_RESOLVER_ADDRESS; // Replace with your Resolver contract address

// Function to generate the domain hash
function generateDomainHash(name: string, tld: string) {
  const domain = `${name.toLowerCase()}.${tld.toLowerCase()}`;
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(domain));
}

// Function to get domains by owner and check the resolved domain hash
async function getDomainsByOwner(ownerAddress: string) {
  const tronWeb = initTronWeb();

  try {
    // Get the DomainRecords contract instance
    const contract = tronWeb.contract(domainRecordsAbi.abi, contractAddress);

    // Get the Resolver contract instance
    const resolverContract = tronWeb.contract(resolverAbi.abi, resolverAddress);

    // Call the 'getDomainsByOwner' function with the owner's address
    const result = await contract.getDomainsByOwner(ownerAddress).call();
    console.log("resssssssss", result);

    // Check if the result is empty
    if (result.length === 0) {
      return {
        message:
          "You haven't registered any domains on the PumpDomains platform.",
      };
    }

    // Call 'resolveAddressToDomain' on the resolver contract to get the domain hash
    let resolvedDomainHash;
    try {
      resolvedDomainHash = await resolverContract
        .resolveAddressToDomain(ownerAddress)
        .call();
    } catch (error) {
      console.error("Error resolving address to domain:", error);
      // If an error occurs during resolution, assume no primary domain is set
      return {
        message:
          "You haven't set any domains as primary on the PumpDomains platform.",
        registeredDomains: result,
      };
    }

    // If no primary domain is found or the resolvedDomainHash is empty
    if (!resolvedDomainHash) {
      return {
        message:
          "You haven't set any domains as primary on the PumpDomains platform.",
        registeredDomains: result,
      };
    }

    // Loop through the domains and compare hashes
    for (const domain of result) {
      const [name, tld] = domain.nameWithTld.split(".");
      if (name && tld) {
        // Generate the domain hash for each domain
        const generatedDomainHash = generateDomainHash(name, tld);

        // Compare the generated hash with the resolved hash
        if (generatedDomainHash === resolvedDomainHash) {
          return {
            domain: domain.nameWithTld,
            hash: generatedDomainHash,
            resolvedHash: resolvedDomainHash,
          };
        }
      }
    }

    // If no matching primary domain is found
    return {
      message:
        "You haven't set any domains as primary on the PumpDomains platform.",
      registeredDomains: result,
    };
  } catch (error) {
    console.error("Error fetching domains or resolving address:", error);
    throw new Error("An error occurred while processing the request.");
  }
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
    const result = await getDomainsByOwner(ownerAddress);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
