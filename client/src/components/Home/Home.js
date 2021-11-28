import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import catIcon from "../../icons/cat-solid.svg";
import { Avatar, Spin, Button, notification, Menu, Layout } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { useHistory, useLocation } from "react-router-dom";
import Join from "../Join/Join";
import Create from "../Create";
import Right from "../Right/Right";
import Default from "../Default/Default";
import { getRooms } from "../../actions/users";
import Chat from "../Chat/Chat";

const { Header, Content, Footer, Sider } = Layout;
const colors = ["#ff9966"];

const Home = () => {
  const location = useLocation();
  const history = useHistory();
  const userInfo = JSON.parse(localStorage.getItem("profile"));

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [keyValue, setKeyValue] = useState("0");
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [sliderValue, setSliderValue] = useState(true);
  const [makeMod, setMakeMod] = useState("");
  const [removeMod, setRemoveMod] = useState("");
  const [report, setReport] = useState([]);
  const [deleteReportIndex, setDeleteReportIndex] = useState(-1);
  const [deleteMessageId, setDeleteMessageId] = useState("");
  const [leaveRoomId, setLeaveRoomId] = useState("");
  const [leaveAlert, setLeaveAlert] = useState("");

  useEffect(() => {
    if (!userInfo) {
      // alert("Enter a handle");
      history.push("/");
    } else {
      localStorage.setItem("roomError", "");
      const user = JSON.parse(localStorage.getItem("profile"));
      getRooms(user.id, history).then((userRooms) => {
        if (userRooms) {
          setRooms(userRooms);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!userInfo) {
      history.push("/");
    } else {
      if (leaveAlert) {
        console.log("leave alert");
        setKeyValue("0");
        // console.log(leaveRoomId);
        if (leaveAlert.type === "remove") {
          notification.error({
            message: `You were removed from ${leaveAlert.room_name}`,
            // description: "You were removed from roomname!",
          });
        } else {
          notification.success({
            message: `You left ${leaveAlert.room_name}`,
            // description: "You were removed from roomname!",
          });
        }
        for (let i = 0; i < rooms.length; i++) {
          if (rooms[i].room_id === leaveAlert.room_id) {
            rooms.splice(i, 1);
            break;
          }
        }
        // console.log(rooms);
        setRooms(rooms);
        setLeaveAlert("");
      }
    }
  }, [leaveAlert]);
  // console.log(JSON.parse(localStorage.getItem("profile")).fullName);
  // console.log(keyValue, typeof keyValue);
  // console.log(parseInt(keyValue), typeof parseInt(keyValue));
  // console.log(rooms);

  if (!userInfo) {
    alert("Enter a handle");
    history.push("/");
    return <div>login required</div>;
  }

  return (
    <>
      <div className={`${styles.header} ${styles.navbar} ${styles["bg-dark"]}`}>
        <div className={styles["header-left"]}>
          <a
            href="#!"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ fontSize: "1.5rem", alignItems: "center" }}
          >
            <i className="fas fa-bars" />
          </a>
          &nbsp;&nbsp;
          <a
            // href="#!"
            // onClick={() => {
            //   localStorage.clear();
            //   history.push("/");
            // }}
            style={{ fontSize: "2rem", alignItems: "center" }}
          >
            {/* <i class="fas fa-user-graduate"> */}
            <img
              src={catIcon}
              style={{
                marginBottom: "7px",
                background: "red",
                padding: "5px",
                borderRadius: "9px",
              }}
              width={35}
            />
            {/* &nbsp; */}
            <span> Chat App</span>
            {/* </i> */}
            {/* <i className="fas fa-envelope" /> <span> Chat App</span>{" "} */}
          </a>
        </div>
        <div className={styles["header-right"]}>
          <div>
            <i className="fas fa-user" />{" "}
            <span>
              {" "}
              {JSON.parse(localStorage.getItem("profile")).fullName}{" "}
            </span>{" "}
          </div>

          <a
            href="#!"
            onClick={() => {
              localStorage.clear();
              history.push("/");
              notification["success"]({
                message: "Logged out successfully!",
              });
            }}
          >
            <i className="fas fa-sign-out-alt" /> <span>Logout </span>{" "}
          </a>
        </div>
      </div>
      <div className={styles["container"]}>
        <div className={styles["containerLeft"]}>
          <Sider
            style={{
              overflow: "auto",
              height: "80vh",
              background: "#fff",
              // position: "fixed",
              // left: 0,
            }}
            collapsed={isCollapsed}
          >
            <Menu
              // defaultSelectedKeys={[`${keyValue}`]}
              selectedKeys={[`${keyValue}`]}
              mode="inline"
              inlineCollapsed={isCollapsed}
              style={{ borderRadius: "0.7rem" }}
            // theme="dark"
            >
              {/* <Menu.Item key="0" onClick={() => setKeyValue("0")}> */}
              <Button
                type="primary"
                shape="round"
                size="large"
                onClick={() => setKeyValue("0")}
                icon={<PlusOutlined />}
                style={{
                  margin: "10px",
                  marginLeft: "15%",
                  alignItems: "center",
                }}
              >
                {!isCollapsed && `Join/Create`}
              </Button>
              {/* </Menu.Item> */}

              {!rooms.length ? (
                <Spin />
              ) : (
                rooms.map((room, i) => {
                  // console.log(room.room_name);
                  return (
                    <Menu.Item
                      key={`${i + 1}`}
                      onClick={() => setKeyValue(`${i + 1}`)}
                      icon={
                        <Avatar
                          style={{
                            color: "black",
                            // backgroundColor: "#fde3cf",
                            backgroundColor: `${colors[Math.floor(Math.random() * 1)]
                              }`,
                          }}
                        >
                          {room.room_name.substr(
                            0,
                            Math.floor(Math.random() * 2 + 1)
                          )}
                        </Avatar>
                      }
                    >
                      {!isCollapsed && room.room_name}
                    </Menu.Item>
                  );
                })
              )}
            </Menu>
          </Sider>
        </div>
        {keyValue === "0" ? (
          // <Create setNewMember={setNewMember} />
          sliderValue ? (
            <Join
              setRooms={setRooms}
              setKeyValue={setKeyValue}
              length={rooms.length + 1}
            />
          ) : (
            <Create
              setRooms={setRooms}
              setKeyValue={setKeyValue}
              length={rooms.length + 1}
            />
          )
        ) : (
          <Chat
            room_name={rooms[parseInt(keyValue) - 1].room_name}
            room_id={rooms[parseInt(keyValue) - 1].room_id}
            setUsers={setUsers}
            makeMod={makeMod}
            removeMod={removeMod}
            setMakeMod={setMakeMod}
            setRemoveMod={setRemoveMod}
            setReport={setReport}
            report={report}
            deleteReportIndex={deleteReportIndex}
            setDeleteReportIndex={setDeleteReportIndex}
            deleteMessageId={deleteMessageId}
            leaveRoomId={leaveRoomId}
            setLeaveRoomId={setLeaveRoomId}
            setLeaveAlert={setLeaveAlert}
          />
        )}
        {keyValue === "0" ? (
          <Default setSliderValue={setSliderValue} />
        ) : (
          <Right
            room_id={rooms[parseInt(keyValue) - 1].room_id}
            users={users}
            setMakeMod={setMakeMod}
            setRemoveMod={setRemoveMod}
            report={report}
            setDeleteReportIndex={setDeleteReportIndex}
            setDeleteMessageId={setDeleteMessageId}
            setLeaveRoomId={setLeaveRoomId}
          />
        )}
      </div>
    </>
  );
};

export default Home;
