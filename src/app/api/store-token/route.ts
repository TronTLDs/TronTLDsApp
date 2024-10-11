// src/app/api/store-token/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { TokenModel } from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    await dbConnect();
    console.log("DB CONNECTEDDDD....")
    const body = await req.json();
    console.log(body);

    const newToken = new TokenModel(body);
    console.log(newToken);
    await newToken.save();

    return NextResponse.json({ message: 'Token stored successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error storing token:', error);
    return NextResponse.json({ error: 'Failed to store token' }, { status: 500 });
  }
}