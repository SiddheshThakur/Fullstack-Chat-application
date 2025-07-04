import { Server } from "socket.io";
import http from "http";

let io;
let server;

export function initializeSocket(httpServer) {
    server = httpServer;
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173"]
        },
    });
    
    io.on("connection", (socket) => {
        console.log("A user connected", socket.id);

        const userId = socket.handshake.query.userId;
        console.log("User ID from query:", userId);
        
        if (userId) {
            userSocketMap[userId] = socket.id;
            console.log("User added to online map:", userId);
            console.log("Current online users:", Object.keys(userSocketMap));
        }

        //io.emit() is userd to send events to all the connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        console.log("Emitted online users:", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
            // Find and remove the user from userSocketMap
            const disconnectedUserId = Object.keys(userSocketMap).find(key => userSocketMap[key] === socket.id);
            if (disconnectedUserId) {
                delete userSocketMap[disconnectedUserId];
                console.log("User removed from online map:", disconnectedUserId);
            }
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
            console.log("Emitted updated online users:", Object.keys(userSocketMap));
        });
    });
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

export { io, server };