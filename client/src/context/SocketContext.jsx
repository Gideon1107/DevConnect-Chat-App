import { useAppStore } from "@/store/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef} from "react"
import { io } from "socket.io-client";

const SocketContext = createContext(null)

export const useSocket = () => {
    return useContext(SocketContext)
};

export const SocketProvider = ({children}) => {
    const socket = useRef()
    const { user } = useAppStore();

    useEffect(() => {
        if (!user) return

        if (user) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: {userId: user._id}
            });

            socket.current.on("connect", () => {
                console.log("Connected to socket server")
            });


            return () => {
                socket.current.disconnect();
            }
        }
    },[user])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
};