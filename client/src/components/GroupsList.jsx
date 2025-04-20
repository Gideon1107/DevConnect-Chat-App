import { useAppStore } from "@/store/store";
import { GET_USER_GROUPS_ROUTE, HOST } from "@/utils/constants";
import { useEffect } from "react";
import axios from "axios";

const GroupsList = () => {
  const { groups, setSelectedChatType, setSelectedChatData, setGroups, setSelectedChatMessages } = useAppStore()


  // Fetch groups when the component mounts
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${HOST}/${GET_USER_GROUPS_ROUTE}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setGroups(response.data.groups)
        }
        
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [setGroups]);



  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden">
      {groups.map((group) => (
        <div
          key={group.name}
          onClick={() => {
            setSelectedChatType("group")
            setSelectedChatData(group)
            setSelectedChatMessages([])
          }}
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