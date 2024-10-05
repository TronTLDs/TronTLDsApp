"use client";
import React, { useState, useCallback, useEffect } from "react";
// import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import "../css/RegisterDomain.css";
import { Tooltip } from "antd";

// type TronWeb = any;

function RegisterDomain() {
  const [transactionState] = useState({
    waiting: false,
    msg: "",
  });
  const [nameRegistered] = useState(false);

  // const [registrationPeriod, setRegistrationPeriod] = useState<number>(1);
  const [domainName, setDomainName] = useState<string>("");
  const [tldName] = useState<string>("base"); // TLD name is fixed
  
  const [isDeploymentSuccessful, setIsDeploymentSuccessful] = useState(false);

  const [error, setError] = useState<string | null>(null);
  // const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);

  // console.log(error, tronWeb);

  // useEffect(() => {
  //   const initTronWeb = async () => {
  //     // (window.tronWeb && window.tronWeb.ready)
  //     const tronWeb = window.tronWeb;
  //     setTronWeb(tronWeb);

  //     const tronLinkListener = setInterval(() => {
  //       if (window.tronWeb && window.tronWeb.ready) {
  //         setTronWeb(tronWeb);
  //         clearInterval(tronLinkListener);
  //       }
  //     }, 500);
  //   };

  //   initTronWeb();
  // }, []);

  // const handlePeriodDecrease = () => {
  //   if (registrationPeriod > 2) setRegistrationPeriod((prev) => prev - 1);
  // };

  // const handlePeriodIncrease = () => {
  //   if (registrationPeriod < 10) setRegistrationPeriod((prev) => prev + 1);
  // };

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

  const isValidDomain = domainName.length >= 3 && domainName.length <= 10;

  const handleComplete = () => {
    if (isDeploymentSuccessful) {
      console.log("Registration process completed!");
    }
  };

  const callVal = getDomainPrice();
  const DOMAIN_SUNPUMP_ADDRESS = process.env.NEXT_PUBLIC_SUNPUMP_ADDRESS;

  const handleClose = () => {
    setError(null);
    setIsDeploymentSuccessful(false);
  };

  const registerDomain = useCallback(async () => {
    try {
      const tronWeb = window.tronWeb;
      console.log(tronWeb);
      console.log("inside try block");
      if (!tronWeb) {
        throw new Error(
          "TronWeb not found. Please make sure TronLink is installed and connected."
        );
      }

      // Address of deployed Register Domain contract
      const domainContractAddress = DOMAIN_SUNPUMP_ADDRESS;
      console.log(domainContractAddress);

      // Get the contract instance using the TronWeb object
      const domainSunpumpContract = await (tronWeb as any).contract().at(domainContractAddress);
      
      console.log(domainSunpumpContract);

      console.log("Registering Domain...");

      const deployResult = await domainSunpumpContract
        .registerDomain(domainName).send({
          feeLimit:700_000_000,
          callValue: callVal, // sending the required TRX as fee
        });

      console.log("Domain registered successfully:", deployResult);

      // If successful, you can add further logic, e.g., updating UI or storing the deployment info
      setIsDeploymentSuccessful(true);
      handleComplete();
    } catch (error: unknown) {
      console.error("Error Registering Domain:", error);

      // Check if error is an instance of Error and has a message
      if (error instanceof Error) {
        setError(`An error occurred while registering the Domain: ${error.message}`);
        console.log(error);
      } else {
        setError("An unknown error occurred while registering the Domain.");
      }

      handleClose();
    }
  }, [domainName, handleComplete]);

  return (
    <div className="containerDomain">
      <h1 className="regtld-h1">Domain Registration</h1>
      <form className="regtld-form">
        <div className="input-group mb-40">
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
          {!isValidDomain && domainName.length > 0 && (
            <p className="text-red-500 ml-[10px] mt-2">
              Domain name must be 3-10 characters long.
            </p>
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
                value={`${domainName}.${tldName}`}
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

        <div className="domain-register">
          {transactionState.waiting ? (
            <div className="submit-button">
              {transactionState.msg}
              {!nameRegistered && <div className="sp sp-wave"></div>}
            </div>
          ) : (
            <button
              type="button"
              className="submit-button"
              // disabled={!isValidDomain}
              onClick={registerDomain}
            >
              Register Domain
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default RegisterDomain;
