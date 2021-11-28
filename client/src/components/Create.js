import { useState } from "react";
import { createRoom } from "../actions/room";
import { useHistory } from "react-router-dom";
import styles from "./Home/Home.module.css";
import { Spin } from "antd";

import "./Join/join.css";
// import styles from "./Join/Join.module.css";

const Create = ({ setRooms, setKeyValue, length }) => {
  const profile = JSON.parse(localStorage.getItem("profile"));
  // console.log(profile.fullName, profile.email, profile.id);
  const user = {
    fullName: profile.fullName,
    email: profile.email,
    id: profile.id,
  };
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [waitJoin, setWaitJoin] = useState(true);

  const history = useHistory();

  const handleOnSubmit = async () => {
    console.log("Create submit");
    setWaitJoin(false);
    const roomData = {
      room_name: room.trim().toLowerCase(),
      room_password: password,
      user: user,
    };
    localStorage.setItem("roomError", "");
    createRoom(roomData, history)
      .then((roomData) => {
        if (roomData) {
          console.log(roomData);
          localStorage.setItem("userFound", "true");
          const obj = {
            room_id: roomData.newRoom.room_id,
            room_name: roomData.newRoom.room_name,
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

    setError(localStorage.getItem("roomError"));
  };

  return (
    <div className={styles["containerMiddle"]}>
      <div className="joinOuterContainer">
        <div className="joinInnerContainer">
          <h1 className="heading">Create</h1>
          <p style={{ color: "red" }}>{error}</p>
          {/* <input
          className="joinInput"
          placeholder="Name"
          type="text"
          onChange={(e) => setName(e.target.value)}
        /> */}
          <input
            className="joinInput"
            placeholder="Set Room Name"
            type="text"
            onChange={(e) => setRoom(e.target.value)}
          />
          <input
            className="joinInput"
            placeholder="Set Room Pass"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {waitJoin ? (
            <button
              className="button mt-20"
              type="Submit"
              onClick={handleOnSubmit}
            >
              Create Room
            </button>
          ) : (
            <Spin style={{ marginTop: "1em" }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Create;
