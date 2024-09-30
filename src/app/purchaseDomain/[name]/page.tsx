"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { CircleHelp } from "lucide-react";
import { Tooltip } from "antd";
import "../../css/RegisterTLD.css";

function RegisterTLD() {
  const { name } = useParams();
  const letterConfigurations = [
    { letter: "3 letters", price: "10 TRX" },
    { letter: "4 letters", price: "5 TRX" },
    { letter: "More than 5 letters", price: "3 TRX" },
  ];

  const [minDomainLength, setMinDomainLength] = useState("");
  const [maxDomainLength, setMaxDomainLength] = useState("");
  const [minRegistrationDuration, setMinRegistrationDuration] = useState("");
  const [minRenewDuration, setMinRenewDuration] = useState("");
  const [mintCap, setMintCap] = useState("");

  return (
    <div className="container">
      <h1 className="regtld-h1">Create Your Own TLD</h1>
      <form className="regtld-form">
        <div className="input-group">
          <div className="flex gap-[4px] items-center mb-[1rem]">
            <label className="text-[20px] tld_lable">TLD Name</label>
            <Tooltip
              title="Keep in mind that you have to enter the domain name in small letters only, but still if you enter the letters in the capital then it will be considered in small letters only"
              autoAdjustOverflow
              color="#469913"
              placement="rightTop"
              overlayInnerStyle={{
                width: "350px",
                backgroundColor: "#469913",
                fontWeight: "medium",
                padding: "10px",
              }}
            >
              <CircleHelp size={22} strokeWidth={1.5} />
            </Tooltip>
          </div>
          <Tooltip
            title="You cannot edit or change this field"
            autoAdjustOverflow
            color="#469913"
            placement="top"
            overlayInnerStyle={{
              backgroundColor: "#469913",
              fontWeight: "medium",
              padding: "10px",
            }}
          >
            <div className="regtld-input-parent">
              <input
                type="text"
                // placeholder=".sunfrog"
                value={name}
                disabled
                className="regtld-input domain_name cursor-not-allowed"
              />
            </div>
          </Tooltip>
        </div>

        <div className="regtld-config-heading flex gap-2 items-center">
          <span>Configuration</span>
          <Tooltip
            title="Keep in mind that you cannot change the configuration as it is MVP"
            autoAdjustOverflow
            color="#469913"
            placement="rightTop"
            overlayInnerStyle={{
              width: "350px",
              backgroundColor: "#469913",
              fontWeight: "medium",
              padding: "10px",
            }}
          >
            <CircleHelp size={22} strokeWidth={1.5} />
          </Tooltip>
        </div>
        <div className="input-group-flex">
          <div className="input-group ">
            <label>Min Domain Length</label>
            <div className="regtld-input-parent">
              <Tooltip
                title="You cannot edit or change this field"
                autoAdjustOverflow
                color="#469913"
                placement="topRight"
                overlayInnerStyle={{
                  backgroundColor: "#469913",
                  fontWeight: "medium",
                  padding: "10px",
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
                color="#469913"
                placement="topRight"
                overlayInnerStyle={{
                  backgroundColor: "#469913",
                  fontWeight: "medium",
                  padding: "10px",
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
                color="#469913"
                placement="topRight"
                overlayInnerStyle={{
                  backgroundColor: "#469913",
                  fontWeight: "medium",
                  padding: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder="1"
                  className="regtld-input cursor-not-allowed"
                  value={minRegistrationDuration}
                  disabled
                  onChange={(e) => setMinRegistrationDuration(e.target.value)}
                />
              </Tooltip>
            </div>
          </div>
          <div className="input-group">
            <label className="regtld-label">Min Renew Duration (in days)</label>
            <div className="regtld-input-parent">
              <Tooltip
                title="You cannot edit or change this field"
                autoAdjustOverflow
                color="#469913"
                placement="topRight"
                overlayInnerStyle={{
                  backgroundColor: "#469913",
                  fontWeight: "medium",
                  padding: "10px",
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
              color="#469913"
              placement="top"
              overlayInnerStyle={{
                backgroundColor: "#469913",
                fontWeight: "medium",
                padding: "10px",
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
                    color="#469913"
                    placement="topRight"
                    overlayInnerStyle={{
                      backgroundColor: "#469913",
                      fontWeight: "medium",
                      padding: "10px",
                    }}
                  >
                    <input
                      type="text"
                      name="letter"
                      placeholder="e.g., 3"
                      value={config.letter}
                      disabled
                      // onChange={(event) => handleInputChange(index, event)}
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
                    color="#469913"
                    placement="topRight"
                    overlayInnerStyle={{
                      backgroundColor: "#469913",
                      fontWeight: "medium",
                      padding: "10px",
                    }}
                  >
                    <input
                      type="text"
                      name="price"
                      value={config.price}
                      disabled
                      // onChange={(event) => handleInputChange(index, event)}
                      className="regtld-input cursor-not-allowed"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>

      <div className="stake-register">
        <button
          // onClick={handleStakeAndRegister}
          type="submit"
          className="submit-button"
        >
          Register Domain
        </button>
      </div>
    </div>
  );
}

export default RegisterTLD;
