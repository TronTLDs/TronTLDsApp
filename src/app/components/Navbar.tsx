"use client";
import { useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import logo from "../../../assets/PumpDomains.png";
import { CircleUser } from "lucide-react";
import { WalletActionButton } from "@tronweb3/tronwallet-adapter-react-ui";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { LuFolderDown } from "react-icons/lu";
import { IoIosClose } from "react-icons/io";
import "../css/Navbar.css";

// Define the ModalProps type
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

// Modal component with TypeScript types
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-[#282c34] rounded-lg max-w-sm w-full p-8 relative">
        {children}
        <button
          className="absolute top-2 right-2 text-white text-3xl"
          onClick={onClose}
        >
          <IoIosClose className="hover:scale-125 hover:text-[#74ff1f]" />
        </button>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const { address, connected } = useWallet();
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  useEffect(() => {
    const checkWalletAvailability = () => {
      if (typeof window !== "undefined" && window.tronLink) {
        setIsWalletInstalled(true);
      } else {
        setIsWalletInstalled(false);
      }
    };

    checkWalletAvailability();
    const walletCheckInterval = setInterval(() => {
      checkWalletAvailability();
    }, 2000);

    return () => clearInterval(walletCheckInterval);
  }, []);

  const handleConnect = () => {
    setShowInstallModal(true);
  };

  const handleInstallClick = () => {
    window.open("https://www.tronlink.org/", "_blank");
  };

  const handleInstalledClick = () => {
    setShowInstallModal(false);
    window.location.reload();
  };

  const handleModalClose = () => {
    setShowInstallModal(false);
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const href_link = `/profile/${address}`;

  return (
    <div className="border-b-2 border-gray-700">
      <div className="mx-[8px] py-5 px-16">
        <div className="relative flex items-center justify-between">
          <a href="/" aria-label="PumpDomains">
            <Image alt="logo_img" src={logo} width={200} height={200} />
          </a>
          <div className="flex items-center gap-8">
            {connected && (
              <a href={href_link}>
                <div className="flex items-center gap-[5px] p-3 px-6 text-white font-medium hover:border-gray-300 hover:bg-slate-600 border-2 border-gray-500 rounded-lg cursor-pointer">
                  <CircleUser strokeWidth={2} />
                  <span className="font-medium">Profile</span>
                </div>
              </a>
            )}

            {!isWalletInstalled ? (
              <button
                onClick={handleConnect}
                className="flex items-center p-3 px-6 text-white font-medium bg-gradient-to-tl from-[#74ff1f] to-[#469913] hover:bg-gradient-to-tr hover:from-[#469913] hover:to-[#74ff1f]  rounded-lg cursor-pointer tron_btn"
              >
                Install Wallet
              </button>
            ) : !connected ? (
              <WalletActionButton className="flex items-center p-3 px-6 text-white font-medium bg-gradient-to-tl from-[#74ff1f] to-[#469913] hover:bg-gradient-to-tr hover:from-[#469913] hover:to-[#74ff1f] rounded-lg cursor-pointer tron_btn">
                Connect Wallet
              </WalletActionButton>
            ) : (
              <div className="flex items-center space-x-2">
                <WalletActionButton className="flex items-center p-3 px-6 text-white font-medium bg-gradient-to-tl from-[#74ff1f] to-[#469913] hover:bg-gradient-to-tr hover:from-[#469913] hover:to-[#74ff1f]  rounded-lg cursor-pointer tron_btn">
                  <span className="text-sm font-bold">
                    {truncateAddress(address || "")}
                  </span>
                </WalletActionButton>
              </div>
            )}

            <Modal
              isOpen={showInstallModal}
              onClose={() => setShowInstallModal(false)}
            >
              <h2 className="text-2xl font-semibold my-2 bg-clip-text text-white">
                TronLink Wallet
              </h2>
              <button
                className="flex items-center gap-3 text-base hover:underline hover:underline-offset-1 hover:font-semibold"
                onClick={handleInstallClick}
              >
                Click here to install the wallet <LuFolderDown />
              </button>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  className="px-4 py-[8px] rounded-lg border-none outline-none bg-gradient-to-tl from-[#74ff1f] to-[#469913] hover:bg-gradient-to-tr hover:from-[#469913] hover:to-[#74ff1f] font-medium"
                  onClick={handleInstalledClick}
                >
                  I have Installed
                </button>
                <button
                  className="px-4 py-[8px] rounded-lg border-none outline-none bg-gradient-to-tl from-[#74ff1f] to-[#469913] hover:bg-gradient-to-tr hover:from-[#469913] hover:to-[#74ff1f] font-medium"
                  onClick={handleModalClose}
                >
                  Will Do It Later
                </button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
