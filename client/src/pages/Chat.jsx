import { useAppStore } from "@/store/store";
import Sidebar from "@/components/contacts-container/Sidebar";
import SimpleEmptyChat from "@/components/empty-chat-container/SimpleEmptyChat";
import ChatContainer from "@/components/chat-container/ChatContainer";
import LoadingScreen from "@/components/LoadingScreen";
import EmptyChatContainer from "@/components/empty-chat-container/EmptyChatContainer";



const Chat = () => {

  const {
    user,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();

  if (!user){
    return <LoadingScreen message="Loading DevConnect Chat..." />;
  }


  return (
    <div className="flex h-[100dvh] text-white overflow-hidden scrollbar-hidden">

      {
        isUploading && ( <div className="h-[100vh] w-full fixed top-0 z-20 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-md">
          <h5 className="text-sm sm:text-base animate-pulse">Uploading File</h5>
          {fileUploadProgress}%
        </div>
        )
      }

      {
        isDownloading && ( <div className="h-[100vh] w-full fixed top-0 z-20 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-md">
          <h5 className="text-sm sm:text-base animate-pulse">Downloading File</h5>
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

