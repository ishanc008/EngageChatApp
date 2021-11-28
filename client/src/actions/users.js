import * as api from "../api/index";
import { notification } from "antd";

export const signIn = async (formData) => {
  console.log(formData);
  try {
    const { data } = await api.signIn(formData);
    // console.log(data);
    localStorage.setItem("webToken", data.token);
    return data;
  } catch (error) {
    console.log(error.response.data.message);
    localStorage.setItem("authError", error.response.data.message);
  }
};

export const signUp = async (formData) => {
  console.log(formData);
  try {
    const { data } = await api.signUp(formData);
    // console.log(data);
    localStorage.setItem("webToken", data.token);
    return data;
  } catch (error) {
    console.log(error.response.data.message);
    localStorage.setItem("authError", error.response.data.message);
  }
};

export const getRooms = async (userId, history) => {
  // console.log(userId);
  try {
    const { data } = await api.getRooms(userId);
    // console.log(data.userRooms);
    return data.userRooms;
  } catch (error) {
    console.log(error.response.data.message);
    notification.error({
      message: `Token expired please login again`,
      // description: "You were removed from roomname!",
    });
    history.push("/");
  }
};
