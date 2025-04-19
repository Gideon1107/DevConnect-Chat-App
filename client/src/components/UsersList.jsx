import { useState, useMemo } from "react";
import { useAppStore } from "@/store/store";
import { capitalizeUsername } from "@/utils/capitalize";
import { CiSearch } from "react-icons/ci";



const UsersList = () => {


  const { users, setSelectedChatType, setSelectedChatData } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("");

  const [sortBy, setSortBy] = useState("all")

   // filtering & sorting 
   const filteredAndSortedUsers = useMemo(() => {
    let updatedUsers = users;

    // Apply filtering by search term
    if (searchTerm) {
        updatedUsers = updatedUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // 🔀 Apply sorting
    if (sortBy === "username") {
        updatedUsers = [...updatedUsers].sort((a, b) =>
            a.username.localeCompare(b.username)
        );
    } else if (sortBy === "online") {
        updatedUsers = updatedUsers.filter( (user) => 
          user.status === "online"  // Get online users only
        );
    }

    return updatedUsers;
}, [users, searchTerm, sortBy]); // Only re-compute when these values change

    const selectNewUser = (userData) => {
      setSelectedChatType("dm");
      setSelectedChatData(userData);
    }
  


  return (
    <div className="flex-1 overflow-y-auto ">
  
      <div className="flex flex-1 relative px-4 items-center  overflow-hidden mb-4">
        <input type="text" className="w-full p-2  text-gray-900 outline-none focus:outline-none caret-black placeholder:italic rounded-tr-lg rounded-bl-lg pr-12 pl-2" 
        placeholder="search user" 
        autoComplete="off"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between mb-6 px-4">
        <button className={`px-4 md:px-2  rounded-tr-lg rounded-bl-lg text-sm py-1 ${sortBy === "all" ? "bg-blue-700" : "bg-slate-600"}`}
        onClick={() => setSortBy("all")}
        >All</button>

        <button className={`px-4 md:px-2 rounded-tr-lg rounded-bl-lg text-sm py-1 ${sortBy === "online" ? "bg-blue-700" : "bg-slate-600"}`}
        onClick={() => setSortBy("online")}
        >Online</button>

        <button className={`px-4 md:px-2 rounded-tr-lg rounded-bl-lg text-sm py-1 truncate ${sortBy === "username" ? "bg-blue-700" : "bg-slate-600"}`}
        onClick={() => setSortBy("username")}
        >Username(A-Z)</button>
      </div>

      {
        filteredAndSortedUsers.length > 0 ? 
        (filteredAndSortedUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => selectNewUser(user)}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-700"
            >
              <div className="relative">
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${
                  user.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                }`}></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{capitalizeUsername(user.username)}</div>
                <div className="text-sm text-gray-400 capitalize">{user.status}</div>
              </div>
            </div>
          ))
        ) : 
        <div className="flex flex-col items-center mt-20">
          <CiSearch size={50} className="text-gray-400"/>
          <p className="text-center py-5 font-light">No users found</p>
        </div>
        
      }
    </div>
  );
};

export default UsersList;