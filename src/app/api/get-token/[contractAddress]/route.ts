// src/app/api/get-token/[contractAddress]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { TokenModel } from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { contractAddress: string } }
) {
  try {
    await dbConnect();
    const { contractAddress } = params;

    const token = await TokenModel.findOne({ 'token.contractAddress': contractAddress });

    console.log(token);

    if (!token) {
      return NextResponse.json({ message: 'Token not found' }, { status: 200 });
    }

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }
}