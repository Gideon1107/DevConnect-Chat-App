import { useAppStore } from "@/store/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react"
import { io } from "socket.io-client";

const SocketContext = createContext(null)

export const useSocket = () => {
    return useContext(SocketContext)
};

export const SocketProvider = ({ children }) => {
    const socket = useRef()
    const { user, setDirectMessagesList } = useAppStore();

    useEffect(() => {
        if (!user) return

        if (user) {
            socket.current = io(HOST, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
                query: { userId: user._id },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socket.current.on("connect", () => {
                console.log("Connected to socket server")
            });

            const handleReceiveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage, directMessagesList, addChatInDirectMessagesList } = useAppStore.getState()
                if (selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                    addMessage(message)
                }

                addChatInDirectMessagesList(message)

                
                // Update the directMessagesList for real time last message display
                const updatedList = [...directMessagesList];
                const index = updatedList.findIndex(
                    (chat) => chat._id === message.sender._id || chat._id === message.recipient._id
                );

                if (index !== -1) {
                    // Update existing chat if it exists
                    updatedList[index] = {
                        ...updatedList[index],
                        lastMessage: message.content,
                        lastMessageTime: message.createdAt
                    };
                } else {
                    // Add new chat if it doesn't exist
                    updatedList.push({
                        _id: message.sender._id === user._id ? message.recipient._id : message.sender._id,
                        lastMessage: message.content,
                        lastMessageTime: message.createdAt,
                        email: message.sender._id === user._id ? message.recipient.email : message.sender.email,
                        username: message.sender._id === user._id ? message.recipient.username : message.sender.username,
                        profilePicture: message.sender._id === user._id ? message.recipient.profilePicture : message.sender.profilePicture,
                    });
                }
                
                setDirectMessagesList(updatedList)
            };

            const handleReceiveGroupMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage, addGroupInGroupList } = useAppStore.getState()
                if (selectedChatType !== undefined && selectedChatData._id === message.groupId) {
                    addMessage(message)
                }

                addGroupInGroupList(message)

            };

            socket.current.on("receiveMessage", handleReceiveMessage)
            socket.current.on("receiveChannelMessage", handleReceiveGroupMessage)
            return () => {
                socket.current.disconnect();
            }
        }
    }, [user, setDirectMessagesList])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
};