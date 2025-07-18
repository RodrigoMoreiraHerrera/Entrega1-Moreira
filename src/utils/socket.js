import { Server } from "socket.io";
export let io = null;

export function initSocket(server) {
  io = new Server(server);
  return io;
}