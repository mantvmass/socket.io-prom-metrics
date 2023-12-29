import { createServer } from "http";
import { Server, Socket } from "socket.io";
import * as prometheus from "../src";


const server = createServer();
const io = new Server(server);


io.on("connection", (socket: Socket) => {
    console.log(`${socket.id} is connected.`)
    // Add event here
});


io.of("/custom-namespace").on("connection", (socket: Socket) => {
    console.log(`${socket.id} is connected.`)
    // Add event here
});


// init prometheus
prometheus.metrics(io);


// start server
server.listen(3000);