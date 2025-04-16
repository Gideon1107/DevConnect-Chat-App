
import { useState, useEffect } from 'react';
import { X } from "lucide-react";
import axios from 'axios';
import { HOST, GET_ALL_USERS_ROUTE, CREATE_GROUP_ROUTE } from '@/utils/constants';
import { useAppStore } from '@/store/store';
import { toast } from 'sonner';
import AsyncSelect from 'react-select/async';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import customStyles  from '@/utils/customStyles';


// Create group schema
const createGroupSchema = Yup.object().shape({
    name: Yup.string()
        .required('Group name is required')
        .min(3, 'Group name must be at least 3 characters')
        .matches(/^[a-zA-Z0-9\s-_]+$/, 'Group name can only contain letters, numbers, spaces, hyphens and underscores'),
    description: Yup.string()
        .required('Group description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(200, 'Description cannot exceed 200 characters'),
    members: Yup.array()
        .min(1, 'Please select at least one member')
        .required('Please select group members')
});



const CreateGroupModal = ({ setOpenGroupModal }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const { user, addGroup } = useAppStore();


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        trigger, 
        reset
    } = useForm({
        resolver: yupResolver(createGroupSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            members: []
        }
    });

    // Watch all fields for validation
    const watchedFields = watch();

     // Handle input changes and trigger validation
     const handleInputChange = (field, value) => {
        setValue(field, value);
        trigger(field); // Trigger validation for the specific field
    };


    // Fetch all users when modal opens
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${HOST}/${GET_ALL_USERS_ROUTE}`, {
                    withCredentials: true
                });
                if (response.data.success) {
                    setAllUsers(response.data.user);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Failed to fetch users');
            }
        };

        fetchUsers();
    }, []); //runs once when modal opens


    // Function to load options based on search input
    const loadOptions = async (inputValue) => {
        if (!inputValue) return [];

        // Filter users locally
        return allUsers.filter(user =>
            user.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };


    const handleCreateGroup = async (data) => {

        const { name, description, members } = data;

        setIsLoading(true);
        try {
            if (name.length > 0 && members.length > 0 ) {
                const response = await axios.post(`${HOST}/${CREATE_GROUP_ROUTE}`, {
                    name: name,
                    description: description,
                    members: members.map(user => user.value),
                    createdBy: user.id,
                    
                }, {withCredentials: true});

                if (response.data.success) {
                    reset()
                    toast.success(`Group: "${name}" created`)
                    addGroup(response.data.newGroup)
                    setOpenGroupModal(false)
                } else {
                    toast.error(response.data.message)
                }
            }
            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create group');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex sm:items-center sm:justify-center z-50">
            <div className="bg-slate-900 p-8 sm:rounded-xl w-full max-w-xl border border-slate-800">
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-3">
                    <h2 className="text-lg font-medium text-white">Create New Group</h2>
                    <button
                        onClick={() => setOpenGroupModal(false)}
                        className="text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleCreateGroup)} className="space-y-6 sm:space-y-4">
                    <div>
                        <label className="block text-sm font-normal text-gray-300 mb-1">
                            Group Name
                        </label>
                        <input
                            type="text"
                            {...register('name')}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500 placeholder:text-sm font-light placeholder:text-gray-500"
                            placeholder="Enter group name"
                            autoComplete='off'
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm mt-1 font-normal">{errors.name.message}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-normal text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500 placeholder:text-sm font-light placeholder:text-gray-500"
                            placeholder="Enter group description"
                            rows="3"
                            autoComplete='off'
                        />
                        {errors.description && (
                            <span className="text-red-500 text-sm mt-1">{errors.description.message}</span>
                        )}
                    </div>

                    <div className='pb-6'>
                        <label className="block text-sm font-normal text-gray-300 mb-1">
                            Search and Add Members
                        </label>
                        <AsyncSelect
                            isMulti
                            cacheOptions
                            defaultOptions={[]}
                            loadOptions={loadOptions}
                            value={watchedFields.members}
                            onChange={(selected) => handleInputChange('members', selected)}
                            styles={customStyles}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Search users by username..."
                            noOptionsMessage={({ inputValue }) =>
                                !inputValue ? "Start typing to search users" : "No users found"
                            }
                        />
                        {errors.members && (
                            <span className="text-red-500 text-sm mt-1 font-normal">{errors.members.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
                        font-normal"
                    >
                        {isLoading ? 'Creating...' : 'Create Group'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;
