import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // 🔁 Use your backend's URL or port

export default socket;
