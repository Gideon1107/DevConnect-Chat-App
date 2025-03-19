import { RxCross1 } from "react-icons/rx";

const ChatHeader = () => {
  return (
    <div className="p-4 border-b border-slate-700 flex justify-between items-center">

      <div className="flex items-center gap-4">
        <img
          src=""
          alt=""
          className="w-8 h-8 rounded-full"
        />
        <span className="font-medium text-white truncate"> Demo User</span>
      </div>

      <button className="text-gray-400 focus:text-white duration-300 transition-all">
      <RxCross1 className="text-xl"/>
      </button>
    </div>
  );
};

export default ChatHeader;