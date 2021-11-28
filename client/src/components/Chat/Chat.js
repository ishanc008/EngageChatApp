import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import Infobar from "../Infobar/Infobar";
import Messages from "../Messages/Messages";
import Input from "../Input/Input";
import { getChats } from "../../actions/room";
import styles from "../Home/Home.module.css";
import { notification } from "antd";

import "./chat.css";

let socket;

// const ENDPOINT = "localhost:5001";
const ENDPOINT = "https://engage-chat-app.herokuapp.com/"

const Chat = ({
  room_name,
  room_id,
  setUsers,
  makeMod,
  removeMod,
  setMakeMod,
  setRemoveMod,
  report,
  setReport,
  deleteReportIndex,
  setDeleteReportIndex,
  deleteMessageId,
  leaveRoomId,
  setLeaveRoomId,
  setLeaveAlert,
}) => {
  // console.log(room_name, room_id);
  // debugger;
  const history = useHistory();
  const profile = JSON.parse(localStorage.getItem("profile"));
  // console.log(profile.fullName, profile.email, profile.id);
  const user = {
    fullName: profile.fullName,
    email: profile.email,
    id: profile.id,
  };

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [reportMessage, setReportMessage] = useState("");
  const [bannedUsers, setBannedUsers] = useState([]);

  // console.log(reportMessage);
  console.log(bannedUsers);

  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ["websocket", "polling", "flashsocket"],
    });
  }, [ENDPOINT]);

  useEffect(() => {
    socket.emit("joinRoom", room_id);

    const userFound = localStorage.getItem("userFound");

    if (userFound === "false") {
      // console.log("chat join socket");
      const obj = {
        room_id: room_id,
        user: user,
      };
      socket.emit("join", obj, (error) => {
        console.log(error);
      });
      localStorage.setItem("userFound", "true");
    }

    setMessages([]);

    getChats(room_id, history).then((chats) => {
      if (chats) {
        console.log(chats);
        setMessages(chats.chats);
        setUsers(chats.users);
        setReport(chats.reports);
        setBannedUsers(chats.bannedUsers);
      }
    });
  }, [room_id]);

  useEffect(() => {
    if (makeMod) {
      // console.log("socket emit make mod");
      socket.emit("makeMod", makeMod);
    }
  }, [makeMod]);

  useEffect(() => {
    if (removeMod) {
      // console.log("socket emit remove mod");
      socket.emit("removeMod", removeMod);
    }
  }, [removeMod]);

  useEffect(() => {
    if (reportMessage) {
      // console.log("socket emit report message");
      socket.emit("report", { room_id, reportMessage });
    }
  }, [reportMessage]);

  useEffect(() => {
    if (deleteReportIndex !== -1) {
      // console.log(deleteReportIndex);
      socket.emit("deleteReport", { room_id, deleteReportIndex });
    }
  }, [deleteReportIndex]);

  useEffect(() => {
    if (deleteMessageId) {
      const messageData = {
        room_id: room_id,
        message_id: deleteMessageId,
      };
      socket.emit("deleteReportMessage", messageData);
    }
  }, [deleteMessageId]);

  useEffect(() => {
    if (leaveRoomId) {
      // console.log(leaveRoomId);
      socket.emit("leaveRoom", leaveRoomId);
      setLeaveRoomId("");
    }
  }, [leaveRoomId]);

  useEffect(() => {
    socket.on("message", (msg) => {
      // console.log(msg);
      console.log("chat message socket");
      setMessages((messages) => [...messages, msg]);
    });

    socket.on("afterDelete", ({ messages }) => {
      // console.log(messages);
      setMessages(messages);
    });

    socket.on("afterJoin", (user) => {
      setUsers((prev) => [...prev, user]);
    });

    socket.on("afterLeaveRoom", (userDetails) => {
      if (leaveRoomId) {
        setLeaveRoomId("");
      }
      // console.log("after leave room");
      setUsers(userDetails.users);
      if (user.id === userDetails.userId) {
        setLeaveAlert({
          room_id: userDetails.room_id,
          room_name: userDetails.room_name,
          type: userDetails.type,
        });
      } else {
        if (userDetails.type === "remove") {
          notification.success({
            message: `${userDetails.user_name} removed successfully`,
            // description: "You were removed from roomname!",
          });
        }
      }
    });

    socket.on("afterMakeMod", (users) => {
      console.log("after making mod");
      if (makeMod) {
        setMakeMod("");
      }
      if (removeMod) {
        setRemoveMod("");
      }
      setUsers(users);
    });

    socket.on("afterReport", (reportMsgs) => {
      console.log("after report", reportMsgs);
      if (reportMessage) {
        setReportMessage("");
      }
      setDeleteReportIndex(-1);
      setReport(reportMsgs);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      // console.log("send message");
      setMessage("");
      const messageData = {
        message: message,
        room_id: room_id,
        user_name: user.fullName,
        id: user.id,
      };
      // console.log(messageData);
      socket.emit("sendMessage", messageData);
    }
  };

  const setMessagesArray = ({ message_id }) => {
    const messageData = {
      room_id: room_id,
      message_id: message_id,
    };
    socket.emit("deleteMessage", messageData);
    // setAlert(true);
  };

  return (
    <div className={styles["containerMiddle"]}>
      {/* <div className="outerContainer"> */}
      <div className="chatContainer">
        <Infobar room={room_name} room_id={room_id} />
        <Messages
          messages={messages}
          id={user.id}
          setMessagesArray={setMessagesArray}
          setReportMessage={setReportMessage}
          report={report}
          bannedUsers={bannedUsers}
        />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      {/* </div> */}
    </div>
  );
};

export default Chat;
