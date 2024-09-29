'use client';
import React, { useState } from "react";
import "../css/RegisterTLD.css";

function RegisterTLD() {
  const letterConfigurations = [
    { letter: "3 letters", price: "" },
    // { letter: "4 letters", price: "" },
    // { letter: "More than 4 letters", price: "" },
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
        <div className="input-group mb-40">
          <label>TLD Name</label>
          <div className="regtld-input-parent">
            <input
              type="text"
              placeholder=".SunFrog"
              className="regtld-input"
            //   value={showTLDName ? "." + showTLDName : ""}
            />
          </div>
        </div>

        <div className="regtld-config-heading">
          <span>Configuration</span>
        </div>
        <div className="input-group-flex">
          <div className="input-group ">
            <label>Min Domain Length</label>
            <div className="regtld-input-parent">
              <input
                type="number"
                placeholder="Enter Minimum Domain Length"
                className="regtld-input"
                value={minDomainLength}
                onChange={(e) => setMinDomainLength(e.target.value)}
              />
            </div>
          </div>
          <div className="input-group">
            <label className="regtld-label">Max Domain Length</label>
            <div className="regtld-input-parent">
              <input
                type="number"
                placeholder="Enter Maximum Domain Length"
                className="regtld-input"
                value={maxDomainLength}
                onChange={(e) => setMaxDomainLength(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="input-group-flex">
          <div className="input-group">
            <label className="regtld-label">
              Min Registration Duration (in years)
            </label>
            <div className="regtld-input-parent">
              <input
                type="text"
                placeholder="e.g., for 1 year enter 1"
                className="regtld-input"
                value={minRegistrationDuration}
                onChange={(e) => setMinRegistrationDuration(e.target.value)}
              />
            </div>
          </div>
          <div className="input-group">
            <label className="regtld-label">Min Renew Duration (in days)</label>
            <div className="regtld-input-parent">
              <input
                type="text"
                placeholder="e.g., for 10 days enter 10"
                className="regtld-input"
                value={minRenewDuration}
                onChange={(e) => setMinRenewDuration(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="input-group">
          <label className="regtld-label">Mint Cap</label>
          <div className="regtld-input-parent">
            <input
              type="number"
              placeholder="e.g., 10,000"
              className="regtld-input"
              value={mintCap}
              onChange={(e) => setMintCap(e.target.value)}
            />
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
                  <input
                    type="text"
                    name="letter"
                    placeholder="e.g., 3"
                    value={config.letter}
                    // onChange={(event) => handleInputChange(index, event)}
                    className="regtld-input"
                    readOnly
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="regtld-label">Price</label>
                <div className="regtld-input-parent">
                  <input
                    type="text"
                    name="price"
                    placeholder="e.g., for 0.01 ETH enter 0.01"
                    value={config.price}
                    // onChange={(event) => handleInputChange(index, event)}
                    className="regtld-input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="stake-register">
          <button
            // onClick={handleStakeAndRegister}
            type="submit"
            className="submit-button"
          >
            Stake and Deploy
          </button>

        </div>
      </form>
    </div>
  );
}

export default RegisterTLD;