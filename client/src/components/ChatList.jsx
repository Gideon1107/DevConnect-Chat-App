import { useAppStore } from "@/store/store";
import { GET_CHAT_LIST_FOR_DM_ROUTE, HOST } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";


const ChatList = () => {
 
  const [ isGroup, setIsGroup] = useState(false)

  const { 
    directMessagesList, 
    setDirectMessagesList,
    selectedChatType,
    selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
   } = useAppStore()


  useEffect(() => {
    const getChatList = async () => {
      const response = await axios.get(`${HOST}/${GET_CHAT_LIST_FOR_DM_ROUTE}`, {
        withCredentials: true
      })
      
      if (response.data.chatList) {
        setDirectMessagesList(response.data.chatList)
        
      }
      
    }

    getChatList()
  },[])

  const handleClick = (chat) => {
    if (isGroup) {
      setSelectedChatType("group")
    } else {
      setSelectedChatType("dm");
    }

    setSelectedChatData(chat);
    if (selectedChatData && selectedChatData._id !== chat._id) {
      setSelectedChatMessages([])
    }
  }


  return (
    <div className="flex-1 overflow-y-auto ">
      {
        directMessagesList.length > 0 ?
        directMessagesList.map((chat) => (
          <div
            key={chat._id}
            onClick={() => handleClick(chat)}
            className={`flex items-center gap-3 p-3 cursor-pointer
              ${selectedChatData?.id === chat._id ? '' : 'hover:bg-slate-700'}`}
          >
            <img
              src={chat.profilePicture}
              alt={chat.username}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0 ">
              <div className="font-medium text-white truncate ">{chat.username}</div>
              <div className={`text-sm text-gray-400 truncate ${chat.messageType === "file" && "italic" }`}>{ chat.messageType === "text" ? chat.lastMessage : "file"}</div>
            </div>
          </div>
        )) :
        <div className="flex items-center justify-center my-6">
            <p className="text-sm text-gray-200/50 max-w-32 text-center">Select a User from User&apos;s tab</p>
        </div>
        
      }
    </div>
  );
};

export default ChatList;