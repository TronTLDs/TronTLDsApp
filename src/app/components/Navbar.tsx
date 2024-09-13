import React from "react";
import Image from "next/image";
import logo from "../../../assets/metatld_logo_light.png"

const Navbar = () => {
  return (
    <div className="">
      <div className="relative flex items-center justify-between">
        <a href="/" aria-label="StakeEasy" title="StakeEasy">
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
