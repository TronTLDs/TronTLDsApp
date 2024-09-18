// src/app/api/proxy/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract page and sort from the query parameters
  const page = searchParams.get("page") || "1"; // Default to page 1
  const sort = searchParams.get("sort") || "tokenCreatedInstant:DESC"; // Default sort

  // Fetch data from the external API using the extracted parameters
  const res = await fetch(
    `https://api-v2.sunpump.meme/pump-api/token/search?page=${page}&size=24&sort=${sort}`
  );

  // Parse the JSON response
  const data = await res.json();

  // Return the data as JSON response to the frontend
  return NextResponse.json(data);
}
