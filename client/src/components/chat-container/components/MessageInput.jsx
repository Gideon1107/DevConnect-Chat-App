import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { AiOutlineSend } from "react-icons/ai";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import { useAppStore } from "@/store/store";
import { useSocket } from "@/context/SocketContext";
import axiosInstance from "@/utils/axiosConfig";
import { HOST, SEND_FILE_ROUTE } from "@/utils/constants";
import { toast } from "sonner";




const MessageInput = () => {

  const [message, setMessage] = useState("");
  const emojiRef = useRef();
  const fileInputRef = useRef(null);
  const socket = useSocket()
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const {
    selectedChatType,
    selectedChatData,
    user,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore()



  // To Close the emoji picker when clicking outside of it

  // useEffect(() => {
  //   function handleClickOutsideEmojiPicker(event) {
  //     if (emojiRef.current && !emojiRef.current.contains(event.target)) {
  //       setIsEmojiPickerOpen(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutsideEmojiPicker)
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutsideEmojiPicker)
  //   }

  // }, [emojiRef])


  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }

  const handleSendMessage = async () => {
    if (selectedChatType === "dm") {
      socket.emit("sendMessage", {
        sender: user._id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        mediaUrl: undefined,
      })
    } else if (selectedChatType === "group") {
      socket.emit("send-group-message", {
        sender: user._id,
        content: message,
        messageType: "text",
        mediaUrl: undefined,
        groupId: selectedChatData._id
      })
    }
    setMessage(""); //Clear the message input box
  }


  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Prevent the default behavior of Enter (e.g., inserting a newline in the input)
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await axiosInstance.post(`${HOST}/${SEND_FILE_ROUTE}`, formData, {
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((data.loaded * 100) / data.total));
          }
        });

        // Check if the response is successful
        if (response.data.success && response.data) {
          setIsUploading(false);
          setFileUploadProgress(0);
          if (selectedChatType === "dm") {
            // Emit the file message to the server
            socket.emit("sendMessage", {
              sender: user._id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              mediaUrl: response.data.fileUrl,
            })
          } else if (selectedChatType === "group") {
            socket.emit("send-group-message", {
              sender: user._id,
              content: undefined,
              messageType: "file",
              mediaUrl: response.data.fileUrl,
              groupId: selectedChatData._id
            })
          }
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      setIsUploading(false);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Show toast with error message
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }


  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 bg-slate-900 w-full">
      <div className="bg-slate-900 flex justify-center items-center px-4 sm:px-8 sm:mb-2 mb-1 gap-4">
        <div className="flex-1 flex  items-center gap-4 pr-5 bg-slate-800 rounded-tr-[12px] rounded-bl-[12px]">
          {/* Message input field */}
          <input type="text" className="flex-1 p-3 bg-transparent rounded-lg focus:border-none focus:outline-none placeholder:text-sm" placeholder="Start Typing..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Attahment button */}
          <button
            className="text-gray-200 focus:text-white duration-300 transition-all">
            <GrAttachment className="text-xl" onClick={handleFileUpload} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleAttachmentChange} className="hidden" />

          <div className="relative items-center flex">
            {/* Emoji button */}
            <button className="text-gray-200 focus:text-white duration-300 transition-all"
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}>
              <RiEmojiStickerLine className="text-xl" />
            </button>

            {/* Emoji display */}
            <div className="absolute bottom-12 -right-16 sm:right-0" ref={emojiRef}>
              <EmojiPicker theme="auto" width={320} height={440}
                open={isEmojiPickerOpen}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />

            </div>

          </div>
        </div>

        <button className="text-gray-200 bg-slate-800 p-3 rounded-[5px] focus:text-white duration-300 transition-all hover:bg-slate-700">
          <AiOutlineSend className="text-2xl"
            onClick={handleSendMessage} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;