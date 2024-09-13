import Image from "next/image";
import Hero from "../app/components/Hero";
import TokenCard from "../app/components/TokenCard"

export default function Home() {
  return (
    <div className="">
      <Hero />
      <TokenCard />
    </div>
  );
}
