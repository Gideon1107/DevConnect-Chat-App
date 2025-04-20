import  { useState } from 'react';
import UserProfile from '../UserProfile';
import ChatList from '../ChatList';
import UsersList from '../UsersList';
import GroupsList from '../GroupsList';
import logo from "../../assets/devLogo4.png"
import { MdGroups2 } from "react-icons/md";
import CreateGroupModal from '../CreateGroupModal';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('messages');

  const [openGroupModal, setOpenGroupModal] = useState(false);

  return (
    <div className="h-full fixed sm:static border-r border-slate-800 flex flex-col md:w-[35vw] lg:w-[30vw] xl:w-[21vw] bg-slate-900 w-full"> 
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

      <div className="flex px-4 gap-2 mb-4 text-sm md:text-base border-b border-slate-700">
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

