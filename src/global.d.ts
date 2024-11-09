// File: src/app/global.d.ts

import { Contract } from 'tronweb';
import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

declare global {
  interface Window {
    tronWeb: TronWeb;
  }
}

interface TronWeb {
  off(arg0: string, errorListener: (error: any) => void): unknown;
  on(arg0: string, errorListener: (error: any) => void): unknown;
  contract(abi, address: string | undefined): Promise<Contract>;
  ready: boolean;
}