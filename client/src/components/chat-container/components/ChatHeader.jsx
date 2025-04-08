import { RxCross1 } from "react-icons/rx";
import { useAppStore } from "@/store/store";
import { capitalizeUsername } from "@/utils/capitalize";

const ChatHeader = () => {

  const { closeChat, selectedChatData, selectedChatType } = useAppStore()

  return (
    <div className="p-4 border-b border-slate-700 flex justify-between items-center">
      <div className="flex items-center gap-4">
      {
        selectedChatType === "dm" ? <img
        src={selectedChatData.profilePicture}
        alt={selectedChatData.username}
        className="w-8 h-8 rounded-full"
      /> : <img
        src={`https://ui-avatars.com/api/?name=${selectedChatData.name}&background=random`}
        alt={selectedChatData.name}
        className="w-8 h-8 rounded-full"
      />
      }
        
        <span className="font-medium text-white truncate flex items-center">
          {
            selectedChatType === "dm" ? capitalizeUsername(selectedChatData.username)
            : <div className="flex flex-col">
              <span>{selectedChatData.name}</span>
              <span className="text-[12px] text-gray-400 font-light text-wrap">{selectedChatData.description}</span>
              </div>
          }
          
        </span>
      </div>

      <button className="text-gray-400 focus:text-white duration-300 transition-all"
      onClick={closeChat}
      >
        <RxCross1 className="text-xl"/>
      </button>
    </div>
  );
};

export default ChatHeader;