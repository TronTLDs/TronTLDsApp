import Hero from "../app/components/Hero";
import MobileResponsiveMessage from "./components/MobileResponsiveMessage";

export default function Home() {
  return ( 
    <>
      <div className="hidden lg:block">
        <Hero />
      </div>

      <div>
        <MobileResponsiveMessage />
      </div>
    </>
  );
}
