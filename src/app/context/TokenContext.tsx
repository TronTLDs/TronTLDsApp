// context/TokenContext.tsx
'use client'
import { createContext, useContext, useState, ReactNode } from "react";

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

interface TokenContextType {
  token: Token | null;
  setToken: (token: Token) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<Token | null>(null);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};
