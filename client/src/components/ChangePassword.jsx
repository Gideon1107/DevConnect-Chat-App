import { useNavigate } from "react-router-dom"
import { IoIosArrowRoundBack } from "react-icons/io";
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { HOST, CHANGE_PASSWORD_ROUTE } from "@/utils/constants";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosConfig";


// ChangePAssword Schema
const changePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string().required("New password is required").min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string().oneOf([Yup.ref("newPassword")], "Passwords must match").required("Confirm Password is required")
});

const ChangePassword = () => {

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ resolver: yupResolver(changePasswordSchema) })

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    })

    //Function to toggle password visibility
    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({...prev,[field]: !prev[field]}))
    }


    const onSubmit = async (data) => {
        
        try {
            const response = await axiosInstance.put(`${HOST}/${CHANGE_PASSWORD_ROUTE}`, data )
            if (response.data.success) {
                reset()
                toast.success(response.data.message)
                navigate("/chat")
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    return (
        <div className="fixed inset-0 sm:bg-black/80 flex sm:items-center sm:justify-center z-50">
            <div className="bg-slate-900 p-4 rounded-[8px] w-full max-w-2xl sm:border border-slate-800 flex flex-col gap-20">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <button onClick={() => navigate('/chat')} className="flex items-center">
                        <IoIosArrowRoundBack size={35} className="text-white" />
                        <span className="text-white font-extralight">Back</span>
                    </button>

                    <h2 className="text-white mr-6">Change Password</h2>
                </div>

                <div className="w-full flex items-center justify-center text-white">
                    <form action="" onSubmit={handleSubmit(onSubmit)} className=" w-[80vw] sm:w-96 flex flex-col gap-6">
                        {/* Current password */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-sm text-gray-200">Current password</label>
                            <div className="relative flex items-center">
                            <input
                                {...register("currentPassword")}
                                type={showPassword.current ? "text" : "password"}
                                className="pl-3 p-2 text-white focus:outline-none rounded-tr-[10px] rounded-bl-[10px] w-full bg-slate-800 border text-base border-slate-700"
                                autoComplete="off" />

                                <button 
                                type="button"
                                onClick={() => togglePasswordVisibility("current")}
                                className="absolute right-3"
                                >
                                {showPassword.current ? <FiEyeOff size={16}/> : <FiEye size={16}/> }
                                </button>
                            </div>

                            {/* CurrentPassword Error */}
                            {errors.currentPassword && (
                                <span className="text-red-600 text-sm">
                                    {errors.currentPassword.message}
                                </span>
                            )}

                        </div>

                        {/* New password */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-sm text-gray-200">New password</label>
                            <div className="relative flex items-center">
                            <input
                                {...register("newPassword")}
                                type={showPassword.new ? "text" : "password"}
                                className="pl-3 p-2 text-white focus:outline-none rounded-tr-[10px] rounded-bl-[10px]  bg-slate-800 border text-base w-full border-slate-700"
                                autoComplete="off" />

                                <button
                                type="button"
                                onClick={() => togglePasswordVisibility("new")}
                                className="absolute right-3">
                                    {showPassword.new ? <FiEyeOff size={16}/> : <FiEye size={16}/> }
                                </button>
                            </div>

                            {/* NewPassword Error */}
                            {errors.newPassword && (
                                <span className="text-red-600 text-sm">
                                    {errors.newPassword.message}
                                </span>
                            )}
                        </div>

                        {/* Retype New password */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-sm text-gray-200">Confirm password</label>
                            <div className="relative flex items-center">
                            <input
                                {...register("confirmPassword")}
                                type={showPassword.confirm ? "text" : "password"}
                                className="pl-3 p-2 text-white focus:outline-none rounded-tr-[10px] rounded-bl-[10px] w-full bg-slate-800 border text-base border-slate-700"
                                autoComplete="off" />

                                <button
                                type="button"
                                onClick={() => togglePasswordVisibility("confirm")}
                                className="absolute right-3">
                                    {showPassword.confirm ? <FiEyeOff size={16}/> : <FiEye size={16}/> }

                                </button>
                            </div>

                            {/* Confirm Password Error */}
                            {errors.confirmPassword && (
                                <span className="text-red-600 text-sm">
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>

                        {/* Submit */}

                        <div className="flex items-center justify-center my-8">
                            <button className="p-3 px-6 bg-slate-700 rounded-[5px] font-light text-sm w-full">
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>


            </div>
        </div>
    )
}

export default ChangePassword



