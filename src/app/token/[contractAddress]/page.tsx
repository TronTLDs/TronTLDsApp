'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TokenDetailPage from "../../components/TokenDetailPage";

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
}

const TokenPage = () => {
  const { contractAddress } = useParams();
  const [token, setToken] = useState<Token | null>(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      const res = await fetch(`/api/proxy/token/${contractAddress}`);
      const result = await res.json();
      setToken(result.data);
    };

    fetchTokenData();
  }, [contractAddress]);

  if (!token) return <div>Loading...</div>;

  return <TokenDetailPage token={token} />;
};

export default TokenPage;
