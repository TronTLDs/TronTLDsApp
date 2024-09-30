"use client";
import React, { ReactNode, useMemo } from "react";
import { WalletProvider } from "@tronweb3/tronwallet-adapter-react-hooks";
import { WalletModalProvider } from "@tronweb3/tronwallet-adapter-react-ui";
import { TronLinkAdapter } from "@tronweb3/tronwallet-adapters";
import '@tronweb3/tronwallet-adapter-react-ui/style.css';

interface TronLinkProviderProps {
  children: ReactNode;
}

export function TronLinkProvider({ children }: TronLinkProviderProps) {
  function onError(error: Error) {
    // Handle error
    console.error(error);
  }

  const adapters = useMemo(() => {
    const tronLink = new TronLinkAdapter();

    return [tronLink]; // Return the adapters you want to use
  }, []);

  function onConnect() {
    // Handle connection
  }

  async function onAccountsChanged() {
    // Handle account changes
  }

  async function onAdapterChanged(adapter: any) {
    // Handle adapter changes
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