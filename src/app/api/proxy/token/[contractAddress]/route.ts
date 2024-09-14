import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { contractAddress: string } }) {
  const { contractAddress } = params; // Extract contractAddress from params

  try {
    // Make a request to the external API
    const response = await fetch(`https://api-v2.sunpump.meme/pump-api/token/${contractAddress}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data); // Log the data to verify the response

    return NextResponse.json(data); // Return the token data
  } catch (error) {
    console.error('Error fetching token data:', error);
    return NextResponse.json({ error: 'Failed to fetch token data' }, { status: 500 });
  }
}
