import axios from "axios";

// const API = axios.create({ baseURL: "http://localhost:5001" });
const API = axios.create({ baseURL: "https://engage-chat-app.herokuapp.com/" });


API.interceptors.request.use((req) => {
  if (localStorage.getItem("webToken")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("webToken")}`;
  }
  return req;
});

export const createRoom = (roomData) => API.post(`room/createRoom`, roomData);
export const joinRoom = (roomData) => API.post("room/joinRoom", roomData);
export const getChats = (room_id) => API.get(`room/getChats/${room_id}`);
export const signIn = (formData) => API.post("users/signIn", formData);
export const signUp = (formData) => API.post("users/signUp", formData);
export const getRooms = (userId) => API.get(`users/getRooms/${userId}`);
