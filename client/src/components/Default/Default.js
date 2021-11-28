import React from "react";
import { Switch } from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";

import "./default.css";
import styles from "../Home/Home.module.css";

const Default = ({ setSliderValue }) => {
  const handleOnClick = (val) => {
    console.log(val);
    setSliderValue((prev) => !prev);
  };
  return (
    <div className={styles["containerRight"]}>
      <div className="in-middle">
        <UsergroupAddOutlined style={{ fontSize: "300%" }} />
        <h1>Create / Join your team</h1>
        <p>
          <Switch
            checkedChildren="Join"
            unCheckedChildren="Create"
            defaultChecked
            onClick={handleOnClick}
            style={{ background: "#2979ff" }}
          />
        </p>
      </div>
    </div>
  );
};

export default Default;
