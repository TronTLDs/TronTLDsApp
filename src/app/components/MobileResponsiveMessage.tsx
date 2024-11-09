import React from "react";
import Image from "next/image";
import logo from "../../../assets/PumpDomains.png";

function MobileResponsiveMessage() {
  return (
    <>
      <div className="lg:hidden w-full flex items-center bg-gradient-to-b from-[#0a1f0a] to-[#1a2f1a] h-[61px]" style={{padding: "3rem"}}>
        <Image
          alt="logo_img"
          src={logo}
          objectFit="contain"
          width={200}
          height={200}
        />
      </div>
      <div
        className="lg:hidden flex items-center justify-center h-screen w-full overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(200deg, #111211, #191f1c, #222824, #282e2a, rgba(120, 228, 120, 0.6), #303734)",
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full mx-4">
          <div className="mb-6">
            <svg
              className="w-28 h-28 mx-auto text-green-500 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-semibold mb-4 text-green-500">
            Desktop View Recommended
          </h2>
          <p className="text-gray-700 mb-3 text-lg">
            Welcome to{" "}
            <span className="font-semibold text-green-600">
              PumpDomains! 🚀
            </span>
          </p>
          <p className="text-gray-600 mb-6 text-base">
          For the best experience, please switch to a desktop device. 🖥️ Our site for tablet and mobile devices is still being crafted to perfection. 🚧
          </p>
        </div>
      </div>
    </>
  );
}

export default MobileResponsiveMessage;
