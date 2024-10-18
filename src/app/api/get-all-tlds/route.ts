// src/app/api/get-all-tokens/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { TokenModel } from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();
    const tokens = await TokenModel.find({});
    // console.log(tokens);

    return NextResponse.json({ tokens }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 });
  }
}