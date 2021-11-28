import * as api from "../api/index";
import { notification } from "antd";

export const createRoom = async (roomData, history) => {
  try {
    // console.log(roomData);
    const { data } = await api.createRoom(roomData);
    return data;
  } catch (error) {
    console.log(error.response.data.message);
    localStorage.setItem("roomError", error.response.data.message);
  }
};

export const joinRoom = async (roomData, history) => {
  try {
    const { data } = await api.joinRoom(roomData);
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error.response.data.message);
    localStorage.setItem("roomError", error.response.data.message);
  }
};

export const getChats = async (room_id, history) => {
  try {
    const { data } = await api.getChats(room_id);
    return data;
  } catch (error) {
    console.log(error.response.data.message);
    notification.error({
      message: `Token expired please login again`,
      // description: "You were removed from roomname!",
    });
    history.push("/");
  }
};
