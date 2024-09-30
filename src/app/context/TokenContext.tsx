// context/TokenContext.tsx
'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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
  const [token, setTokenState] = useState<Token | null>(null);

  // Save token to localStorage whenever it's updated
  const setToken = (token: Token) => {
    setTokenState(token);
    localStorage.setItem("selectedToken", JSON.stringify(token));
  };

  // Load token from localStorage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem("selectedToken");
    if (storedToken) {
      setTokenState(JSON.parse(storedToken));
    }
  }, []);

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
