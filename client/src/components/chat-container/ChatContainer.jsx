import ChatHeader from "./components/ChatHeader"
import MessageInput from "./components/MessageInput"
import MessageContainer from "./components/MessageContainer"


const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-[100dvh] w-[100vw] bg-slate-900 flex flex-col md:static md:flex-1 overflow-hidden">
      <ChatHeader/>
      <div className="flex-1 overflow-y-auto relative">
        <MessageContainer/>
      </div>
      <MessageInput/>
    </div>
  )
}

export default ChatContainer