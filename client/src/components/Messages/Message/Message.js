import React, { useState } from "react";
import { Menu, Dropdown, Modal, Checkbox } from "antd";
import "antd/dist/antd.css";
import "antd/dist/antd.css";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { DeleteOutlined, LikeTwoTone } from "@ant-design/icons";

import "./message.css";

import ReactEmoji from "react-emoji";

const CheckboxGroup = Checkbox.Group;
const reportOptions = ["Spam", "Abusive", "Misleading"];

const Message = ({
  message,
  id,
  deleteMessage,
  index,
  isPrevSenderSame,
  setReportMessage,
  report,
  bannedUsers
}) => {
  // console.log(report);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkedList, setCheckedList] = React.useState([]);
  let isSentByCurrentUser = false;
  let isSentByAdmin = false;
  let created = message.createdAt;
  let time = new Date(created);
  let isBanned = false;
  // console.log(typeof created, created);
  // console.log(created);

  for (let i = 0; i < bannedUsers.length; i++) {
    if (bannedUsers[i] === message.id) {
      isBanned = true;
      break;
    }
  }

  if (message.id === id) {
    isSentByCurrentUser = true;
  }

  if (message.name === "####") {
    isSentByAdmin = true;
  }

  const handleClick = async () => {
    const message_id = message.message_id;
    // console.log(message.message_id);
    await deleteMessage({ message_id });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // console.log("reported");
    if (checkedList.length === 0) {
      alert("Please select a value!!");
    } else {
      const currUser = JSON.parse(localStorage.getItem("profile"));
      let found = false;
      for (let i = 0; i < report.length; i++) {
        if (report[i].reportedMsgId === message.message_id) {
          for (let j = 0; j < report[i].reportedBy.length; i++) {
            if (currUser.id === report[i].reportedBy[j].id) {
              found = true;
              break;
            }
          }
          if (found) {
            break;
          }
        }
      }
      if (!found) {
        const reportDetails = {
          reportedBy: [{ name: currUser.fullName, id: currUser.id }],
          reportedMsg: message.text,
          reportedMsgSender: [{ name: message.name, id: message.id }],
          // reportMsgSenderId: message.id,
          reportedMsgId: message.message_id,
          reportedMsgTime: `${created.substr(0, 10)} ${String(time).substr(
            16,
            5
          )}`,
          checkedList: checkedList,
        };
        setReportMessage(reportDetails);
        setIsModalVisible(false);
      } else {
        alert("Already reported by you!!");
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChange = (list) => {
    // console.log(list);
    setCheckedList(list);
  };

  return isSentByCurrentUser ? (
    <div>
      <div className="messageContainer justifyEnd">
        <div className="messageBox backgroundBlue">
          <span
            className="ant-dropdown-link"
            onClick={(e) => e.preventDefault()}
          >
            {ReactEmoji.emojify(message.text)} &nbsp;
            {/* <DownOutlined /> */}
            <DeleteOutlined
              style={{ float: "right", fontSize: "80%", marginTop: "0.5em" }}
              onClick={handleClick}
            />
          </span>
        </div>
        &nbsp;
      </div>
      <div style={{ paddingRight: "6%", paddingLeft: "6%" }}>
        <p style={{ textAlign: "end", marginBottom: "0em", fontSize: "0.8em" }}>
          {`${created.substr(0, 10)} ${String(time).substr(16, 5)}`}
        </p>
      </div>
    </div>
  ) : isSentByAdmin ? (
    <div className="messageContainer-1 justifyCenter">
      <div className="messageBox backgroundRed">
        <span>{ReactEmoji.emojify(message.text)}</span>
      </div>
    </div>
  ) : (
    <div>
      {!isPrevSenderSame && (
        <span className="sentText pl-10 ">{message.name}</span>
      )}
      <div className="messageContainer justifyStart">
        <div className={`messageBox backgroundLight ${isBanned ? "strikeThrough" : ""}`}>
          <span className="ant-dropdown-link">
            {ReactEmoji.emojify(message.text)}
          </span>
        </div>
        <div
          style={{ display: "flex", paddingLeft: "0.5%", alignItems: "center" }}
        >
          <ReportProblemOutlinedIcon
            style={{ fontSize: "110%" }}
            onClick={showModal}
          />
          <Modal
            title="Report Message"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            maskClosable="true"
            closable={false}
            width={200}
            // footer={null}
            // okButtonProps={(disabled = true)}
            cancelText="Report"
            cancelButtonProps={{
              style: {
                display: "none",
              },
            }}
            okButtonProps={{
              style: {
                alignItems: "center",
              },
            }}
            bodyStyle={{ borderRadius: "5em" }}
          >
            <div>
              <CheckboxGroup
                options={reportOptions}
                value={checkedList}
                onChange={onChange}
              />
            </div>
          </Modal>
        </div>
      </div>
      <div style={{ paddingRight: "6%", paddingLeft: "6%" }}>
        <p
          style={{ textAlign: "start", marginBottom: "0em", fontSize: "0.8em" }}
        >
          {`${created.substr(0, 10)} ${String(time).substr(16, 5)}`}
        </p>
      </div>
    </div>
  );
};

export default Message;
