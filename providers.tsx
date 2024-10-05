"use client";
import { WalletProvider } from "@tronweb3/tronwallet-adapter-react-hooks";
import { WalletModalProvider } from "@tronweb3/tronwallet-adapter-react-ui";
import { TronLinkAdapter } from "@tronweb3/tronwallet-adapters";
import { useMemo, ReactNode } from "react";
import "@tronweb3/tronwallet-adapter-react-ui/style.css";

// Define the type for children
interface TronLinkProviderProps {
  children: ReactNode;
}

export function TronLinkProvider({ children }: TronLinkProviderProps) {
  // Error handler function
  function onError(error: Error): void {
    console.error(error);
  }

  // Memoize the adapters to avoid recreating them unnecessarily
  const adapters = useMemo(() => {
    const tronLink = new TronLinkAdapter();

    return [tronLink]; // Return the adapters you want to use
  }, []);

  // Wallet connection handler
  function onConnect(): void {
    console.log("onConnect");
  }

  async function onAdapterChanged(adapter: any) {
    // Handle adapter changes
  }

  // Handle account change with correct signature
  async function onAccountsChanged(address: string, preAddr?: string): Promise<void> {
    console.log("onAccountsChanged", address, preAddr);
  }

  return (
    <WalletProvider
      onError={onError}
      onConnect={onConnect}
      onAccountsChanged={onAccountsChanged}
      onAdapterChanged={onAdapterChanged}
      autoConnect={true}
      adapters={adapters}
      disableAutoConnectOnLoad={true}
    >
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  );
}
