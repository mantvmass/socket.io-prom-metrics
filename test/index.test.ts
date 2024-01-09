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
prometheus.metrics(io); // running on port 9090 (default port) | http://localhost:9090/metrics


// start server
server.listen(3000, () => {
    console.log("prometheus running on port 9090 : http://localhost:9090/metrics");
    console.log("server running on port 3000")
});