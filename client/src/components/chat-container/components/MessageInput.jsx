import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { AiOutlineSend } from "react-icons/ai";
import EmojiPicker, { Emoji } from "emoji-picker-react";

const MessageInput = () => {

  const [message, setMessage] = useState("");
  const emojiRef = useRef();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  useEffect(() => {
    function handleClickOutsideEmojiPicker(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setIsEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideEmojiPicker)
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideEmojiPicker)
    }

  }, [emojiRef])


  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }

  const handleSendMessage = async () => {

  }


  return (
    <div className="h-[10vh] bg-slate-800 flex justify-center items-center px-8 mb-6 gap-4">
      <form onClick={(e) => e.preventDefault() } className="flex-1 flex  items-center gap-4 pr-5 bg-slate-600 rounded-tr-[12px] rounded-bl-[12px]">
        {/* Message input field */}
        <input type="text" className="flex-1 p-3 bg-transparent rounded-lg focus:border-none focus:outline-none placeholder:text-sm" placeholder="Start Typing..."
          value={message}
          onChange={(e) => setMessage(e.target.value)} />

          {/* Attahment button */}
        <button className="text-gray-200 focus:text-white duration-300 transition-all">
          <GrAttachment className="text-xl" />
        </button>

        <div className="relative items-center flex">
          {/* Emoji button */}
          <button className="text-gray-200 focus:text-white duration-300 transition-all"
          onClick={ () => setIsEmojiPickerOpen(!isEmojiPickerOpen)}>
            <RiEmojiStickerLine className="text-xl" />
          </button>

          {/* Emoji display */}
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker theme="dark"
            open={isEmojiPickerOpen}
            onEmojiClick={handleAddEmoji}
            autoFocusSearch={false}
            />

          </div>

        </div>
      </form>

      <button className="text-gray-200 bg-slate-700 p-3 rounded-[5px] focus:text-white duration-300 transition-all hover:bg-slate-600">
        <AiOutlineSend className="text-2xl" 
        onClick={handleSendMessage}/>
      </button>
    </div>
  );
};

export default MessageInput;