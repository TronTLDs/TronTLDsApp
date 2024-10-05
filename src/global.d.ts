// File: src/app/global.d.ts

import { Contract } from 'tronweb';

declare global {
  interface Window {
    tronWeb: TronWeb;
  }
}

interface TronWeb {
  contract(abi, address: string | undefined): Promise<Contract>;
  ready: boolean;
}