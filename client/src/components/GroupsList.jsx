import { useAppStore } from "@/store/store";
import { GET_GROUP_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import axiosInstance from "@/utils/axiosConfig";

const GroupsList = () => {
  const { groups, setSelectedChatType, setSelectedChatData, setSelectedChatMessages, setIsLoadingMessages } = useAppStore()


  // This function select chat as group and fetch the messages
  const handleGroupSelect = async (group) => {
    try {
      setSelectedChatMessages([]);
      setSelectedChatType("group");
      setSelectedChatData(group);
      setIsLoadingMessages(true)

      // Fetch messages immediately when group is selected
      const response = await axiosInstance.get(`${HOST}/${GET_GROUP_MESSAGES_ROUTE}/${group._id}`);
      
      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
        setIsLoadingMessages(false)
      }
    } catch (error) {
      console.error('Error prefetching group messages:', error);
      // Don't show error toast here since MessageContainer will retry
    } finally {
      setIsLoadingMessages(false)
    }
  };

  if (!groups) return null;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden">
      {groups.map((group) => (
        <div
          key={group.name}
          onClick={() => handleGroupSelect(group)}
          className="flex items-center gap-3 p-3 cursor-pointer sm:hover:bg-slate-800 max-sm:active:bg-slate-800"
        >
          <img
            src={group.image}
            alt={group.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white truncate text-base">{group.name}</div>
            <div className="text-sm text-gray-400 font-light">{group.members.length} members</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupsList;