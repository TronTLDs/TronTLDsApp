import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract page, sort, and query from the query parameters
  const page = searchParams.get("page") || "1"; // Default to page 1
  const sort = searchParams.get("sort") || "tokenCreatedInstant:DESC"; // Default sort
  const query = searchParams.get("query") || ""; // Handle empty query

  // Construct the external API URL conditionally based on the presence of 'query'
  const apiUrl = query
    ? `https://api-v2.sunpump.meme/pump-api/token/search?query=${query}&page=${page}&size=24&sort=${sort}`
    : `https://api-v2.sunpump.meme/pump-api/token/search?page=${page}&size=24&sort=${sort}`; // Default API without 'query'

  // Fetch data from the external API
  const res = await fetch(apiUrl);

  // Parse the JSON response
  const data = await res.json();

  // Return the data as JSON response to the frontend
  return NextResponse.json(data);
}
