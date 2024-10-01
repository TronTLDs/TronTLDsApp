"use client";
import React, { useState } from "react";
// import "../css/RegisterTLD.css";
import "../css/RegisterDomain.css";
import { Tooltip } from "antd";

function RegisterDomain() {
  const [transactionState] = useState({
    waiting: false,
    msg: "",
  });
  const [nameRegistered] = useState(false);

  const [registrationPeriod, setRegistrationPeriod] = useState(1);
  const handlePeriodDecrease = () => {
    if (registrationPeriod !== 1) setRegistrationPeriod((prev) => prev - 1);
  };

  const handlePeriodIncrease = () => {
    setRegistrationPeriod((prev) => prev + 1);
  };

  return (
    <div className="containerDomain">
      <h1 className="regtld-h1">Domain Registration</h1>
      <form className="regtld-form">
        <div className="input-group mb-40">
          <label>Domain Name</label>
          <div className="regtld-input-parent">
            <input
              type="text"
              placeholder="spiderman.base"
              className="regtld-input"
              //   value={
              //     showDomainName && showTLDName
              //       ? showDomainName + "." + showTLDName
              //       : null
              //   }
              readOnly
            />
          </div>
        </div>

        <div className="input-group mb-40">
          <label>TLD Name</label>
          <div className="regtld-input-parent">
            <input
              type="text"
              placeholder="spiderman.base"
              className="regtld-input"
              //   value={
              //     showDomainName && showTLDName
              //       ? showDomainName + "." + showTLDName
              //       : null
              //   }
              readOnly
            />
          </div>
        </div>

        <div className="regtld-config-heading">
          <span>Configuration</span>
        </div>

        <div className="registartion_fields">
          <div className="registration_field_item">
            <div className="registration_field_title">
              <span className="field_title">Registration Period</span>
              <Tooltip title="The number of years you will have right over this domain"
              placement="leftTop">
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
            <div className="registartion_field_input registration_period">
              <span className="registration_period_time">
                <span>{registrationPeriod}</span> Year
              </span>
              <div className="registration_period_modification">
                <span
                  className={
                    registrationPeriod === 1
                      ? "period_decrease opacity_low"
                      : "period_decrease"
                  }
                  // className="period_decrease opacity_low"
                  onClick={handlePeriodDecrease}
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
                  className="period_increase"
                  onClick={handlePeriodIncrease}
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
          </div>

          <div className="registration_field_item">
            <div className="registration_field_title">
              <span className="field_title">
                {"Domain Cost "}
                <span className="field-sub-title">(Excluding Gas Fees)</span>
              </span>
              <Tooltip title="The cost is for the period selected."
              placement="leftTop">
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
            <div className="registartion_field_input">
              <span className="registration_domain_cost">
                {/* {fetchingValue ? fetchingValue : <>{domainPriceInETH + " "}</>} */}
                0 TRX
              </span>
            </div>
            <p
              style={{
                color: "#ffffff80",
                fontSize: "1rem",
                margin: "10px",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              {/* {"Approx. : $ " + domainPriceInUSD + " USD"} */}
            </p>
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
              //   onClick={registerName}
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
