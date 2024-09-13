import React from "react";

const Hero = () => {
  return (
    <div className="flex justify-between p-6">
      <div className="basis-1/2 flex flex-col gap-3">
        <h1 className="text-[30px]">MetaTLDs</h1>
        <p>Permissionless TLDs and Domains: One Click Away</p>
        <p>
          Create and manage your own TLDs with ease. Stake ETH, deploy with one
          click, and enjoy transparent, decentralized domain registration and
          management, without the need for central approval or developers.
        </p>
      </div>
      <div className="basis-1/2 flex items-center justify-center">Trending image content goes here</div>
    </div>
  );
};

export default Hero;
