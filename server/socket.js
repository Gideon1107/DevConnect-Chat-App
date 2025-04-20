import { log } from "console";
import { Server as SocketIOServer} from "socket.io"
import Message from "./models/Message.js";
import Group from "./models/Group.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
      cors: {
        origin: process.env.ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        transports: ['websocket', 'polling'],
      },
      allowEIO3: true,
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    const userSocketMap = new Map()

    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`)
        for (const [userId,socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }

    const sendMessage = async (message) => {

        const senderSocketId = userSocketMap.get(message.sender)
        const recipientSocketId = userSocketMap.get(message.recipient)

        const createMessage = await Message.create(message);

        const messageData = await Message.findById(createMessage._id)
        .populate("sender", "id email username")
        .populate("recipient", "id email username")

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", messageData )
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", messageData )
        }
    }

    const sendGroupMessage = async (message) => {
        const { groupId, sender, content, messageType, mediaUrl} = message;

        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timestamp: new Date(),
            mediaUrl
        })

        const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email username profilePicture")
        .exec();

        await Group.findByIdAndUpdate(groupId, {
            $push: { messages: createdMessage._id } 
        })

        const group = await Group.findById(groupId)
        .populate("members")

        const finalData = { ...messageData._doc, groupId: group._id}

        if (group && group.members) {
            group.members.forEach(member => {
                const memberSocketId = userSocketMap.get(member._id.toString())
                if (memberSocketId) {
                    io.to(memberSocketId).emit("receiveChannelMessage", finalData )
                }

                // const adminSocketId = userSocketMap.get(group.createdBy.toString())
                // if (adminSocketId) {
                //     io.to(adminSocketId).emit("receiveChannelMessage", finalData )
                // }
            })
        }
    }


    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        

        if (userId) {
            userSocketMap.set(userId, socket.id)
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
            
        } else {
            console.log("User ID not provided during connection");
        }

        socket.on("sendMessage", sendMessage )
        socket.on("send-group-message", sendGroupMessage)
        socket.on("disconnect", () => disconnect(socket))

    });
};

export default setupSocket;