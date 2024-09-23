import { NextResponse } from 'next/server';

export async function GET() {
  const apiUrl = 'https://api-v2.sunpump.meme/pump-api/token/getKingOfHill';

  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store', // Disable caching
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.error();
  }
}
