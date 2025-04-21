import { useAppStore } from "@/store/store";
import axiosInstance from "@/utils/axiosConfig";
import { toast } from "sonner"
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { IoIosLogOut } from "react-icons/io";
import { FaUserEdit } from "react-icons/fa";
import EditProfile from "./EditProfile";
import { useState } from "react";
import { capitalizeUsername } from "@/utils/capitalize";
import { removeTokens } from "@/utils/authUtils";


const UserProfile = () => {

  const [isEditProfile, setIsEditProfile] = useState(false)

  const { user, setUser } = useAppStore();


  const onLogout = async () => {
    try {
      // Send logout request using our custom axios instance
      const response = await axiosInstance.post(`${HOST}/${LOGOUT_ROUTE}`, {});

      // Clear tokens from localStorage
      removeTokens();

      // Update UI
      toast.success(response.data?.message || 'Logged out successfully', { theme: "light" , duration: 2000});
      setTimeout(() => {
        setUser(undefined)
        window.location.href = '/'; // Redirect to login page
      }, 1000);
    } catch (error) {
      // Even if the server request fails, we should still clear local tokens
      removeTokens();
      setUser(undefined);
      toast.error(error.message || 'Logged out with errors');
      window.location.href = '/';
    }
  };


  const setisOpen = () => {
    setIsEditProfile(false)
  }

  return (

    <div className="p-4 flex items-center gap-6 justify-between border-t-[1px] border-slate-800">
      <div className="flex items-center gap-3 cursor-pointer"
      onClick={() => setIsEditProfile(true)}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          src={user.profilePicture ? user.profilePicture : "https://ui-avatars.com/api/?name=User&background=random"}
          alt="avatar"
          className="w-full h-full object-cover"
        />
        </div>

        <span className="font-semibold truncate text-white">
          {
            user.username ? capitalizeUsername(user.username) : ""
          }
        </span>
      </div>

      <div className="flex items-center gap-6 sm:gap-5">
      <button onClick={() => setIsEditProfile(true)} title="Edit Profile">
        <FaUserEdit size={22} className="text-gray-400 cursor-pointer hover:text-blue-300 transition-colors" />
      </button>

      <button onClick={onLogout} title="Logout">
        <IoIosLogOut size={24} className=" text-red-700 rounded-xl cursor-pointer hover:text-red-600" />
      </button>
      </div>

      {
        isEditProfile && <EditProfile isOpen={true} handleIsOpen={setisOpen}/>
      }

    </div>
  );
};

export default UserProfile;