import {
    GET_GROUP_ADMIN_ROUTE,
    HOST, EDIT_GROUP_ROUTE,
    DELETE_GROUP_ROUTE,
    LEAVE_GROUP_ROUTE,
    GET_ALL_USERS_ROUTE,
    ADD_GROUP_MEMBER_ROUTE,
    GET_USER_GROUPS_ROUTE,
    REMOVE_GROUP_MEMBER_ROUTE
} from "@/utils/constants";

import { useAppStore } from "@/store/store";
import { RxCross1 } from "react-icons/rx";
import { IoIosAdd } from "react-icons/io";
import axiosInstance from "@/utils/axiosConfig";
import { useEffect, useState } from "react";
import { capitalizeUsername } from "@/utils/capitalize";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "sonner";
import AsyncSelect from 'react-select/async';
import customStyles from '@/utils/customStyles';
import ConfirmDelete from "./ConfirmDelete";



const GroupDetailsModal = ({ members, setMembers, setSelectedChatData, setSelectedChatType, setGroupDetailsModal, groupDetailsModal }) => {

    const { selectedChatData, setGroups, groups, setSelectedChatMessages } = useAppStore() // Getting the selected chat data from the store, could be dm or group
    const [admin, setAdmin] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [showAddUser, setShowAddUser] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [newSelectedMembers, setNewSelectedMembers] = useState([]) // State to store the selected users for adding user to a group
    const [showConfirmRemoveModal, setShowConfirmRemoveModal] = useState(false) // State to show confirm remove modal
    const [showConfirmGroupDeleteModal, setShowConfirmGroupDeleteModal] = useState(false) // State to show confirm group delete modal
    const [showConfirmLeaveGroupModal, setShowConfirmLeaveGroupModal] = useState(false) // State to show confirm leave group modal
    const [memberIdToRemove, setMemberIdToRemove] = useState(null) // State to store member Id to remove which will be passed as props to confirm modal
    const [memberToRemove, setMemberToRemoe] = useState("") //State to store member username to be removed which will be passed as props to confirm modal

    // Fetch groups
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

        fetchGroups();
    }, [setMembers, setGroups, newSelectedMembers, setNewSelectedMembers, isEditing]);


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


    // This function to fetch all users
    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get(`${HOST}/${GET_ALL_USERS_ROUTE}`);
            if (response.data.success) {
                // Filter out users who are already members
                const filteredUsers = response.data.user.filter(
                    user => !members.some(member => member._id === user.value)
                );
                setAllUsers(filteredUsers);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch users');
        }
    };

    // function to load options based on search input
    const loadOptions = async (inputValue) => {
        if (!inputValue) return [];
        return allUsers.filter(user =>
            user.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };


    // function to handle AsyncSelect changes
    const handleSelectChange = (selected) => {
        setNewSelectedMembers(selected || []);
    };


    // This function handles adding users
    const handleAddMembers = async () => {
        if (!newSelectedMembers.length) {
            toast.error('Please select users to add');
            return;
        }
        try {
            const response = await axiosInstance.put(`${HOST}/${ADD_GROUP_MEMBER_ROUTE}`, {
                groupId: selectedChatData._id,
                newMembers: newSelectedMembers.map(user => user.value)
            });

            if (response.data.success) {
                toast.success('Members added successfully');
                // Update members list
                setMembers([...members, ...response.data.newMembersData]);
                setShowAddUser(false);
                setNewSelectedMembers([])
            }

        } catch (error) {
            console.error('Error adding members:', error);
            toast.error(error.response?.data?.message || 'Failed to add members');
        }
    };


    // This function handles remove members
    const handleRemoveMember = (memberId) => async () => {
        try {
            const response = await axiosInstance.put(`${HOST}/${REMOVE_GROUP_MEMBER_ROUTE}`,
                {
                    memberId: memberId,
                    groupId: selectedChatData._id
                }
            )
            if (response.data.success) {
                setMembers(members.filter((member) => member._id !== memberId))
                setShowConfirmRemoveModal(false)
                toast.success(`${memberToRemove} removed successfully`)
                setMemberIdToRemove(null)
                setMemberToRemoe("")
            }
        } catch (error) {
            console.error('Error removing member:', error);
            toast.error(error.response?.data?.message || "Failed to remove user")
        }
    }



    // This function handles the edit group form submission
    const onEditGroupSubmit = async (data) => {
        const { name, description } = data;
        try {
            const response = await axiosInstance.put(`${HOST}/${EDIT_GROUP_ROUTE}`, {
                groupId: selectedChatData._id,
                name: name,
                description: description
            })
            if (response.data.success) {
                toast.success("Group updated successfully", {duration: 2000})
                setSelectedChatData(response.data.group) // Set selected chat data to the updated group
                setIsEditing(false)
                setGroupDetailsModal(false)
            } else {
                toast.error(response.data.message, {duration: 2000})
            }

        } catch (error) {
            console.error('Error editing group:', error);
            toast.error(error.response?.data?.message || "Failed to edit group", {duration: 2000})
        }
    }


    // This function handles deleting the group
    const handleDeleteGroup = async () => {
        try {
            const response = await axiosInstance.delete(`${HOST}/${DELETE_GROUP_ROUTE}`, {
                data: { groupId: selectedChatData._id }
            });
            if (response.data.success) {
                toast.success("Group deleted successfully", {duration: 2000})
                setGroupDetailsModal(false)
                useAppStore.getState().closeChat() // This will set selectedChatdata, selectedChatType and selectedChatMessages to undefined
                setGroups(groups.filter(group => group._id !== selectedChatData._id)) // Remove the deleted group from the groups list
            } else {
                toast.error(response.data.message, {duration: 2000})
            }
        } catch (error) {
            console.error('Error deleting group:', error);
            toast.error(error.response?.data?.message || "Failed to delete group", {duration: 2000})
        }
    }


    // This function handles leaving the group
    const handleLeaveGroup = async () => {
        try {
            const response = await axiosInstance.put(`${HOST}/${LEAVE_GROUP_ROUTE}`,
                { groupId: selectedChatData._id }
            );
            if (response.data.success) {
                toast.success(`You've left ${selectedChatData.name} group successfully`, {duration: 2000})
                setGroupDetailsModal(false)
                useAppStore.getState().closeChat() // This will set selectedChatdata, selectedChatType and selectedChatMessages to undefined
                setGroups(groups.filter(group => group._id !== selectedChatData._id)) // Remove the left group from the groups list
            } else {
                toast.error(response.data.message, {duration: 2000})
            }
        } catch (error) {
            console.error('Error leaving group:', error);
            toast.error(error.response?.data?.message || "Failed to leave group", {duration: 2000})
        }
    }


    // This function gets the group admin
    const getGroupAdmin = async () => {
        const admindId = selectedChatData.createdBy

        try {
            const response = await axiosInstance.get(`${HOST}/${GET_GROUP_ADMIN_ROUTE}`, {
                params: {
                    adminId: admindId
                }
            })
            setAdmin(response.data.admin)  // Set admin to the admin received
        } catch (error) {
            console.error('Error getting group admin:', error);
        }
    }

    useEffect(() => {
        getGroupAdmin()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // Early return if modal shouldn't be shown
    if (!groupDetailsModal) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/80 max-sm: flex sm:items-center sm:justify-center z-[9999] overflow-y-auto">
                <div className={`bg-slate-900 p-4 sm:rounded-lg ${isEditing ? "max-w-lg w-full" : "w-full max-w-xl"} border border-slate-900`}>
                    {
                        showAddUser ? (
                            // Add User Form
                            <div className="p-4 flex flex-col gap-4">
                                <div className="flex justify-between border-b-[1px] border-slate-800 pb-2">
                                    <h2 className="text-lg font-medium text-white">Add Members</h2>
                                    <button
                                        onClick={() => {
                                            setShowAddUser(false);
                                            setNewSelectedMembers([])
                                        }}
                                        className="p-2"
                                    >
                                        <RxCross1 className="text-gray-400 hover:text-white transition-all duration-300 cursor-pointer" />
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <AsyncSelect
                                        isMulti
                                        cacheOptions
                                        defaultOptions={[]}
                                        loadOptions={loadOptions}
                                        onChange={handleSelectChange}
                                        value={newSelectedMembers}
                                        styles={customStyles}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Search users by username..."
                                        noOptionsMessage={({ inputValue }) =>
                                            !inputValue ? "Start typing to search users" : "No users found"
                                        }
                                    />
                                </div>

                                <button className="p-2 px-4 bg-slate-700/90 rounded-sm hover:bg-slate-800 transition-all duration-300 text-sm mt-4"
                                    onClick={handleAddMembers}
                                >Add Members</button>



                            </div>
                        ) : (
                            isEditing ?
                                // Show Edit Group
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
                                            <label htmlFor="" className="text-sm text-gray-200 font-normal">Group Name</label>
                                            <input
                                                {...register("name")}
                                                type="text" className="flex-1 pl-3 p-2 text-white focus:outline-none rounded-tr-[10px] rounded-bl-[10px] font-light bg-slate-800 border text-sm border-slate-700 "
                                                autoComplete="off"
                                            />
                                            {
                                                errors.name && (<p className="text-red-600 text-sm">{errors.name.message}</p>)
                                            }
                                        </div>

                                        {/* Group Description Field */}
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="" className="text-sm text-gray-200 font-normal">Group Description</label>
                                            <textarea
                                                {...register("description")}
                                                type="text" className="flex-1 pl-3 p-2 text-white focus:outline-none rounded-tr-[10px] rounded-bl-[10px] font-light bg-slate-800 border text-sm border-slate-700 "
                                                autoComplete="off"
                                            />
                                            {
                                                errors.description && (<p className="text-red-600 text-sm">{errors.description.message}</p>)
                                            }
                                        </div>

                                        {/* Submit */}
                                        <button className="p-3 my-3 bg-slate-700 rounded-[5px] hover:bg-slate-600 font-normal mt-8 sm:mt-4">
                                            Save Changes
                                        </button>
                                    </form>
                                </div>
                                //  Show Group Details
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
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="text-sm text-gray-400">Admin: </span>
                                            <span className="text-sm text-white pl-2 font-normal">{admin._id === useAppStore.getState().user._id ? "You" : capitalizeUsername(admin.username)}</span>
                                        </div>


                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm text-gray-400 font-normal ">{members.length} members:</span>

                                            {/* Add user button */}
                                            {
                                                selectedChatData.createdBy === useAppStore.getState().user._id &&
                                                <button className="" title="Add User"
                                                    onClick={() => {
                                                        setShowAddUser(true)
                                                        fetchUsers();
                                                    }
                                                    }
                                                >
                                                    <IoIosAdd size={25} className="text-gray-400 hover:text-white transition-all duration-300 cursor-pointer" />
                                                </button>
                                            }

                                        </div>

                                        {/* Members */}
                                        <div className="bg-slate-800/20 rounded-sm mb-4 overflow-y-auto sm:max-h-[200px] max-h-[40dvh] custom-scrollbar">
                                            {
                                                members.map((member) => {
                                                    const isCurrentUser = member._id === useAppStore.getState().user._id; // Check if member is current user
                                                    return (
                                                        <div className={`flex items-center gap-2 border-b-[1px] border-slate-800 sm:hover:bg-slate-800/50 active:bg-slate-800/50 py-3 rounded-md ${isCurrentUser ? 'cursor-not-allowed' : 'cursor-pointer'}`} key={member._id}>

                                                            {/* Each Member container */}
                                                            <div className="flex items-center gap-2 w-full pl-3"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (!isCurrentUser) { // Check if member is not current user
                                                                        setSelectedChatMessages([])
                                                                        setSelectedChatType("dm")
                                                                        setSelectedChatData(member)
                                                                        handleClose()
                                                                    }
                                                                }}
                                                                aria-disabled={isCurrentUser}
                                                                title={`${isCurrentUser ? "You" : "Tap to chat"}`}
                                                            >
                                                                <img src={member.profilePicture} alt="member.username" className="w-6 h-6 rounded-full" key={member._id} />
                                                                <span className="text-white font-normal text-sm">{capitalizeUsername(member.username)}</span>

                                                            </div>

                                                            {/* Remove user button */}
                                                            <div>
                                                                {
                                                                    selectedChatData.createdBy === useAppStore.getState().user._id &&
                                                                    !isCurrentUser &&
                                                                    <button className="text-xs font-light text-red-300 text-right ml-auto pr-3 hover:underline cursor-pointer"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setShowConfirmRemoveModal(true)
                                                                            setMemberIdToRemove(member._id)
                                                                            setMemberToRemoe(member.username)
                                                                        }}>remove</button>
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>

                                    </div>

                                    {/* Action Button */}
                                    <div>
                                        {
                                            selectedChatData.createdBy === useAppStore.getState().user._id ?  // If the current user is the admin of the group Show Edit and Delete buttons
                                                <div className="flex justify-between">
                                                    <button className="p-2 px-4 bg-slate-700/90 rounded-sm hover:bg-slate-800 transition-all duration-300 text-sm"
                                                    onClick={() => setIsEditing(true)}
                                                    disabled={selectedChatData.createdBy !== useAppStore.getState().user._id}
                                                    >Edit Group</button>
                                                    <button className="p-2 px-4 bg-red-700 rounded-sm text-sm hover:bg-red-700/80 transition-all duration-300"
                                                    onClick={() => setShowConfirmGroupDeleteModal(true)}
                                                    disabled={selectedChatData.createdBy !== useAppStore.getState().user._id}
                                                    >Delete Group</button>
                                                </div> 
                                                : // If the current user is not the admin of the group Show Leave button
                                                <button className="p-2 px-4 bg-red-700 rounded-sm text-sm hover:bg-red-700/80 transition-all duration-300"
                                                onClick={() => setShowConfirmLeaveGroupModal(true)}
                                                disabled={selectedChatData.createdBy === useAppStore.getState().user._id}
                                                >Leave Group</button>
                                        }
                                    </div>
                                </div>
                        )
                    }

                </div>
            </div>

            {/* Confirm Modal for Removing member */}
            {
                showConfirmRemoveModal &&
                <ConfirmDelete
                    isModalOpen={showConfirmRemoveModal}
                    title={`Remove ${capitalizeUsername(memberToRemove)}?`}
                    body="Removing this user will permanently remove them from the group."
                    buttonText="Yes, remove"
                    onConfirm={handleRemoveMember(memberIdToRemove)}
                    onCancel={() => setShowConfirmRemoveModal(false)}
                />
            }

            {/* Confirm Modal for Deleting group */}
            {
                showConfirmGroupDeleteModal &&
                <ConfirmDelete
                    isModalOpen={showConfirmGroupDeleteModal}
                    title="Delete group?"
                    body="Deleting this group will permanently remove it from your groups."
                    buttonText="Yes, delete"
                    onConfirm={handleDeleteGroup}
                    onCancel={() => setShowConfirmGroupDeleteModal(false)}
                />
            }


            {/* Conform modal for leaving group */}
            {
                showConfirmLeaveGroupModal &&
                <ConfirmDelete
                isModalOpen={showConfirmLeaveGroupModal}
                title="Leave group?"
                body="Leaving this group will permanently remove you from the group."
                buttonText="Yes, leave"
                onConfirm={handleLeaveGroup}
                onCancel={() => setShowConfirmLeaveGroupModal(false)}
                />
            }
        </>
    )


}

export default GroupDetailsModal