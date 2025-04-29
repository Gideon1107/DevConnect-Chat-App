import { useAppStore } from "@/store/store";
import { GET_CHAT_LIST_FOR_DM_ROUTE, HOST, DELETE_CHAT_ROUTE, GET_ALL_MESSAGES_ROUTE } from "@/utils/constants";
import axiosInstance from "@/utils/axiosConfig";
import { useEffect, useState } from "react";
import { PiTrashLight } from "react-icons/pi";
import ConfirmDelete from "./ConfirmDelete";
import { capitalizeUsername } from "@/utils/capitalize";
import { toast } from "sonner";


const ChatList = () => {

  const [hoveredUser, setHoveredUser] = useState(null)  // Store the hover state on each chat to show the delete icon
  const [showDeleteChatModal, setShowDeleteChatModal] = useState(false)  // Stores the state of the delete chat modal
  const [currentChat, setCurrentChat] = useState({}) // Stores the current chat which its delete icon is clicked
  const {
    directMessagesList,
    setDirectMessagesList,
    selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
    closeChat,
    setIsLoadingMessages
  } = useAppStore()



  useEffect(() => {
    const getChatList = async () => {
      try {
        const response = await axiosInstance.get(`${HOST}/${GET_CHAT_LIST_FOR_DM_ROUTE}`)

        if (response.data.chatList) {
          setDirectMessagesList(response.data.chatList)
        }
      } catch (error) {
        console.error('Error fetching chat list:', error)
      }
    }

    getChatList()
  }, [setDirectMessagesList])


  // This function selects chat and fetch the messages then store it.
  const handleClick = async (chat) => {
    setSelectedChatType("dm");
    setSelectedChatData(chat);
    setIsLoadingMessages(true);

    if (selectedChatData && selectedChatData._id !== chat._id) {
      setSelectedChatMessages([])
    }

    try {
      const response = await axiosInstance.post(`${HOST}/${GET_ALL_MESSAGES_ROUTE}`, { id: chat._id })
      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages)
        setIsLoadingMessages(false)
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoadingMessages(false)
    }

  }

  const handleDeleteChat = async (chatId) => {
    try {
      const response = await axiosInstance.post(`${HOST}/${DELETE_CHAT_ROUTE}`, { chatId })
      if (response.data.success) {
        setDirectMessagesList(directMessagesList.filter((chat) => chat._id !== chatId)) // Filter out the chat to be deleted
        setShowDeleteChatModal(false) //Close cnfirm modal
        closeChat() // This will set selected chat as undefined and close chat
      }
      toast.success("Chat deleted", { duration: 1000 })
    } catch (error) {
      console.error('Error deleting chat:', error)
      toast.error(`Error deleting chat with ${currentChat.username}`)
    }
  }


  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden">
      {
        directMessagesList.length > 0 ?
          directMessagesList.map((chat) => (
            <div key={chat._id} className={`flex ${selectedChatData?.id === chat._id ? '' : 'sm:hover:bg-slate-800'}`}
              onMouseEnter={() => setHoveredUser(chat._id)}
              onMouseLeave={() => setHoveredUser(null)}
            >
              <div
                onClick={() => handleClick(chat)}
                className={`flex overflow-x-hidden items-center gap-3 p-3 cursor-pointer w-full active:bg-slate-800
              `}

              >
                <div className="relative">
                  <div className="w-8 h-8 overflow-hidden rounded-full">
                    <img
                      src={chat.profilePicture}
                      alt={chat.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${chat.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></span>
                </div>
                <div className=" max-w-60 ">
                  <div className="font-medium text-white truncate font-base">{capitalizeUsername(chat.username)}</div>
                  <div className={`text-sm text-gray-400 truncate ${chat.messageType === "file" && "italic"} font-light`}>{chat.messageType === "text" ? chat.lastMessage : "file"}</div>
                </div>
              </div>

              {/* Delete butyon */}
              {/* Desktop and tablet Delete button */}
              {
                hoveredUser === chat._id &&
                <button className="pr-2 sm:flex items-center hidden"
                  onClick={() => {
                    setShowDeleteChatModal(true)
                    setCurrentChat(chat)
                  }
                  }
                >
                  <PiTrashLight size={14} className="text-gray-500 hover:text-white" />
                </button>
              }

              {/* Mobile delete */}
              <button className="pr-4 items-center sm:hidden flex"
                onClick={() => {
                  setShowDeleteChatModal(true)
                  setCurrentChat(chat)
                }
                }
              >
                <PiTrashLight size={12} className="text-gray-500 hover:text-white" />
              </button>
            </div>
          )) :
          <div className="flex items-center justify-center my-6">
            <p className="text-sm text-gray-200/50 max-w-32 text-center font-normal">Select a User from User&apos;s tab</p>
          </div>
      }

      {showDeleteChatModal &&
        <ConfirmDelete
          isModalOpen={showDeleteChatModal}
          title={`Delete chat with ${capitalizeUsername(currentChat.username)}?`}
          body={`${capitalizeUsername(currentChat.username)} will be removed from your chat list until you message them or they message you again.`}
          buttonText="Yes, delete"
          onCancel={() => setShowDeleteChatModal(false)}
          onConfirm={() => handleDeleteChat(currentChat._id)}
        />}
    </div>
  );
};

export default ChatList;