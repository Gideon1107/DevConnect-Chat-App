import axios from "axios";
import { HOST, LOGOUT_ROUTE, GETUSER_ROUTE } from "@/utils/constants";
import { toast } from 'sonner';
import { useEffect, useCallback, useState } from "react";
import { useAppStore } from "@/store/store";
import Sidebar from "@/components/contacts-container/Sidebar";
import EmptyChatContainer from "@/components/empty-chat-container/EmptyChatContainer";
import ChatContainer from "@/components/chat-container/ChatContainer";




const Chat = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const onLogout = async () => {
    try {
      // Call logout API
      const response = await axios.post(`${HOST}/${LOGOUT_ROUTE}`, {}, {
        withCredentials: true, // Important: Sends cookies with the request
      });

      if (response.data.success) {
        toast.success(response.data.message, { theme: "light" });
        setTimeout(() => {
          setUser(undefined)
          window.location.href = '/'; // Redirect to login page
        }, 1000);
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to capitalize the first letter of the username
  const capitalizeUsername = (username) => {
    if (!username) return ''; // Return empty string if username is falsy
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  const { user, setUser } = useAppStore();

  if (!user){
    return <div className="text-white">Loading...</div>
  }


  return (
    <div className="flex h-screen text-white overflow-hidden">

      <Sidebar/>
      {/* <EmptyChatContainer/> */}
      <ChatContainer/>


    </div>
  )
}

export default Chat

