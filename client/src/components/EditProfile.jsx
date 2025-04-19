import { RxCross1 } from "react-icons/rx";
import { useAppStore } from "@/store/store";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios";
import {
    HOST,
    ADD_PROFILE_PICTURE_ROUTE,
    UPDATE_PROFILE_ROUTE,
    DELETE_PROFILE_PICTURE_ROUTE
} from "@/utils/constants";
import { toast } from "sonner";
import ConfirmDelete from "./ConfirmDelete";




const usernameSchema = Yup.object().shape({
    username: Yup.string().required("Username is required")
        .min(3, "Username must be at least 3 characters")
        .matches(/^[A-Za-z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores")
})

const EditProfile = ({ isOpen, handleIsOpen }) => {

    const navigate = useNavigate()

    const imageFileRef = useRef(null)

    const { user, setUser } = useAppStore();

    const [selectedImage, setSelectedImage] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false);

    // This Function to capitalize the first letter of the username
    const capitalizeUsername = (username) => {
        if (!username) return ''; // Return empty string if username is falsy
        return username.charAt(0).toUpperCase() + username.slice(1);
    };



    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(usernameSchema),
        defaultValues: {
            username: capitalizeUsername(user.username),
            email: user.email
        }
    })

    const onSubmit = async (data) => {
        const { username } = data
        try {
            const response = await axios.put(`${HOST}/${UPDATE_PROFILE_ROUTE}`, { username }, {
                withCredentials: true, // Important: Sends cookies with the request
            })
            if (response.data.success) {
                setUser(response.data.user)
                toast.success("Username updated successfully")
                handleIsOpen()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);

        }
    }

    const handleEditClick = () => {
        imageFileRef.current.click()
    }

    //This function add and update profile image
    const handleImageChange = async (event) => {
        const file = event.target.files[0]
        if (!file) return;

        const formData = new FormData();
        formData.append("profilePicture", file);

        const imageUrl = URL.createObjectURL(file) //Create a local copy of selected image

        try {
            const response = await axios.put(`${HOST}/${ADD_PROFILE_PICTURE_ROUTE}`, formData, {
                withCredentials: true, // Important: Sends cookies with the request
            })
            if (response.data.success) {
                setUser(response.data.user)  //Set user to the new user received so state update properly
                setSelectedImage(imageUrl)
            }
            toast.success("Profile picture updated")
        } catch (error) {
            console.log(error);

        }
    }

    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    // This function delete user picture
    const handleDeleteProfilePicture = async () => {
    setIsModalOpen(false) //Close the modal
    try {
        const response = await axios.delete(`${HOST}/${DELETE_PROFILE_PICTURE_ROUTE}`, {
            withCredentials: true, // Important: Sends cookies with the request
            })
            
        if (response.data.success) {
            setSelectedImage(null)
            setUser(response.data.user)  //Set user to the new user received so state update properly
            toast.success("Profile picture deleted")
        } else {
            toast.error("Error deleting profile picture, try again!")
        }
    } catch (error) {
        console.log(error);
        
    }
    }


    if (!isOpen) {
        return
    }

    return (


        <div className="absolute inset-0 sm:bg-black/80 bg-slate-900 flex sm:items-center sm:justify-center z-50 h-screen overflow-y-scroll ">
            <div className="bg-slate-900 p-4 sm:rounded-[8px] w-full max-w-2xl sm:border border-slate-800 flex flex-col sm:gap-14 gap-4">

                <div className="flex items-center justify-between border-b pb-3 border-slate-800">
                    <button onClick={handleIsOpen} className="flex items-center">
                        <IoIosArrowRoundBack size={35} className="text-white" />
                        <span className="text-white font-extralight">Back</span>
                    </button>
                    <h1 className=" mr-6 ">Edit Profile</h1>
                </div>

                <div className="flex flex-col sm:flex-row justify-around gap-5 ">
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <img src={selectedImage || user.profilePicture} alt="avatar" className="w-[130px] sm:w-[150px] rounded-full" />
                        <div className="space-x-4 flex items-center">
                            <button className="p-3 " title="Change avatar" onClick={handleEditClick}>
                                <GrEdit size={20} className="text-slate-200" />
                                <input
                                    type="file"
                                    className="hidden"
                                    name="profilePicture"
                                    accept=".png, .jpg, .jpeg, .svg, .webp"
                                    onChange={handleImageChange}
                                    ref={imageFileRef} />
                            </button>
                            <button className="p-3" title="Delete avatar" onClick={handleDeleteClick}>
                                <RxCross1 size={22} className="text-red-400" />
                            </button>
                        </div>
                    </div>
                    <div>
                        <form action="" className="flex flex-col gap-6 sm:w-80 md:w-90 flex-1" onSubmit={handleSubmit(onSubmit)}>
                            {/* Username Field */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="" className="text-sm text-gray-200">Username</label>
                                <input
                                    {...register("username")}
                                    type="text" className="flex-1 pl-3 p-2 text-white focus:outline-none rounded-tr-[10px] rounded-bl-[10px]  bg-slate-800 border text-base border-slate-700 "
                                    autoComplete="off"
                                />
                                {
                                    errors.username && (<p className="text-red-600 text-sm">{errors.username.message}</p>)
                                }
                            </div>

                            {/* Email field */}
                            <div className="flex flex-col gap-2" >
                                <label htmlFor="" className="text-sm text-gray-200">Email</label>
                                <input
                                    {...register("email")}
                                    type="text" className="flex-1 pl-3 p-2 text-white focus:outline-none rounded-tr-[10px] rounded-bl-[10px] cursor-not-allowed opacity-50 bg-slate-800 border text-base border-slate-700"
                                    readOnly
                                    disabled
                                />
                            </div>

                            <button className="p-3 my-3 bg-slate-700 rounded-[5px] hover:bg-slate-600 font-light">Save Changes</button>

                        </form>
                    </div>
                </div>


                {/* Change Password */}
                <div>
                    <button className="font-light text-sm underline leading-normal" onClick={() => navigate("/change-password")}>Click here to Change Password</button>
                </div>

            </div>

             <ConfirmDelete
                    isModalOpen={isModalOpen}
                    title="Delete profile picture?"
                    body="Deleting this picture will permanently remove it from your profile."
                    buttonText="Yes, delete"
                    onConfirm={handleDeleteProfilePicture}
                    onCancel={() => setIsModalOpen(false)}
                />
        </div>
    );
}

export default EditProfile