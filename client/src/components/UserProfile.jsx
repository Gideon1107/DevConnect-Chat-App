import { useAppStore } from "@/store/store";
import axios from "axios"
import { toast } from "sonner"
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { IoIosLogOut } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import EditProfile from "./EditProfile";
import { useState } from "react";
import { capitalizeUsername } from "@/utils/capitalize";


const UserProfile = () => {

  const [isEditProfile, setIsEditProfile] = useState(false)

  const { user, setUser } = useAppStore();


  const onLogout = async () => {
    try {
      const response = await axios.post(`${HOST}/${LOGOUT_ROUTE}`, {}, {
        withCredentials: true, // Important: Sends cookies with the request
      });

      if (response.data.success) {
        toast.success(response.data.message, { theme: "light" , duration: 2000});
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

      <div className="flex items-center gap-5 sm:gap-3">
      <button onClick={() => setIsEditProfile(true)} title="Edit Profile">
        <CiSettings size={24} className=" text-white rounded-xl cursor-pointer hover:text-gray-200" />
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