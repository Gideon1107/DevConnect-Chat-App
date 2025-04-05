import { useAppStore } from "@/store/store"
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import axios from "axios";
import moment from "moment";
import { useEffect, useRef } from "react";
import { GoFileZip } from "react-icons/go";
import { IoMdDownload } from "react-icons/io";
import { HiDownload } from "react-icons/hi";


const MessageContainer = () => {

  const { 
    selectedChatType, 
    selectedChatData,
    selectedChatMessages, 
    setSelectedChatMessages
   } = useAppStore()

  const scrollRef = useRef();


  useEffect(() => {

    const getMessages = async () => {
      try {
        const response = await axios.post(`${HOST}/${GET_ALL_MESSAGES_ROUTE}`,
          {id: selectedChatData._id},
          {withCredentials: true})
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages)
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (selectedChatData._id) {
      if (selectedChatType === "dm") {
        getMessages();
      }
    }
  },[selectedChatData, selectedChatType, setSelectedChatMessages])


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "instant" , block: "end" });
    }
  }, [selectedChatMessages])





  const renderMessages = () => {
    let lastDate = null;

    // Sort messages by createdAt (oldest first)
    const sortedMessages = [...selectedChatMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return sortedMessages.map((message, index) => {
      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id || index}>
          {showDate &&
            <div className="text-center text-gray-500 my-2">
              {moment(message.createdAt).format("LL")}
            </div>}

          {
            selectedChatType === "dm" && renderDMMessages(message)
          }
        </div>
      )
    })
  }

  const checkIfImage = (fileUrl) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    return imageRegex.test(fileUrl);
  }

  const handleDownloadFileMessage = async (fileLink) => {
    console.log(fileLink)
    const link = document.createElement("a");
    link.href = fileLink;
    window.open(fileLink, "_blank");
  }

  const renderDMMessages = (message) => (

    <div className={`${message.sender === selectedChatData._id ? "text-left " : "text-right"} text-sm mb-2`}>
      
      {/* Text messages */}
      {
        message.messageType === "text" && (
        <div className={`${message.sender !== selectedChatData._id
          ? "bg-slate-400/50 text-white/80 border-slate-400/50 rounded-tr-2xl rounded-bl-2xl"
          : "bg-gray-600/50 text-white/80 border-gray-500/50 rounded-tl-2xl rounded-br-2xl"} border inline-block p-2 px-4 sm:max-w-[50%] break-words text-sm`}>
  
          {message.content}
        </div> 
      )}

      {/* File messages */}
      {
        message.messageType === "file" && (
        <div className={`${message.sender !== selectedChatData._id
          ? "bg-slate-400/50 text-white/80 border-slate-400/50 rounded-tr-2xl rounded-bl-2xl"
          : "bg-gray-600/50 text-white/80 border-gray-500/50 rounded-tl-2xl rounded-br-2xl"} inline-block  sm:max-w-[55%] break-words text-sm`}>
  
          {checkIfImage(message.mediaUrl) 
          ? <div className="cursor-pointer">
              <img src={message.mediaUrl} alt="image" height={250} width={250}/>
            </div>
          : <div className="flex items-center justify-center gap-5 px-2 py-1">
              <span className="text-white/80 text-2xl bg-black/20 rounded-full p-2">
                <GoFileZip />
              </span>
              <span className="text-sm text-slate-200 w-2/3 ">
                {message.mediaUrl.split("/").pop().replace(/%20/g, " ")}
              </span>
              <span>
                <HiDownload size={20} onClick={() => handleDownloadFileMessage(message.mediaUrl)}/>
              </span>
            </div>
        }
        </div> 
      )}  




      <div className="text-xs text-gray-500">
        {moment(message.createdAt).format("LT")}
      </div>
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  )
}

export default MessageContainer