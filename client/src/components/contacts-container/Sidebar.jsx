import  { useState, useEffect } from 'react';
import UserProfile from '../UserProfile';
import ChatList from '../ChatList';
import UsersList from '../UsersList';
import GroupsList from '../GroupsList';
import logo from "../../assets/devLogo4.png"
import { MdGroups2 } from "react-icons/md";
import CreateGroupModal from '../CreateGroupModal';
import { useAppStore } from "@/store/store";
import { GET_USER_GROUPS_ROUTE, HOST, GETALLUSERS_ROUTE } from "@/utils/constants";
import axiosInstance from "@/utils/axiosConfig";

const Sidebar = () => {
  const { setGroups, setUsers } = useAppStore()
  const [activeTab, setActiveTab] = useState('messages');

  const [openGroupModal, setOpenGroupModal] = useState(false);


    // Fetch groups when the component mounts
    useEffect(() => {
      const fetchGroups = async () => {
        try {
          const response = await axiosInstance.get(`${HOST}/${GET_USER_GROUPS_ROUTE}`);
          if (response.data.success) {
            setGroups(response.data.groups)
          }
        } catch (error) {
          console.error('Error fetching groups:', error);
        }
      };

      const fetchAllUsers = async () => {
        try {
          const response = await axiosInstance.get(`${HOST}/${GETALLUSERS_ROUTE}`)
          if (response.data.success) {
            setUsers(response.data.allUsers)
          }
        } catch (error) {
          console.error('Error fetching all users:', error.response?.data?.message || error.message);
          setUsers(undefined)
        }
      }
  
      fetchGroups();
      fetchAllUsers();
      
    }, [setGroups, setUsers]);

  return (
    <div className="h-full fixed sm:static border-r border-slate-800 flex flex-col md:w-[35vw] lg:w-[30vw] xl:w-[21vw] bg-slate-900 w-full scrollbar-hidden"> 
       <div className="pl-4 pt-6 cursor-pointer ">
      <img src={logo} alt="logo" className="w-[150px] mb-6"/>
      </div>
      
      <div className="p-4">
        <button className="w-full bg-blue-600 text-white py-2 px-4 flex items-center justify-center gap-2 hover:bg-blue-700 rounded-tr-[12px] rounded-bl-[12px]"
        onClick={() => setOpenGroupModal(true)}
        >
           <MdGroups2 size={30}/>
          <span className="">Create Group</span>
        </button>
      </div>

      <div className="flex px-4 gap-2 mb-4 text-sm md:text-base border-b border-slate-800">
        <button 
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-2 truncate font-light text-opacity-90  ${
            activeTab === 'messages' 
              ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
              : 'text-gray-400 hover:text-blue-600 border-b-2 border-transparent'
          }`}
        >
          Messages
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 truncate font-light text-opacity-90 ${
            activeTab === 'users' 
              ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
              : 'text-gray-400 hover:text-blue-600 border-b-2 border-transparent'
          }`}
        >
          Users
        </button>
        <button 
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-2 truncate font-light text-opacity-90 ${
            activeTab === 'groups' 
              ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
              : 'text-gray-400 hover:text-blue-600 border-b-2 border-transparent'
          }`}
        >
          Groups
        </button>
      </div>

      {activeTab === 'messages' && <ChatList />}
      {activeTab === 'users' && <UsersList />}
      {activeTab === 'groups' && <GroupsList  />}

        {/* Profile info */}
      <UserProfile />

      {
        openGroupModal && 
        <CreateGroupModal setOpenGroupModal={setOpenGroupModal}/>
      }
    </div>
  );
};

export default Sidebar;

