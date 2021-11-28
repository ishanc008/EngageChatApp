import React from "react";
import ReactEmoji from "react-emoji";
import { Avatar, Divider, Tooltip, Badge, Checkbox } from "antd";
import {
  UserOutlined,
  AntDesignOutlined,
  RightSquareOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { AvatarGroup } from "@mui/material";

const CheckboxGroup = Checkbox.Group;

const Report = ({
  index,
  report,
  setDeleteReportIndex,
  setDeleteMessageId,
}) => {
  const handleReportDelete = () => {
    // console.log("delete", index);
    // setDeleteReportIndex(index);
    setDeleteReportIndex(report.reportedMsgId);
  };

  const handleOnMessageDelete = () => {
    // console.log("msg delete");
    // console.log(report.reportedMsgId);
    setDeleteMessageId(report.reportedMsgId);
    // setDeleteReportIndex(report.reportedMsgId);
  };

  return (
    <div style={{ padding: "0" }}>
      <p
        style={{
          color: "red",
          marginBottom: "0em",
          padding: "0.5em 1em",
          fontSize: "1.2em",
        }}
      >
        <RightSquareOutlined />
        &nbsp; Report {index + 1}
        <DeleteOutlined
          style={{ float: "right", fontSize: "80%", marginTop: "0.5em" }}
          onClick={handleReportDelete}
        />
      </p>
      <div style={{ padding: "1em 2em" }}>
        <div style={{ alignItems: "center", display: "flex", flexDirection: "row" }}>
          {report.reportedBy.length === 1 ? (
            <Avatar src="https://joeschmoe.io/api/v1/random" />
          ) : report.reportedBy.length === 2 ? (
            <AvatarGroup>
              <Avatar src="https://joeschmoe.io/api/v1/random" />
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
              />
            </AvatarGroup>
          ) : (
            <>
              <Avatar src="https://joeschmoe.io/api/v1/random" />
              <Badge count={report.reportedBy.length - 2}>
                <Avatar
                  style={{ backgroundColor: "#87d068" }}
                  icon={<UserOutlined />}
                />
              </Badge>
            </>
          )}
        </div>
        {report.reportedBy.map((user, idx) => {
          return <span>{`${user.name} ,`}</span>;
        })}
      </div>
      <div>
        <span className="sentText pl-10 ">
          {report.reportedMsgSender[0].name}
        </span>
        <div>
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <span className="ant-dropdown-link">
                {ReactEmoji.emojify(report.reportedMsg)} &nbsp;
                <DeleteOutlined
                  style={{
                    float: "right",
                    fontSize: "85%",
                    marginTop: "0.5em",
                    color: "red",
                  }}
                  onClick={handleOnMessageDelete}
                />
              </span>
            </div>
            <div style={{ paddingLeft: "2rem" }}>
              <CheckboxGroup
                disabled
                options={report.checkedList}
                value={report.checkedList}
                style={{ color: "red" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ paddingRight: "6%", paddingLeft: "6%" }}>
        <p
          style={{
            textAlign: "start",
            marginBottom: "0em",
            fontSize: "0.8em",
          }}
        >
          {report.reportedMsgTime}
        </p>
      </div>
    </div>
  );
};

export default Report;
