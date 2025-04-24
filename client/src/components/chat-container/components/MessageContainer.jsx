import { useAppStore } from "@/store/store"
import { GET_ALL_MESSAGES_ROUTE, GET_GROUP_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import axiosInstance from "@/utils/axiosConfig";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { GoFileZip } from "react-icons/go";
import { HiDownload } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";


const MessageContainer = () => {

  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
    isLoadingMessages,
    user
  } = useAppStore()

  const scrollRef = useRef();
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");


  useEffect(() => {

    const getMessages = async () => {
      try {
        
        const response = await axiosInstance.post(`${HOST}/${GET_ALL_MESSAGES_ROUTE}`, { id: selectedChatData._id })
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages)
        }
      } catch (error) {
         // Only show error if there's a real error, not just empty messages
         if (!error.response?.data?.messages) {
          console.error('Error fetching group messages:', error);
          toast.error(error.response?.data?.message || 'Failed to load group messages');
        }
      }
    }


    const getGroupMessages = async () => {
      try {
        const response = await axiosInstance.get(`${HOST}/${GET_GROUP_MESSAGES_ROUTE}/${selectedChatData._id}`)
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages)
        }
      } catch (error) {
         // Only show error if there's a real error, not just empty messages
         if (!error.response?.data?.messages) {
          console.error('Error fetching group messages:', error);
          toast.error(error.response?.data?.message || 'Failed to load group messages');
        }
      }
    }

    if (selectedChatData?._id && (!selectedChatMessages)) {
      if (selectedChatType === "dm") {
        getMessages();
      } else if (selectedChatType === "group") {
        getGroupMessages()
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages, selectedChatMessages])


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "instant", block: "end" });
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

          {
            selectedChatType === "group" && renderGroupMessages(message)
          }
        </div>
      )
    })
  }

  const checkIfImage = (fileUrl) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    return imageRegex.test(fileUrl);
  }

  // Function to handle file download
  const handleDownloadFileMessage = async (fileLink) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2; //Slower increment
      if (progress <= 95) { // Cap at 95% until actual download completes
        setFileDownloadProgress(progress);
      }
    }, 50); // Faster updates for smoother progress

    //initial delay to ensure loading state is visible
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Create and trigger download
      const link = document.createElement("a");
      link.href = fileLink;
      link.setAttribute(
        "download",
        decodeURIComponent(fileLink.split("/").pop())
      );
      document.body.appendChild(link);

      // Delay the actual download slightly
      setTimeout(() => {
        link.click();
        link.remove();
      }, 300);

      // Wait for "download" to complete
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Complete the progress to 100%
      clearInterval(interval);
      setFileDownloadProgress(100);
      toast.success("File downloaded successfully", { duration: 1000 });

      // Reset states after a short delay
      setTimeout(() => {
        setIsDownloading(false);
        setFileDownloadProgress(0);
      }, 1000);

    } catch (error) {
      clearInterval(interval);
      console.error('Download error:', error);
      toast.error("Failed to download file");
      setIsDownloading(false);
      setFileDownloadProgress(0);
    }
  };



  const renderDMMessages = (message) => (

    <div className={`${message.sender === selectedChatData._id ? "text-left " : "text-right"} text-sm mb-2`}>

      {/* chat messages */}
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
              ? <div className="cursor-pointer"
                onClick={() => {
                  setImageUrl(message.mediaUrl);
                  setShowImage(true);
                }
                }
              >
                <img src={message.mediaUrl} alt="image" width={200} height={200} />
              </div>
              : <div className="flex items-center justify-center gap-3 px-2 py-1">
                <span className="text-white/80 text-2xl bg-black/20 rounded-full p-2">
                  <GoFileZip />
                </span>
                <span className="text-sm text-slate-200 w-2/3 ">
                  {decodeURIComponent(message.mediaUrl.split("/").pop())}
                </span>
                <span className="bg-black/20 rounded-full p-1 cursor-pointer">
                  <HiDownload size={20} onClick={() => handleDownloadFileMessage(message.mediaUrl)} />
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


  const renderGroupMessages = (message) => {
    return (
      <div className={`mt-5 ${message.sender._id !== user._id ? "text-left" : "text-right"} text-sm mb-2`}>

        {/* text messages */}
        {
          message.messageType === "text" && (
            <div className={`${message.sender._id === user._id
              ? "bg-slate-400/50 text-white/80 border-slate-400/50 rounded-tr-2xl rounded-bl-2xl"
              : "bg-gray-600/50 text-white/80 border-gray-500/50 rounded-tl-2xl rounded-br-2xl"} border inline-block p-2 px-4 sm:max-w-[50%] break-words text-sm mb-[2px] ml-8`}>

              {message.content}
            </div>
          )
        }

        {/* File messages */}
        {
          message.messageType === "file" && (
            <div className={`${message.sender._id === user._id
              ? "bg-slate-400/50 text-white/80 border-slate-400/50 rounded-tr-2xl rounded-bl-2xl"
              : "bg-gray-600/50 text-white/80 border-gray-500/50 rounded-tl-2xl rounded-br-2xl"} inline-block  sm:max-w-[55%] break-words text-sm ml-8`}>

              {checkIfImage(message.mediaUrl)
                ? <div className="cursor-pointer"
                  onClick={() => {
                    setImageUrl(message.mediaUrl);
                    setShowImage(true);
                  }
                  }
                >
                  <img src={message.mediaUrl} alt="image" width={160} height={160} />
                </div>
                : <div className="flex items-center justify-center gap-2 px-2 py-1">
                  <span className="text-white/80 text-2xl bg-black/20 rounded-full p-2">
                    <GoFileZip />
                  </span>
                  <span className="text-sm text-slate-200 w-2/3">
                    {decodeURIComponent(message.mediaUrl.split("/").pop())}
                  </span>
                  <span className="bg-black/20 rounded-full p-1 cursor-pointer">
                    <HiDownload size={20} onClick={() => handleDownloadFileMessage(message.mediaUrl)} />
                  </span>
                </div>
              }
            </div>
          )}


        {
          message.sender._id !== user._id ?
            <div className="flex items-center justify-start gap-2">
              <div className="w-6 h-6 overflow-hidden rounded-full">
                <img src={message.sender.profilePicture} alt={message.sender.username} className="w-full h-full object-cover " />
              </div>
              <span className="text-sm text-white/60 font-light">{message.sender.username}</span>
              <span className="text-sm text-white/60 font-light">{moment(message.createdAt).format("LT")}</span>
            </div>
            : <div className="text-xs text-white/60 font-light">
              {moment(message.createdAt).format("LT")}
            </div>
        }

      </div>
    )
  }


  return (
    <>
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-[10px] sm:p-4 sm:px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {
        isLoadingMessages
          ? (
            <div className="flex items-center justify-center h-[100dvh]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
            </div>
          )
          : (
            <>
              {renderMessages()}
              <div ref={scrollRef} />
            </>
          )
      }
    </div>

      {
        showImage && (
          <div className="fixed top-0 left-0 w-full h-screen bg-black/95 flex items-center justify-center z-[99999]" style={{ position: 'fixed', zIndex: 99999 }}>
            <img src={imageUrl} alt="image" className="w-[90%] h-[60%] object-contain max-h-[calc(100vh-160px)]" style={{ marginTop: '-20px' }} />
            <div className="flex gap-8 fixed top-[70px] w-full justify-center" style={{ zIndex: 99999 }}>
              <button
                onClick={() => handleDownloadFileMessage(imageUrl)}
                className="bg-gray-800/80 rounded-full p-2 cursor-pointer">
                <HiDownload size={25} />
              </button>
              <button className="bg-gray-800/80 rounded-full p-2 cursor-pointer"
                onClick={() => {
                  setShowImage(false)
                  setImageUrl(null)
                }}>
                <RxCross1 size={25} />
              </button>
            </div>
          </div>
        )
      }
    </>
  )
}

export default MessageContainer