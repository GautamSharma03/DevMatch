const socket = require("socket.io")
const crypto = require("crypto")
const { log } = require("console")
const { Chat } = require("../models/chat")

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex")
}

const initializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        },
    })

    io.on("connection", (socket) => {

        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId)
            socket.join(roomId)
           




        })
        socket.on("sendMessage", async ({
            firstName,
            lastName,
            userId,
            targetUserId,
            text,
            photo
        }) => {

            try {
                const roomId = getSecretRoomId(userId, targetUserId)
             

                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                })

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],

                    })
                }
                chat.messages.push({
                    senderId: userId,
                    text,
                })
                await chat.save();
                io.to(roomId).emit("messageReceived", { firstName, text, lastName, photo })

            } catch (error) {
                console.log(error);

            }


        })
        socket.on("disconnect", () => {

        })

    })
}
module.exports = initializeSocket