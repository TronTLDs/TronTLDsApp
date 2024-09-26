import React from "react";
import Image from "next/image";
import logo from "../../../assets/JustTLDsLogo.png";

const Navbar = () => {
  return (
    <div className="mx-[8px]">
      <div className="relative flex items-center justify-between">
        <a href="/" aria-label="JustTLDs" title="JustTLDs">
          <Image alt="logo_img" src={logo} width={200} height={200} />
        </a>
        <button className="flex items-center p-3 px-10 bg-blue-400 rounded-lg cursor-pointer">
          Connect
        </button>
      </div>
    </div>
  );
};

export default Navbar;
