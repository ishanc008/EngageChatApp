import React, { useState, useEffect } from "react";
import styles from "../Home/Home.module.css";
import { Menu, Dropdown } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import HowToRegSharpIcon from "@mui/icons-material/HowToRegSharp";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Reports from "./Reports";

const { SubMenu } = Menu;

const Right = ({
  users,
  room_id,
  setMakeMod,
  setRemoveMod,
  report,
  setDeleteReportIndex,
  setDeleteMessageId,
  setLeaveRoomId,
}) => {
  // console.log(users, room_id);
  // console.log(report);
  // console.log("right");
  const [adminId, setAdminId] = useState("");
  const [modsArray, setModsArray] = useState([]);
  const [keyValue, setKeyValue] = useState("1");
  const [isMod, setIsMod] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // console.log(keyValue);
  // console.log(isVisible);

  const currUser = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    // console.log("users changed");
    setIsMod(false);
    let mods = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].role === "Admin") {
        setAdminId(users[i].id);
      } else if (currUser.id === users[i].id && users[i].role === "Moderator") {
        setIsMod(true);
        mods.push(users[i]);
      } else if (users[i].role === "Moderator") {
        mods.push(users[i]);
      }
    }
    // console.log(mods);
  }, [users]);

  const handleReportMenuClick = () => {
    // console.log("menu item");
    setKeyValue("#");
    setIsVisible(true);
  };

  const handleOnLeave = () => {
    // console.log("leave");
    const obj = {
      room_id: room_id,
      userId: currUser.id,
      type: "leave",
    };
    // console.log(obj);
    setLeaveRoomId(obj);
  };

  const handleOnClick = ({ key }) => {
    if (key === "Leave") {
      // console.log("leave because of this");
      const obj = {
        room_id: room_id,
        userId: currUser.id,
        type: "leave",
      };
      // console.log(obj);
      setLeaveRoomId(obj);
    }
    if (key === "removeMeeting") {
      // console.log("remove from meeting");
      const obj = {
        room_id: room_id,
        userId: users[parseInt(keyValue) - 1].id,
        type: "remove",
      };
      // console.log(obj);
      setLeaveRoomId(obj);
    }
    if (key === "Mod") {
      // console.log("Mod");
      // console.log(modsArray);
      const obj = {
        idx: parseInt(keyValue) - 1,
        room_id: room_id,
      };
      setMakeMod(obj);
    }
    if (key === "Student") {
      // console.log("makeStudent");
      const obj = {
        idx: parseInt(keyValue) - 1,
        room_id: room_id,
      };
      setRemoveMod(obj);
    }
    if (key === "Timeout") {
      console.log("Timeout");
    }
  };

  // console.log(users[parseInt(keyValue) - 1]);
  const menu = users ? (
    currUser.id === adminId ? (
      users[parseInt(keyValue) - 1]?.id === currUser.id ? (
        <Menu onClick={handleOnClick}>
          <Menu.Item key="Leave">
            <p>Leave Meeting</p>
          </Menu.Item>
        </Menu>
      ) : (
        <Menu onClick={handleOnClick}>
          {users[parseInt(keyValue) - 1]?.role === "Moderator" ? (
            <Menu.Item key="Student">
              <p>Make Student</p>
            </Menu.Item>
          ) : (
            <Menu.Item key="Mod">
              <p>Make Moderator</p>
            </Menu.Item>
          )}
          <Menu.Item key="removeMeeting">
            <p>Ban from this room</p>
          </Menu.Item>
        </Menu>
      )
    ) : users[parseInt(keyValue) - 1]?.id === currUser.id ? (
      <Menu onClick={handleOnClick}>
        <Menu.Item key="Leave">
          <p>Leave Room</p>
        </Menu.Item>
      </Menu>
    ) : users[parseInt(keyValue) - 1]?.id !== adminId ? (
      <Menu onClick={handleOnClick}>
        <Menu.Item key="removeMeeting">
          <p>Ban from this room</p>
        </Menu.Item>
        {/* <Menu.Item key="Timeout">
          <p>Give Timeout</p>
        </Menu.Item> */}
      </Menu>
    ) : (
      <Menu onClick={handleOnClick}>
        <Menu.Item key="Empty">
          <p></p>
        </Menu.Item>
      </Menu>
    )
  ) : (
    <Menu onClick={handleOnClick}>
      <Menu.Item key="Empty">
        <p></p>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles["containerRight"]}>
      <div style={{ width: 256 }}>
        <Menu
          defaultSelectedKeys={["##"]}
          mode="inline"
          style={{ borderRadius: "1em" }}
        // theme="dark"
        // inlineCollapsed={collapsed}
        >
          <Menu.Item
            style={{
              background: "#3889c7",
              textAlign: "center",
              borderTopRightRadius: "1em",
              borderTopLeftRadius: "1em",
            }}
            key="##"
            onClick={() => setKeyValue("##")}
            icon={<InfoCircleOutlined style={{ color: "#ffffff" }} />}
          >
            <h2 style={{ color: "#ffffff", fontSize: "1.3em" }}>
              Room Details
            </h2>
          </Menu.Item>
          <SubMenu
            key="sub2"
            icon={<PeopleOutlineIcon style={{ fontSize: "1.5em" }} />}
            title="Participants"
          >
            {users.map((user, i) => {
              return (
                <Menu.Item
                  key={`${i + 1}`}
                  onClick={() => setKeyValue(`${i + 1}`)}
                >
                  {isMod || currUser.id === adminId ? (
                    <Dropdown overlay={menu} trigger={["click"]}>
                      <a
                        className="ant-dropdown-link"
                        onClick={(e) => e.preventDefault()}
                      >
                        {user.role == "Admin" ? (
                          <span>
                            <AdminPanelSettingsIcon /> {user.fullName}
                          </span>
                        ) : user.role === "Moderator" ? (
                          <span>
                            <HowToRegSharpIcon /> {user.fullName}
                          </span>
                        ) : (
                          <span>
                            <PersonIcon /> {user.fullName}
                          </span>
                        )}
                      </a>
                    </Dropdown>
                  ) : user.role == "Admin" ? (
                    <span>
                      <AdminPanelSettingsIcon /> {user.fullName}
                    </span>
                  ) : user.role === "Moderator" ? (
                    <span>
                      <HowToRegSharpIcon /> {user.fullName}
                    </span>
                  ) : (
                    <span>
                      <PersonIcon /> {user.fullName}
                    </span>
                  )}
                </Menu.Item>
              );
            })}
          </SubMenu>
          {(isMod || currUser.id === adminId) && (
            <Menu.Item
              key="#"
              icon={<ReportProblemIcon style={{ fontSize: "1.5em" }} />}
              onClick={handleReportMenuClick}
            >
              Reported Messages
            </Menu.Item>
          )}
          <Menu.Item
            key="!"
            onClick={handleOnLeave}
            icon={<ExitToAppIcon style={{ fontSize: "1.5em" }} />}
          >
            Leave Room
          </Menu.Item>
        </Menu>
        <Reports
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          reports={report}
          setDeleteReportIndex={setDeleteReportIndex}
          setDeleteMessageId={setDeleteMessageId}
        />
      </div>
    </div>
  );
};

export default Right;
