import { useAppStore } from "@/store/store";
import Sidebar from "@/components/contacts-container/Sidebar";
import EmptyChatContainer from "@/components/empty-chat-container/EmptyChatContainer";
import ChatContainer from "@/components/chat-container/ChatContainer";




const Chat = () => {

  const { 
    user, 
    selectedChatType,
    selectedChatData,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();


  if (!user){
    return <div className="text-white">Loading...</div>
  }


  return (
    <div className="flex h-[100dvh] text-white overflow-hidden">

      {
        isUploading && ( <div className="h-[100vh] w-full fixed top-0 z-20 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-md">
          <h5 className="tet-4xl animate-pulse">Uploading File</h5>
          {fileUploadProgress}%
        </div>
        )
      }

      {
        isDownloading && ( <div className="h-[100vh] w-full fixed top-0 z-20 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-md">
          <h5 className="tet-4xl animate-pulse">Downloading File</h5>
          {fileDownloadProgress}%
        </div>
        )
      }


      <Sidebar/>
      {
        selectedChatType === undefined 
        ? 
        <EmptyChatContainer/> 
        : 
        <ChatContainer/>
      }
      
    </div>
  )
}

export default Chat

