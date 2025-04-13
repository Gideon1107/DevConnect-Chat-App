import { GET_GROUP_ADMIN_ROUTE, HOST, EDIT_GROUP_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store/store";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { useEffect, useState } from "react";
import { capitalizeUsername } from "@/utils/capitalize";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "sonner";


const GroupDetailsModal = ({ members, setSelectedChatData, setSelectedChatType, setGroupDetailsModal, groupDetailsModal }) => {

    const { selectedChatData } = useAppStore() // Getting the selected chat data from the store, could be dm or group
    const [admin, setAdmin] = useState("")
    const [isEditing, setIsEditing] = useState(false)


    // This function close the modal
    const handleClose = () => {
        setGroupDetailsModal(false)

    }

    // Edit group schema
    const editGroupSchema = Yup.object().shape({
        name: Yup.string()
            .required('Group name is required')
            .min(3, 'Group name must be at least 3 characters')
            .matches(/^[a-zA-Z0-9\s-_]+$/, 'Group name can only contain letters, numbers, spaces, hyphens and underscores'),
        description: Yup.string()
            .required('Group description is required')
            .min(10, 'Description must be at least 10 characters')
            .max(200, 'Description cannot exceed 200 characters'),
    })

    // Initialize the form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(editGroupSchema),
        defaultValues: {
            name: selectedChatData.name,  // Set default values for the edit form
            description: selectedChatData.description // Set default values for the edit form
        }
    })


    // This function handles the edit group form submission
    const onEditGroupSubmit = async (data) => {
        const { name, description } = data;
        try {
            const response = await axios.put(`${HOST}/${EDIT_GROUP_ROUTE}`, {
                groupId: selectedChatData._id,
                name: name,
                description: description
            }, {
                withCredentials: true,
            })
            if (response.data.success) {
                toast.success("Group updated successfully")
                setSelectedChatData(response.data.group) // Set selected chat data to the updated group
                setIsEditing(false)
            } else {
                toast.error(response.data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error("Failed to edit group", error.message)
        }
    }

    // This function gets the group admin
    const getGroupAdmin = async () => {
        const admindId = selectedChatData.createdBy

        try {
            const response = await axios.get(`${HOST}/${GET_GROUP_ADMIN_ROUTE}`, {
                params: {
                    adminId: admindId
                },
                withCredentials: true,
            })
            setAdmin(response.data.admin)  // Set admin to the admin received
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getGroupAdmin()
    }, [])

    // Early return if modal shouldn't be shown
    if (!groupDetailsModal) return null;

    return (
        <div className="fixed inset-0 bg-black/80 max-sm: flex sm:items-center sm:justify-center z-10">
            <div className={`bg-slate-900 p-4 sm:rounded-lg ${isEditing ? "max-w-lg w-full" : "w-full max-w-xl"} border border-slate-800`}>
                {
                    isEditing ? 
                    <div className="p-4">
                        <div className="flex justify-between border-b-[1px] border-slate-800 pb-2">
                            <h2 className="text-lg font-medium text-white">Edit Group</h2>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(false)
                            }}
                                className="p-2">
                                <RxCross1 className="text-gray-400 hover:text-white transition-all duration-300 cursor-pointer" />
                            </button>
                        </div>

                        {/* Edit Group Form */}
                        <form className="flex flex-col gap-6  flex-1 mt-5"
                        onSubmit={handleSubmit(onEditGroupSubmit)}
                        >
                            {/* Group Name Field */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="" className="text-sm text-gray-200">Group Name</label>
                                <input
                                    {...register("name")}
                                    type="text" className="flex-1 pl-3 p-2 text-white focus:outline-none rounded-tr-[10px] rounded-bl-[10px]  bg-slate-800 border text-base border-slate-700 "
                                    autoComplete="off"
                                />
                                {
                                    errors.name && (<p className="text-red-600 text-sm">{errors.name.message}</p>)
                                }
                            </div>

                            {/* Group Description Field */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="" className="text-sm text-gray-200">Group Description</label>
                                <textarea
                                    {...register("description")}
                                    type="text" className="flex-1 pl-3 p-2 text-white focus:outline-none rounded-tr-[10px] rounded-bl-[10px]  bg-slate-800 border text-base border-slate-700 "
                                    autoComplete="off"
                                />
                                {
                                    errors.description && (<p className="text-red-600 text-sm">{errors.description.message}</p>)
                                }
                            </div>

                            {/* Submit */}
                            <button className="p-3 my-3 bg-slate-700 rounded-[5px] hover:bg-slate-600 font-light mt-8 sm:mt-4">
                                Save Changes
                            </button>
                        </form>
                    </div>
                    : members &&
                    <div className="p-2 flex  gap-6 flex-col">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3 ">
                            <div className="flex flex-col gap-1 ">
                                <h2 className="text-xl font-semibold text-white">{selectedChatData.name}</h2>
                                <h3 className="text-sm text-gray-400 font-light">{selectedChatData.description}</h3>
                            </div>

                            <button onClick={(e) => {
                                e.stopPropagation();
                                handleClose()
                            }}
                                className="p-2">
                                <RxCross1 className="text-gray-400 hover:text-white transition-all duration-300 cursor-pointer" />
                            </button>

                        </div>

                        <div className="flex flex-col">
                            <div className="mb-6">
                                <span className="text-sm text-gray-400">Created by: </span>
                                <span className="text-sm text-white pl-2 font-normal">{admin._id === useAppStore.getState().user._id ? "You" : capitalizeUsername(admin.username)}</span>
                            </div>

                            <span className="text-sm text-gray-400 font-normal mb-2">{members.length} members:</span>

                            {/* Members */}
                            <div className="bg-slate-800/20 rounded-sm mb-4 overflow-y-auto sm:max-h-[200px] max-h-[65vh] custom-scrollbar ">
                            {
                                members.map((member) => {
                                    const isCurrentUser = member._id === useAppStore.getState().user._id; // Check if member is current user
                                    return (
                                    <div key={member._id}
                                        className={`flex items-center gap-2 border-b-[1px] border-slate-800 hover:bg-slate-800/50 py-3 rounded-md ${isCurrentUser ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isCurrentUser) { // Check if member is not current user
                                                setSelectedChatType("dm")
                                                setSelectedChatData(member)
                                                handleClose()
                                            }
                                        }}
                                        aria-disabled={isCurrentUser}
                                        title={`${isCurrentUser && "You" }`}
                                    >
                                        <img src={member.profilePicture} alt="member.username" className="w-6 h-6 rounded-full" key={member._id}/>
                                        <span className="text-white font-normal text-sm">{member.username}</span>
                                    </div>
                                    )
                                })
                            }

                            </div>
                            
                        </div>

                        {/* Action Button */}
                        <div>
                            {
                                admin._id === useAppStore.getState().user._id ?
                                <div className="flex justify-between">
                                    <button className="p-2 px-4 bg-slate-700/90 rounded-sm hover:bg-slate-800 transition-all duration-300 text-sm"
                                    onClick={() => setIsEditing(true)}
                                    >Edit Group</button>
                                    <button className="p-2 px-4 bg-red-700 rounded-sm text-sm hover:bg-red-700/80 transition-all duration-300">Delete Group</button>
                                </div> : <button className="p-2 px-4 bg-red-700 rounded-sm text-sm hover:bg-red-700/80 transition-all duration-300">Leave Group</button>
                            }
                        </div>
                    </div>
                }
               
            </div>
        </div>
    )
}

export default GroupDetailsModal