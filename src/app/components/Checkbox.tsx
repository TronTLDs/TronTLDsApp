import React from "react";
import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";
import "../css/Home.css"

const onChange: CheckboxProps["onChange"] = (e) => {
  console.log(`checked = ${e.target.checked}`);
};

const CheckboxApp: React.FC = () => {
  return (
    <div className="checkbox-wrapper border-white border-2">
      <Checkbox onChange={onChange} className="text-white flex items-center">
        Listed on Sunswap
      </Checkbox>
    </div>
  );
};

export default CheckboxApp;
