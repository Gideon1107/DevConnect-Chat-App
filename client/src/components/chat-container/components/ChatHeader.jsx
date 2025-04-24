import { RxCross1 } from "react-icons/rx";
import { useAppStore } from "@/store/store";
import { capitalizeUsername } from "@/utils/capitalize";
import { HOST, GET_GROUP_MEMBERS_ROUTE } from "@/utils/constants";
import axiosInstance from "@/utils/axiosConfig";
import { useEffect, useState } from "react";
import GroupDetailsModal from "@/components/GroupDetailsModal";

const ChatHeader = () => {

  const { closeChat, selectedChatData, selectedChatType, setSelectedChatData, setSelectedChatType } = useAppStore()
  const [members, setMembers] = useState([])  // Store group members to display in the group details modal
  const [groupDetailsModal, setGroupDetailsModal] = useState(false) // State to show group details modal

  const getGroupMembers = async (members) => {
    try {
      const response = await axiosInstance.get(`${HOST}/${GET_GROUP_MEMBERS_ROUTE}`, {
        params: {
          members: members
        }
      })
      if (response.data.success) {
        setMembers(response.data.members)
      }
    } catch (error) {
      console.error('Error fetching group members:', error)
    }
  }

  useEffect(() => {
    if (selectedChatData.members) {
      getGroupMembers(selectedChatData.members)
    }
  }, [selectedChatData])


  return (
    <div className={`px-4 pt-3 pb-2 border-b border-slate-800 flex justify-between items-center sticky top-0 z-50 ${selectedChatType === "group" ? "cursor-pointer" : ""}`}
    style={{ position: '-webkit-sticky' }} // For iOS support
    onClick={selectedChatType === "group" ? () => {
      setGroupDetailsModal(true)
    }: null }>
      <div className="flex items-center gap-4">
      {
        selectedChatType === "dm" ? <img
        src={selectedChatData.profilePicture}
        alt={selectedChatData.username}
        className="w-8 h-8 rounded-full"
      /> : <img
        src={selectedChatData.image}
        alt={selectedChatData.name}
        className="w-8 h-8 rounded-full"
      />
      }

        <span className="font-medium text-white truncate flex items-center">
          {
            selectedChatType === "dm" ? capitalizeUsername(selectedChatData.username)
            : <div className="flex flex-col">
              <span>{selectedChatData.name}</span>
              <span className="text-[12px] text-gray-400 font-light text-wrap">tap here for group info</span>
              </div>
          }

        </span>
      </div>

      <button className="text-gray-400 focus:text-white duration-300 transition-all"
      onClick={closeChat}
      >
        <RxCross1 className="text-xl"/>
      </button>

      {
        groupDetailsModal &&
        <GroupDetailsModal
        setSelectedChatData={setSelectedChatData}
        setSelectedChatType={setSelectedChatType}
        members={members}
        setMembers={setMembers}
        setGroupDetailsModal={setGroupDetailsModal}
        groupDetailsModal={groupDetailsModal}
        />
      }
    </div>


  );
};

export default ChatHeader;