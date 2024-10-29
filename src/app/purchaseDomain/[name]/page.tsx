"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Axis3DIcon, CircleHelp } from "lucide-react";
import { Tooltip } from "antd";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { useToken } from "@/app/context/TokenContext";
// import { toast, Toaster } from "react-hot-toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "antd";
import { Timer, FileChartColumnIncreasing } from "lucide-react";
import AutoProgressBar from "@/app/components/AutoProgressBar";
import { IoWarning } from "react-icons/io5";
import abi from "../../TLDFactory.json";
import "../../css/RegisterTLD.css";

const TLD_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_TLD_FACTORY_ADDRESS;
console.log(TLD_FACTORY_ADDRESS);
const TLD_CREATION_FEE = 50000000; // 50 TRX in SUN (1 TRX = 1,000,000 SUN)

// type TronWeb = any;

function RegisterTLD() {
  const { name } = useParams();
  const searchParams = useSearchParams();
  // State for managing the spinner/loading effect
  const [isDeploying, setIsDeploying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const symbol = searchParams.get("symbol");
  const contractAddress = searchParams.get("contractAddress");
  console.log("Symbol", symbol);
  console.log("Contract Address", contractAddress);
  // Decode the URL parameter explicitly to handle special characters
  const decodedName = Array.isArray(name)
    ? name.map(decodeURIComponent).join("/")
    : decodeURIComponent(name || "");

  console.log(decodedName); // This will log the decoded value of `name`

  const { address, connected } = useWallet();
  const [token, setToken] = useState(null);
  const { token: contextToken } = useToken();
  // const [tronbase58Address, setTronbase58Address] = useState("");
  console.log(address, contextToken);

  const [error, setError] = useState<string | null>(null);
  const [isDeploymentSuccessful, setIsDeploymentSuccessful] = useState(false);
  const [minDomainLength, setMinDomainLength] = useState("");
  const [maxDomainLength, setMaxDomainLength] = useState("");
  const [minRegistrationDuration, setMinRegistrationDuration] = useState("");
  const [minRenewDuration, setMinRenewDuration] = useState("");
  const [mintCap, setMintCap] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);

  const [isConfirming, setIsConfirming] = useState(false);
  const [link, setLink] = useState("");
  const [confirmationProgress, setConfirmationProgress] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchTokenData = async () => {
      if (contextToken) {
        setIsLoading(true);
        setToken(contextToken);
        setIsLoading(false);
      } else if (contractAddress) {
        try {
          setIsLoading(true);
          const res = await fetch(`/api/proxy/token/${contractAddress}`);
          const result = await res.json();
          setToken(result.data);
          console.log("data from api, instead of context api", result);
        } catch (error) {
          console.error("Error fetching token data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTokenData();
  }, [contextToken, contractAddress]);

  const letterConfigurations = [
    { letter: "3 letters", price: "10 TRX" },
    { letter: "4 letters", price: "5 TRX" },
    { letter: "More than 5 letters", price: "3 TRX" },
  ];

  const steps = [
    {
      title: "Step 1 - Registering Domain",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum velit blanditiis quam delectus nam. Inventore porro cum quod impedit. Dolor accusantium repellat laborum inventore deserunt iure in tempore.",
    },
    {
      title: "Step 2 - Sending Fees to Receiver",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex molestias dolores minima rem labore ipsum, non ab laborum voluptatem, inventore animi asperiores hic expedita quos iste facilis suscipit alias. Iure odio quos facere nobis sapiente laudantium animi vel rerum voluptatibus nisi mollitia dolorem, illum atque, ad quibusdam molestiae corrupti! Possimus fugiat delectus odit dolore deleniti exercitationem omnis cupiditate odio tenetur, nam id earum et molestias sed. Labore obcaecati quia atque nulla nihil beatae eius inventore alias et officiis quae ullam magnam architecto quis doloribus perspiciatis reiciendis voluptatibus vero perferendis unde doloremque blanditiis maiores, corrupti necessitatibus. Dolorum accusamus fuga cum ducimus.",
    },
    {
      title: "Step 3 - Buying Tokens Contract",
      description:
        "This is the step3. wait for 5000 ms and then you will reach at the final step",
    },
    {
      title: "Domain Registration Successfull",
      description:
        "This is the final step. Congratulations on completing the process!",
    },
  ];

  const showModal = () => {
    // setIsModalOpen(true);
    // setCurrentStep(0);
    // setIsDeploymentSuccessful(false);
    deployTLD();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setError(null);
    setIsDeploymentSuccessful(false);
  };

  const handleComplete = () => {
    if (isDeploymentSuccessful) {
      console.log("Registration process completed!");
    }
    setTimeout(() => {
      setIsModalOpen(false);
    }, 2000);
  };

  const waitForConfirmation = async (
    txId: string,
    requiredConfirmations = 19,
    maxAttempts = 40
  ) => {
    setIsConfirming(true);
    setConfirmationProgress(0);

    const checkConfirmation = async (attempt: number): Promise<any> => {
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

        if (attempt >= maxAttempts) {
          throw new Error(
            "Max attempts reached. Transaction may still be pending."
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds before next attempt
        return checkConfirmation(attempt + 1);
      } catch (error) {
        console.error("Error checking confirmation:", error);
        if (attempt >= maxAttempts) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds before retry
        return checkConfirmation(attempt + 1);
      }
    };

    return checkConfirmation(0);
  };

  const deployTLD = useCallback(async () => {
    try {
      setIsDeploying(true); // Start the loading spinner

      if (window.tronWeb && window.tronWeb.ready) {
        const tronWeb = (window as any).tronWeb;
        console.log(tronWeb);
        console.log("inside try block");
        if (!tronWeb) {
          throw new Error(
            "TronWeb not found. Please make sure TronLink is installed and connected."
          );
        }

        const currentNode = tronWeb.fullNode.host;
        if (currentNode.includes("api.trongrid.io")) {
          //this is mainnet node
          toast.error(
            "Oops! You're on the wrong network. Please switch to the Nile Testnet"
          );
        }

        if (currentNode.includes("api.tronstack.io")) {
          //this is mainnet node
          toast.error(
            "Oops! You're on the wrong network. Please switch to the Nile Testnet"
          );
        }

        if (currentNode.includes("api.shasta.trongrid.io")) {
          toast.error(
            "Oops! You're on the wrong network. Please switch to the Nile Testnet"
          );
        }

        // Address of your deployed TLD Factory contract
        const tldFactoryContractAddress = TLD_FACTORY_ADDRESS;

        console.log(tldFactoryContractAddress);

        // Get the contract instance using the TronWeb object
        const tldFactoryContract = await tronWeb.contract(
          abi,
          tldFactoryContractAddress
        );

        console.log(tldFactoryContract);

        // Prepare parameters for the deployTLD function
        const tldName = decodedName;
        const tldSymbol = symbol;

        console.log("Creating TLD...");

        // Deploy the TLD by calling the contract's deployTLD method
        const deployResult = await tldFactoryContract
          .deployTLD(
            tldName,
            tldSymbol?.toLowerCase(),
            tldSymbol?.toLowerCase()
          )
          .send({
            feeLimit: 700_000_000,
            callValue: TLD_CREATION_FEE, // sending the required TRX as fee
          });

        toast.info("Transaction initiated! 🚀");

        console.log("TLD deployed successfully:", deployResult);

        setLink(deployResult);

        const confirmedTxInfo = await waitForConfirmation(deployResult);
        console.log("Confirmed Transaction Info:", confirmedTxInfo);

        // Fetch the second log's address field in hex format
        const tronhexAddress = "0x" + confirmedTxInfo.log[1].address;

        // Convert the hex address to TRON base58 format using tronWeb
        const tronbase58Address = await tronWeb.address.fromHex(tronhexAddress);

        // Output the converted TRON address
        console.log(tronbase58Address);

        toast.success("Congratulations! Your TLD has been deployed successfully! 🎊🎉");

        // Store data in MongoDB
        await storeDataInMongoDB(tronbase58Address);

        // If successful, you can add further logic, e.g., updating UI or storing the deployment info
        setIsDeploymentSuccessful(true);

        // After successful deployment and storing, redirect the user
        router.push(
          `/domain/${tronbase58Address}?symbol=${symbol}&contractAddress=${contractAddress}`
        );

        handleComplete();
      }
    } catch (error: unknown) {
      console.error("Error deploying TLD:", error);

      // Check if error is an instance of Error and has a message
      if (error instanceof Error) {
        setError(`An error occurred while deploying the TLD: ${error.message}`);
        toast.error(`An error occurred while deploying the TLD`);
      } else {
        setError("An unknown error occurred while deploying the TLD.");
        toast.error("An error occurred");
      }

      handleClose();
    } finally {
      setIsDeploying(false); // Stop the loading spinner
    }
  }, [decodedName, symbol, handleComplete]);

  const storeDataInMongoDB = async (tronbase58Address: string) => {
    try {
      const response = await fetch("/api/store-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress: address,
          token: {
            name: contextToken === null ? token.name : contextToken.name,
            symbol: contextToken === null ? token.symbol : contextToken.symbol,
            description:
              contextToken === null
                ? token.description
                : contextToken.description,
            logoUrl:
              contextToken === null ? token.logoUrl : contextToken.logoUrl,
            contractAddress:
              contextToken === null
                ? token.contractAddress
                : contextToken.contractAddress,
            ownerAddress:
              contextToken === null
                ? token.ownerAddress
                : contextToken.ownerAddress,
          },
          tronbase58Address: tronbase58Address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to store data in MongoDB");
      }

      console.log("Data stored successfully in MongoDB");
    } catch (error) {
      console.error("Error storing data in MongoDB:", error);
    }
  };

  return (
    <div className="container">
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
      <h1 className="regtld-h1">Create Your Own TLD</h1>
      <div className="regtld-form-container">
        <div className="regtld-form-left">
          <form className="regtld-form">
            <div className="input-group">
              <div className="flex gap-[4px] items-center mb-[1rem]">
                <label className="text-[20px] tld_lable">TLD Name</label>
                <Tooltip
                  title="Please ensure that the domain name is entered in lowercase. Any uppercase letters entered will be automatically converted to lowercase"
                  autoAdjustOverflow
                  color="#469913"
                  placement="rightTop"
                  overlayClassName="fredoka-font"
                  overlayInnerStyle={{
                    width: "350px",
                    backgroundColor: "#469913",
                    fontWeight: "medium",
                    padding: "8px",
                  }}
                >
                  <CircleHelp
                    size={22}
                    strokeWidth={1.5}
                    className="cursor-pointer"
                  />
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
                <div className="regtld-input-parent">
                  <input
                    type="text"
                    value={"." + symbol?.toLowerCase()}
                    disabled
                    className="regtld-input domain_name cursor-not-allowed"
                  />
                </div>
              </Tooltip>
            </div>

            <div className="regtld-config-heading flex gap-1 items-center">
              <span>Configuration</span>
              <Tooltip
                title="Please note that the configuration settings cannot be modified as this is the MVP version"
                autoAdjustOverflow
                color="#469913"
                placement="rightTop"
                overlayClassName="fredoka-font"
                overlayInnerStyle={{
                  width: "350px",
                  backgroundColor: "#469913",
                  fontWeight: "medium",
                  padding: "8px",
                }}
              >
                <CircleHelp
                  size={22}
                  strokeWidth={1.5}
                  className="cursor-pointer"
                />
              </Tooltip>
            </div>
            <div className="input-group-flex">
              <div className="input-group ">
                <label>Min Domain Length</label>
                <div className="regtld-input-parent">
                  <Tooltip
                    title="You cannot edit or change this field"
                    autoAdjustOverflow
                    overlayClassName="fredoka-font"
                    color="#469913"
                    placement="topRight"
                    overlayInnerStyle={{
                      backgroundColor: "#469913",
                      fontWeight: "medium",
                      padding: "8px",
                    }}
                  >
                    <input
                      type="number"
                      placeholder="3"
                      className="regtld-input cursor-not-allowed"
                      disabled
                      value={minDomainLength}
                      onChange={(e) => setMinDomainLength(e.target.value)}
                    />
                  </Tooltip>
                </div>
              </div>
              <div className="input-group">
                <label className="regtld-label">Max Domain Length</label>
                <div className="regtld-input-parent">
                  <Tooltip
                    title="You cannot edit or change this field"
                    autoAdjustOverflow
                    overlayClassName="fredoka-font"
                    color="#469913"
                    placement="topRight"
                    overlayInnerStyle={{
                      backgroundColor: "#469913",
                      fontWeight: "medium",
                      padding: "8px",
                    }}
                  >
                    <input
                      type="number"
                      placeholder="7"
                      className="regtld-input cursor-not-allowed"
                      disabled
                      value={maxDomainLength}
                      onChange={(e) => setMaxDomainLength(e.target.value)}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="input-group-flex">
              <div className="input-group">
                <label className="regtld-label">
                  Min Registration Duration (in years)
                </label>
                <div className="regtld-input-parent">
                  <Tooltip
                    title="You cannot edit or change this field"
                    autoAdjustOverflow
                    overlayClassName="fredoka-font"
                    color="#469913"
                    placement="topRight"
                    overlayInnerStyle={{
                      backgroundColor: "#469913",
                      fontWeight: "medium",
                      padding: "8px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="1"
                      className="regtld-input cursor-not-allowed"
                      value={minRegistrationDuration}
                      disabled
                      onChange={(e) =>
                        setMinRegistrationDuration(e.target.value)
                      }
                    />
                  </Tooltip>
                </div>
              </div>
              <div className="input-group">
                <label className="regtld-label">
                  Min Renew Duration (in days)
                </label>
                <div className="regtld-input-parent">
                  <Tooltip
                    title="You cannot edit or change this field"
                    autoAdjustOverflow
                    overlayClassName="fredoka-font"
                    color="#469913"
                    placement="topRight"
                    overlayInnerStyle={{
                      backgroundColor: "#469913",
                      fontWeight: "medium",
                      padding: "8px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="10"
                      className="regtld-input cursor-not-allowed"
                      disabled
                      value={minRenewDuration}
                      onChange={(e) => setMinRenewDuration(e.target.value)}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="input-group">
              <label className="regtld-label">Mint Cap</label>
              <div className="regtld-input-parent">
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
                  <input
                    type="number"
                    className="regtld-input cursor-not-allowed"
                    disabled
                    placeholder="10,000"
                    value={mintCap}
                    onChange={(e) => setMintCap(e.target.value)}
                  />
                </Tooltip>
              </div>
            </div>
          </form>
        </div>
        <div className="regtld-form-right">
          <div className="regtld-config-heading">
            <span>Letter & Price Configuration</span>
          </div>
          <div className="letter-price-config-parent">
            {letterConfigurations.map((config, index) => (
              <div key={index} className="letter-config-group">
                <div className="input-group">
                  <label className="regtld-label">Letter Configuration</label>
                  <div className="regtld-input-parent">
                    <Tooltip
                      title="You cannot edit or change this field"
                      autoAdjustOverflow
                      overlayClassName="fredoka-font"
                      color="#469913"
                      placement="topRight"
                      overlayInnerStyle={{
                        backgroundColor: "#469913",
                        fontWeight: "medium",
                        padding: "8px",
                      }}
                    >
                      <input
                        type="text"
                        name="letter"
                        placeholder="e.g., 3"
                        value={config.letter}
                        disabled
                        className="regtld-input cursor-not-allowed"
                        readOnly
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="input-group">
                  <label className="regtld-label">Price</label>
                  <div className="regtld-input-parent">
                    <Tooltip
                      title="You cannot edit or change this field"
                      autoAdjustOverflow
                      overlayClassName="fredoka-font"
                      color="#469913"
                      placement="topRight"
                      overlayInnerStyle={{
                        backgroundColor: "#469913",
                        fontWeight: "medium",
                        padding: "8px",
                      }}
                    >
                      <input
                        type="text"
                        name="price"
                        value={config.price}
                        disabled
                        className="regtld-input cursor-not-allowed"
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="stake-register">
        <button
          type="submit"
          className={`submit-button ${
            connected
              ? link
                ? "cursor-pointer"
                : "cursor-pointer mb-[40px]"
              : "cursor-not-allowed opacity-60"
          }`}
          onClick={showModal}
          disabled={!connected}
        >
          Deploy TLD
        </button>
      </div> */}

      <div className="stake-register">
        <button
          type="submit"
          className={`submit-button ${
            connected && !isDeploying
              ? link
                ? "cursor-pointer"
                : "cursor-pointer mb-[40px]"
              : connected
              ? "cursor-pointer mb-[40px]"
              : "cursor-not-allowed opacity-60"
          }`}
          onClick={showModal}
          disabled={!connected || isDeploying || isLoading} // Disable when deploying or not connected
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
                <span>Deploying...</span>
              </div>
            </span>
          ) : (
            "Deploy TLD"
          )}
        </button>
      </div>

      {link && (
        <div className="flex items-center flex-col justify-center gap-1 mt-5 mb-[1rem] text-yellow-500">
          <div className="flex items-center gap-[5px] mb-3">
            <Timer />
            {
              <span className="max-w-[800px] text-white">
                Transaction in progress! This could take 2-3 minutes or more to
                finalize. Feel free to relax – once it's done, we’ll
                automatically redirect you to the Register Domain page
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

      <Modal
        title={null}
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
        closeIcon={null}
        width={900}
        centered
        modalRender={(modal) => (
          <div className="custom-modal-container">{modal}</div>
        )}
      >
        <AutoProgressBar
          steps={steps}
          onClose={handleClose}
          onComplete={handleComplete}
        />
      </Modal>
      {/* {error && <div className="error-message mt-4 text-red-500">{error}</div>} */}
      {!connected && (
        <div className="flex items-center justify-center gap-1 mt-3 mb-[1rem] text-yellow-500">
          <IoWarning />
          Please connect your wallet to Deploy TLD.
        </div>
      )}
    </div>
  );
}

export default RegisterTLD;
