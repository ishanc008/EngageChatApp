import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
// import styles from "./Join.module.css";
import styles from "../Home/Home.module.css";
import { joinRoom, getChats } from "../../actions/room";
import { Spin } from "antd";

import "./join.css";

const Join = ({ setRooms, setKeyValue, length }) => {
  const profile = JSON.parse(localStorage.getItem("profile"));
  // console.log(profile.fullName, profile.email, profile.id);
  const user = {
    fullName: profile.fullName,
    email: profile.email,
    id: profile.id,
  };
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [waitJoin, setWaitJoin] = useState(true);

  const history = useHistory();

  const handleOnSubmit = async () => {
    console.log("join submit");
    setWaitJoin(false);
    const roomData = {
      room_id: room,
      user: user,
      room_password: password,
    };
    localStorage.setItem("roomError", "");
    joinRoom(roomData, history)
      .then((roomDetails) => {
        if (roomDetails) {
          console.log(roomDetails);
          localStorage.setItem("userFound", "false");
          const obj = {
            room_id: roomDetails.room_id,
            room_name: roomDetails.room_name,
          };
          setRooms((rooms) => [...rooms, obj]);
          setKeyValue(`${length}`);
          setWaitJoin(true);
        } else {
          setError(localStorage.getItem("roomError"));
          setWaitJoin(true);
          setRoom("");
          setPassword("");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles["containerMiddle"]}>
      <div className="joinOuterContainer">
        <div className="joinInnerContainer">
          <h1 className="heading">Join</h1>
          <p style={{ color: "red" }}>{error}</p>
          {/* <input
          className="joinInput"
          placeholder="Name"
          type="text"
          onChange={(e) => setName(e.target.value)}
        /> */}
          <input
            className="joinInput"
            placeholder="Room ID"
            value={room}
            type="text"
            onChange={(e) => setRoom(e.target.value)}
          />
          <input
            className="joinInput"
            placeholder="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {waitJoin ? (
            <button
              className="button mt-20"
              type="Submit"
              onClick={handleOnSubmit}
            >
              Join Room
            </button>
          ) : (
            <Spin style={{ marginTop: "1em" }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Join;
