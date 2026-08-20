import { io } from "socket.io-client";

const socket = io("https://kariyerinsa-api.onrender.com");

export default socket;