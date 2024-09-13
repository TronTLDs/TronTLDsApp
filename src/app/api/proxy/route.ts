// src/app/api/proxy/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1'; // Default to page 1 if not provided
  const res = await fetch(`https://api-v2.sunpump.meme/pump-api/token/search?page=${page}&size=24&sort=tokenCreatedInstant:DESC`);
  const data = await res.json();
  
  return NextResponse.json(data);
}
