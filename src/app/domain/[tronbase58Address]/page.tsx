"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { X } from "lucide-react";
import abi from "../../PumpDomains.json";
import { IoWarning } from "react-icons/io5";
import { BiSolidMessageError } from "react-icons/bi";
import { Tooltip } from "antd";
import { useToken } from "@/app/context/TokenContext";
import { Timer, FileChartColumnIncreasing } from "lucide-react";
// import { toast, Toaster } from "react-hot-toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "antd";
import defaultImage from "../../../../assets/default_image2.png";
import MobileResponsiveMessage from "@/app/components/MobileResponsiveMessage";
import "../../css/RegisterDomain.css";

// type TronWeb = any;

function RegisterDomain() {
  const [transactionState] = useState({
    waiting: false,
    msg: "",
  });
  const [nameRegistered] = useState(false);
  const { token: contextToken } = useToken();
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);

  const { tronbase58Address } = useParams();
  const tronAddress = Array.isArray(tronbase58Address)
    ? tronbase58Address.join(",") // Convert array to string (use a delimiter like `,`)
    : tronbase58Address; // If it's already a string

  console.log(tronbase58Address);
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");

  const { connected } = useWallet();

  // const [registrationPeriod, setRegistrationPeriod] = useState<number>(1);
  const [domainName, setDomainName] = useState<string>("");
  const [tldName] = useState<string>(`${symbol}`); // TLD name is fixed

  const [isDeploymentSuccessful, setIsDeploymentSuccessful] = useState(false);

  // const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationProgress, setConfirmationProgress] = useState(0);
  const [link, setLink] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [canSetPrimary, setCanSetPrimary] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Set to true to open on page load

  useEffect(() => {
    // Automatically open the pop-up on page load
    setIsOpen(true);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (value.length <= 10) {
      setDomainName(value);
    }
  };

  const getDomainPrice = (): number => {
    if (domainName.length === 3) return 10;
    if (domainName.length === 4) return 5;
    if (domainName.length >= 5) return 3;
    return 0;
  };

  const isValidDomainLength = domainName.length >= 3 && domainName.length <= 10;
  const isValidDomain = isValidDomainLength && connected;

  const handleComplete = () => {
    if (isDeploymentSuccessful) {
      console.log("Registration process completed!");
    }
  };

  const callVal = getDomainPrice();
  const DOMAIN_SUNPUMP_ADDRESS = process.env.NEXT_PUBLIC_SUNPUMP_ADDRESS;

  const handleClose = () => {
    setIsDeploymentSuccessful(false);
  };

  const waitForConfirmation = async (
    txId: string,
    requiredConfirmations = 19,
    maxWaitTime = 10 * 60 * 1000 // 10 minutes in milliseconds
  ) => {
    setIsConfirming(true);
    setConfirmationProgress(0);

    const startTime = Date.now();
    const checkConfirmation = async (): Promise<any> => {
      try {
        const txInfo = await (window.tronWeb as any).trx.getTransactionInfo(
          txId
        );

        if (txInfo && txInfo.blockNumber) {
          const currentBlock = await (
            window.tronWeb as any
          ).trx.getCurrentBlock();
          const confirmations =
            currentBlock.block_header.raw_data.number - txInfo.blockNumber;

          setConfirmationProgress(
            Math.min(confirmations / requiredConfirmations, 1)
          );

          if (confirmations >= requiredConfirmations) {
            setIsConfirming(false);
            return txInfo;
          }
        }

        if (Date.now() - startTime > maxWaitTime) {
          throw new Error(
            "Max wait time reached. Transaction may still be pending."
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before next attempt
        return checkConfirmation();
      } catch (error) {
        console.error("Error checking confirmation:", error);
        if (Date.now() - startTime > maxWaitTime) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retry
        return checkConfirmation();
      }
    };

    return checkConfirmation();
  };

  // Keep the handleSetPrimaryDomain function but modify it with toasters
  const handleSetPrimaryDomain = async () => {
    try {
      setIsSettingPrimary(true);
      toast.info("Transaction initiated! 🚀", { autoClose: 5000 });

      const tronWeb = (window as any).tronWeb;

      const currentNode = tronWeb.fullNode.host;
      if (
        currentNode.includes("api.trongrid.io") ||
        currentNode.includes("api.tronstack.io") ||
        currentNode.includes("api.shasta.trongrid.io")
      ) {
        toast.error(
          "Oops! You're on the wrong network. Please switch to the Nile Testnet"
        );
        return;
      }

      const domainSunpumpContract = await tronWeb.contract(abi, tronAddress);

      const setPrimaryResult = await domainSunpumpContract
        .setPrimaryDomain(domainName.toLowerCase())
        .send();

      toast.info(
        `Setting as primary domain...⚡ Copy this ID and paste on Nile Scan to check the transaction status: ${setPrimaryResult}`,
        { autoClose: 10000 }
      );

      const confirmedTxInfo = await waitForConfirmation(setPrimaryResult);
      console.log("Confirmed Transaction Info:", confirmedTxInfo);

      toast.success(
        "Primary domain successfully set! 🌟 Please refresh the page to view it in the connect wallet section at Navbar"
      );
      setIsModalOpen(false);
      setCanSetPrimary(false); // Disable button after successful setting
    } catch (error: unknown) {
      console.error("Error setting primary domain:", error);

      // Reset the setting primary state to allow retrying
      setIsSettingPrimary(false);

      // Show appropriate error message
      if (error instanceof Error) {
        if (error.message.includes("User rejected the transaction")) {
          toast.error("Transaction was rejected. You can try again.");
        } else {
          toast.error("Failed to set domain as primary");
        }
      } else {
        toast.error("An error occurred");
      }

      handleClose();
    } finally {
      setIsSettingPrimary(false); // Always reset the setting state
    }
  };

  // Modify the registerDomain function to add toasters and call handleSetPrimaryDomain
  const registerDomain = useCallback(async () => {
    try {
      setIsDeploying(true);

      const tronWeb = (window as any).tronWeb;
      console.log(tronWeb);
      console.log("inside try block");
      if (!tronWeb) {
        throw new Error(
          "TronWeb not found. Please make sure TronLink is installed and connected."
        );
      }

      const currentNode = tronWeb.fullNode.host;
      if (
        currentNode.includes("api.trongrid.io") ||
        currentNode.includes("api.tronstack.io") ||
        currentNode.includes("api.shasta.trongrid.io")
      ) {
        toast.error(
          "Oops! You're on the wrong network. Please switch to the Nile Testnet"
        );
        return;
      }

      const domainContractAddress = DOMAIN_SUNPUMP_ADDRESS;
      console.log("before instance, address:", domainContractAddress);

      const domainSunpumpContract = await tronWeb.contract(
        abi,
        tronbase58Address
      );

      console.log("instance created", domainSunpumpContract);
      console.log("Registering Domain...");

      const deployResult = await domainSunpumpContract
        .registerDomain(domainName.toLowerCase())
        .send({
          feeLimit: 700_000_000,
          callValue: callVal * 1000000,
        });

      toast.info("Transaction initiated! 🚀");

      console.log("Domain registered successfully:", deployResult);

      setLink(deployResult);

      const confirmedTxInfo = await waitForConfirmation(deployResult);
      console.log("Confirmed Transaction Info:", confirmedTxInfo);

      // Fetch the second log's address field in hex format
      const hexAddress = "0x" + confirmedTxInfo.log[1].address;

      // Convert the hex address to TRON base58 format using tronWeb
      const tronAddress = tronWeb.address.fromHex(hexAddress);

      // Output the converted TRON address
      console.log(tronAddress);

      setIsDeploymentSuccessful(true);

      toast.success(
        "Congratulations! Your domain has been registered successfully! 🎊🎉"
      );
      setCanSetPrimary(true);

      // After successful registration, call handleSetPrimaryDomain
      // await handleSetPrimaryDomain();

      handleComplete();
    } catch (error: unknown) {
      console.error("An Error Occured While Registering Domain");
      if (error instanceof Error) {
        // setError(
        //   `An error occurred while registering the Domain: ${error.message}`
        // );
        toast.error(`An error occurred while registering the Domain`);
      } else {
        // setError("An error occurred while registering the Domain.");
        toast.error("An error occurred");
      }
      handleClose();
    } finally {
      setIsDeploying(false);
    }
  }, [domainName, handleComplete]);

  return (
    <>
      <div className="containerDomain hidden lg:flex">
        {/* <Toaster
        toastOptions={{
          style: {
            border: "1px solid transparent",
            borderImage:
              "linear-gradient(13.51deg,#74ff1f 70.81%,#74ff1f 53.08%)",
            borderImageSlice: 1,
            background:
              "linear-gradient(153.51deg,#010f02 70.81%,#469913 95.08%)",
            color: "white",
          },
        }}
      /> */}
        <ToastContainer
          position="top-center"
          autoClose={4000}
          theme="dark"
          toastStyle={{
            border: "1px solid transparent",
            borderImage:
              "linear-gradient(13.51deg,#74ff1f 70.81%,#74ff1f 53.08%)",
            borderImageSlice: 1,
            background: "linear-gradient(90deg, #151527, #337709)",
            color: "white",
          }}
        />

        <div>
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div
                className="relative p-6 rounded-lg max-w-md text-center"
                style={{
                  background: "linear-gradient(90deg, #151527, #337709)",
                  boxShadow:
                    "0px 0px 20px rgba(116, 255, 31, 0.6), 0px 0px 15px rgba(95, 199, 30, 0.2)",
                }}
              >
                {/* Close Button */}
                <button
                  onClick={closePopup}
                  className="absolute top-2 right-3 text-white text-xl font-bold hover:text-gray-300 p-2 bg-gray-700 rounded-full"
                >
                  <X
                    size={20}
                    className="hover:text-emerald-400 hover:scale-110"
                  />
                </button>

                <h2 className="text-2xl mb-4 text-[#fcff72] font-medium">
                  Primary Domain Guide
                </h2>
                <p className="text-white mb-2 text-[17px]">
                  Please make sure to register a domain before setting it as
                  primary. After setting the domain as primary, please refresh
                  the page to see it appear on your Connect Wallet button
                </p>

                <button
                  onClick={closePopup}
                  className="submit-button mt-4 text-white rounded hover:bg-green-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <h1 className="regtld-h1">Domain Registration</h1>
        <form className="regtld-form">
          <div className="input-group mb-40">
            {/* <img
            src={contextToken?.logoUrl === null ? defaultImage.src : contextToken?.logoUrl}
            alt={contextToken?.name}
            className="w-fit h-[240px] object-cover rounded-md mb-4"
          /> */}
            <label className="ml-[10px]">Domain Name</label>
            <div className="regtld-input-parent">
              <input
                type="text"
                placeholder="Enter domain name (3-10 characters)"
                className="regtld-input border border-gray-300 rounded-md p-2 text-black"
                value={domainName}
                onChange={handleDomainChange}
              />
            </div>
            {!isValidDomainLength && domainName.length > 0 && (
              <div className="flex items-center gap-1 ml-[10px] mt-2">
                <BiSolidMessageError color="red" />
                <span className="text-red-500 -mt-[2px]">
                  Domain name must be 3-10 characters long.
                </span>
              </div>
            )}
          </div>
          <div className="input-group mb-40">
            <label className="ml-[10px]">TLD Name</label>
            <Tooltip
              title="You cannot edit or change this field"
              autoAdjustOverflow
              overlayClassName="fredoka-font"
              color="#469913"
              placement="top"
              overlayInnerStyle={{
                backgroundColor: "#469913",
                fontWeight: "medium",
                padding: "8px",
              }}
            >
              <div className="regtld-input-parent">
                <input
                  type="text"
                  value={`${domainName}.${tldName.toLowerCase()}`}
                  className="regtld-input cursor-not-allowed"
                  readOnly
                />
              </div>
            </Tooltip>
          </div>
          <div className="regtld-config-heading">
            <span className="ml-[10px]">Configuration</span>
          </div>
          <div className="registartion_fields">
            <div className="registration_field_item">
              <div className="registration_field_title">
                <span className="field_title">Registration Period</span>
                <Tooltip
                  title="The number of years you will have right over this domain"
                  placement="leftTop"
                >
                  <span className="field_info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      enableBackground="new 0 0 24 24"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="#000000"
                    >
                      <g>
                        <path d="M0,0h24v24H0V0z" fill="none" />
                      </g>
                      <g>
                        <g>
                          <g>
                            <path d="M12,22c1.1,0,2-0.9,2-2h-4C10,21.1,10.9,22,12,22z" />
                          </g>
                          <g>
                            <path d="M9,19h6c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H9c-0.55,0-1,0.45-1,1v0C8,18.55,8.45,19,9,19z" />
                          </g>
                          <g>
                            <path d="M12,2C7.86,2,4.5,5.36,4.5,9.5c0,3.82,2.66,5.86,3.77,6.5h7.46c1.11-0.64,3.77-2.68,3.77-6.5C19.5,5.36,16.14,2,12,2z" />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                </Tooltip>
              </div>
              <Tooltip
                title="You cannot edit or change this field"
                autoAdjustOverflow
                overlayClassName="fredoka-font"
                color="#469913"
                placement="top"
                overlayInnerStyle={{
                  backgroundColor: "#469913",
                  fontWeight: "medium",
                  padding: "8px",
                }}
              >
                <div className="registartion_field_input registration_period cursor-not-allowed">
                  <span className="registration_period_time">
                    <span>1</span> Year
                  </span>
                  <div className="registration_period_modification">
                    <span
                      className="cursor-not-allowed"
                      // className="period_decrease opacity_low"
                      // onClick={handlePeriodDecrease}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#000000"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M18 13H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1z" />
                      </svg>
                    </span>
                    <span
                      className="period_increase cursor-not-allowed"
                      // onClick={handlePeriodIncrease}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#000000"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Tooltip>
            </div>

            <div className="registration_field_item">
              <div className="registration_field_title">
                <span className="field_title">{"Domain Cost "}</span>
                <Tooltip
                  title="The cost is for the period selected."
                  placement="leftTop"
                >
                  <span className="field_info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      enableBackground="new 0 0 24 24"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="#000000"
                    >
                      <g>
                        <path d="M0,0h24v24H0V0z" fill="none" />
                      </g>
                      <g>
                        <g>
                          <g>
                            <path d="M12,22c1.1,0,2-0.9,2-2h-4C10,21.1,10.9,22,12,22z" />
                          </g>
                          <g>
                            <path d="M9,19h6c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H9c-0.55,0-1,0.45-1,1v0C8,18.55,8.45,19,9,19z" />
                          </g>
                          <g>
                            <path d="M12,2C7.86,2,4.5,5.36,4.5,9.5c0,3.82,2.66,5.86,3.77,6.5h7.46c1.11-0.64,3.77-2.68,3.77-6.5C19.5,5.36,16.14,2,12,2z" />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                </Tooltip>
              </div>
              <Tooltip
                title="You cannot edit or change this field"
                autoAdjustOverflow
                overlayClassName="fredoka-font"
                color="#469913"
                placement="top"
                overlayInnerStyle={{
                  backgroundColor: "#469913",
                  fontWeight: "medium",
                  padding: "8px",
                }}
              >
                <div className="registartion_field_input cursor-not-allowed">
                  <span className="registration_domain_cost text-lg font-medium text-[#5dcd18]">
                    {isValidDomain ? `${getDomainPrice()} TRX` : "N/A"}
                  </span>
                </div>
              </Tooltip>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="domain-register">
              <button
                type="button"
                className={`submit-button ${
                  isValidDomain && !isDeploying
                    ? link
                      ? "cursor-pointer"
                      : "cursor-pointer"
                    : "cursor-not-allowed opacity-60"
                }`}
                disabled={!isValidDomain || isDeploying}
                onClick={registerDomain}
              >
                {isDeploying ? (
                  <span className="animate-spin">
                    {" "}
                    {/* Add spinner animation */}
                    <div className="flex items-center gap-3">
                      <div className="flex justify-center items-center">
                        <svg
                          className="w-6 h-6 text-green-700 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                      </div>
                      <span>Registering...</span>
                    </div>
                  </span>
                ) : (
                  "Register Domain"
                )}
              </button>
            </div>

            <div className="domain-register">
              <button
                type="button"
                className={`submit-button ${
                  isValidDomain &&
                  (isDeploymentSuccessful || canSetPrimary) &&
                  !isSettingPrimary
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-60"
                }`}
                disabled={
                  !isValidDomain ||
                  (!isDeploymentSuccessful && !canSetPrimary) ||
                  isSettingPrimary
                }
                onClick={handleSetPrimaryDomain}
              >
                {isSettingPrimary ? (
                  <span className="animate-spin">
                    {" "}
                    <div className="flex items-center gap-3">
                      <div className="flex justify-center items-center">
                        <svg
                          className="w-6 h-6 text-green-700 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                      </div>
                      <span>Setting as Primary...</span>
                    </div>
                  </span>
                ) : (
                  "Set as a primary domain"
                )}
              </button>
            </div>
          </div>

          {/* <Modal
          title="Set Primary Domain"
          open={isModalOpen}
          onOk={handleSetPrimaryDomain}
          onCancel={() => setIsModalOpen(false)}
          okText="Set as Primary"
          cancelText="Cancel"
          className="custom-modal-style" 
        >
          <div className="domain-label mb-4">
            {" "}
        
            <p className="font-bold text-lg">Domain: example.tld</p>{" "}
          
            <p className="text-sm text-gray-500">
              Full Name: exampledomain.tld
            </p>{" "}
          </div>
          <p>Do you want to set this domain as your primary domain?</p>
        </Modal> */}

          {link && (
            <div className="flex items-center flex-col justify-center gap-1 mt-5 mb-[1rem] text-yellow-500">
              <div className="flex items-center gap-2 mb-3">
                <Timer />
                {
                  <span className="max-w-[673px] text-white">
                    Transaction in progress! This might take 2-3 minutes or
                    longer to finalize. Once it's complete, you'll be able to
                    view your registered domain on the Profile page
                  </span>
                }
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <FileChartColumnIncreasing size={20} />
                  <span>
                    To view the transaction details, simply click or paste the
                    following hash into the Tron Nile Scan
                  </span>
                </div>
                <span
                  className="text-[#75ec2b] text-center bg-gray-700 p-[6px] mt-2 rounded-lg underline font-normal cursor-pointer"
                  title="View in Tronscan"
                  onClick={(event) => {
                    window.open(
                      `https://nile.tronscan.org/#/transaction/${link}`,
                      "_blank"
                    );
                    event.stopPropagation();
                  }}
                >
                  {link}
                </span>
              </div>
            </div>
          )}

          {!connected && (
            <div className="flex items-center justify-center gap-1 mt-4 text-yellow-500">
              <IoWarning />
              <span>Please connect your wallet to register a domain.</span>
            </div>
          )}
        </form>
      </div>

      <MobileResponsiveMessage />
    </>
  );
}

export default RegisterDomain;
