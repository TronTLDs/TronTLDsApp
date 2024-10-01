"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { CircleHelp } from "lucide-react";
import { Tooltip } from "antd";
import "../../css/RegisterTLD.css";
import { Modal } from "antd";
import AutoProgressBar from "@/app/components/AutoProgressBar";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const router = useRouter();

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
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleComplete = () => {
    // Handle completion logic here
    console.log("Registration process completed!");
    setTimeout(() => {
      setIsModalOpen(false);
    }, 2000);
  };


  return (
    <div className="container">
      <h1 className="regtld-h1">Create Your Own TLD</h1>
      <div className="regtld-form-container">
        <div className="regtld-form-left">
          <form className="regtld-form">
            <div className="input-group">
              <div className="flex gap-[4px] items-center mb-[1rem]">
                <label className="text-[20px] tld_lable">TLD Name</label>
                <Tooltip
                  title="Keep in mind that you have to enter the domain name in small letters only, but still if you enter the letters in the capital then it will be considered in small letters only"
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
                  <CircleHelp size={22} strokeWidth={1.5} />
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
                    value={"." + name}
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
                overlayClassName="fredoka-font"
                overlayInnerStyle={{
                  width: "350px",
                  backgroundColor: "#469913",
                  fontWeight: "medium",
                  padding: "8px",
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
      <div className="stake-register">
        <button type="submit" className="submit-button" onClick={showModal}>
          Register Domain
        </button>
      </div>
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
        closeIcon={null}
        width={900}
        centered // to make the modal appear at exact center of the screen
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
    </div>
  );
}

export default RegisterTLD;
