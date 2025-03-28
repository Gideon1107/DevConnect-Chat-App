import { useAppStore } from "@/store/store";
import Sidebar from "@/components/contacts-container/Sidebar";
import EmptyChatContainer from "@/components/empty-chat-container/EmptyChatContainer";
import ChatContainer from "@/components/chat-container/ChatContainer";




const Chat = () => {

  const { user, selectedChatType, selectedChatData  } = useAppStore();


  if (!user){
    return <div className="text-white">Loading...</div>
  }


  return (
    <div className="flex h-screen text-white overflow-hidden">

      <Sidebar/>
      {
        selectedChatType === undefined ? <EmptyChatContainer/> : <ChatContainer/>
      }
      
    </div>
  )
}

export default Chat

