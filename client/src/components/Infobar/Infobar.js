import React from "react";

import onlineIcon from "../../icons/onlineIcon.png";
import closeIcon from "../../icons/closeIcon.png";

import "./infobar.css";

const Infobar = ({ room, room_id }) => {
  return (
    <div className="infoBar">
      <div className="leftInnerContainer">
        {/* <img className="onlineIcon" src={onlineIcon} alt="online icon" /> */}
        <h3 style={{ color: "white" }}>{room}</h3>
      </div>
      <div className="rightInnerContainer">{`Room Id - (${room_id})`}</div>
    </div>
  );
};

export default Infobar;
