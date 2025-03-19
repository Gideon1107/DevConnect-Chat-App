import { useAppStore } from "@/store/store";
import axios from "axios"
import { toast } from "sonner"
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { IoIosLogOut } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import EditProfile from "./EditProfile";
import { useState } from "react";


const UserProfile = () => {

  const [isEditProfile, setIsEditProfile] = useState(false)

  const { user, setUser } = useAppStore();

  // Function to capitalize the first letter of the username
  const capitalizeUsername = (username) => {
    if (!username) return ''; // Return empty string if username is falsy
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  const onLogout = async () => {
    try {
      // Call logout API
      const response = await axios.post(`${HOST}/${LOGOUT_ROUTE}`, {}, {
        withCredentials: true, // Important: Sends cookies with the request
      });

      if (response.data.success) {
        toast.success(response.data.message, { theme: "light" });
        setTimeout(() => {
          setUser(undefined)
          window.location.href = '/'; // Redirect to login page
        }, 1000);
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  const setisOpen = () => {
    setIsEditProfile(false)
  }

  return (

    <div className="p-4 flex items-center gap-6 justify-between">
      <div className="flex items-center gap-3">
        <img
          src={user.profilePicture ? user.profilePicture : "https://ui-avatars.com/api/?name=User&background=random"}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold truncate text-white">
          {
            user.username ? capitalizeUsername(user.username) : ""
          }
        </span>
      </div>

      <div className="flex items-center gap-3">
      <button onClick={() => setIsEditProfile(true)} title="Edit Profile">
        <CiSettings size={24} className=" text-white rounded-xl cursor-pointer hover:text-gray-200" />
      </button>

      <button onClick={onLogout} title="Logout">
        <IoIosLogOut size={24} className=" text-white rounded-xl cursor-pointer hover:text-gray-200" />
      </button>
      </div>

      {
        isEditProfile ? <EditProfile isOpen={true} handleIsOpen={setisOpen}/> : ""
      }

    </div>
  );
};

export default UserProfile;