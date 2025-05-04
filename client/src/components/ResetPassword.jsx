import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axiosInstance from '@/utils/axiosConfig';
import { HOST, PASSWORD_RESET_ROUTE } from '@/utils/constants';
import { storeTokens } from '@/utils/authUtils';
import { useAppStore } from '@/store/store';
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { FiEye, FiEyeOff } from "react-icons/fi";


// Reset-password email schema
const passwordSchema = Yup.object().shape({
    password: Yup.string().required("Password is required").min(8, "password must be at least 8 characters long"),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], "passwords must match")
})

export default function ResetPassword() {


    const [isSubmitting, setIsSubmitting] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();
    const setUser = useAppStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ resolver: yupResolver(passwordSchema) })


    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false
    })


    //Function to toggle password visibility
    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({...prev,[field]: !prev[field]}))
    }


    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const response = await axiosInstance.post(`${HOST}/${PASSWORD_RESET_ROUTE}`, {
                token,
                newPassword: data.password
            });

            if (response.data.success) {
                const { authToken, refreshToken, user } = response.data;
                storeTokens(authToken, refreshToken);
                setUser(user);
                toast.success(response.data.message || 'Password reset successful');
                reset() // clear form
                navigate('/chat');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Error resetting password');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className=' py-20 px-8'>
            <div className="max-w-lg mx-auto mt-8 p-6 py-10 bg-slate-800/30 rounded-lg shadow-md border border-slate-800">
                <div className='border-b-2 border-slate-800 mb-4'>
                    <h2 className="text-xl font-medium mb-2">Set New Password</h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4' noValidate autoComplete='off'>
                    <div className="mb-4">
                        <label className="block text-gray-200 text-sm font-normal mb-2">
                            New Password
                        </label>
                        <div>
                            <div className='relative flex items-center'>
                                <input
                                    {...register('password')}
                                    type={showPassword.new ? "text" : "password"}
                                    className="w-full px-3 py-2  border bg-slate-700/50 border-slate-700 rounded-tr-xl rounded-bl-xl text-white focus:outline-none focus:border-blue-500 placeholder:opacity-40 placeholder:text-sm"
                                    minLength={8}
                                    placeholder='Enter new password'
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                type="button"
                                onClick={() => togglePasswordVisibility("new")}
                                className="absolute right-3">
                                    {showPassword.new ? <FiEyeOff size={16} className='text-gray-300'/> : <FiEye size={16} className='text-gray-300'/>}
                                </button>
                            </div>

                            {
                                errors.password && <span className='text-xs text-red-500 font-light'>{errors.password.message}</span>
                            }
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-200 text-sm font-normal mb-2">
                            Confirm Password
                        </label>
                        <div>
                            <div className='relative flex items-center'>
                                <input
                                    {...register('confirmPassword')}
                                    type={showPassword.confirm ? "text" : "password"}
                                    className="w-full px-3 py-2  border bg-slate-700/50 border-slate-700 rounded-tr-xl rounded-bl-xl text-white focus:outline-none focus:border-blue-500 placeholder:opacity-40 placeholder:text-sm"
                                    minLength={8}
                                    placeholder='Confirm new password'
                                    autoComplete="off"
                                    required
                                />

                                <button
                                type="button"
                                onClick={() => togglePasswordVisibility("confirm")}
                                className="absolute right-3">
                                    {showPassword.confirm ? <FiEyeOff size={16} className='text-gray-300'/> : <FiEye size={16} className='text-gray-300'/>}
                                </button>
                            </div>
                            {
                                errors.confirmPassword && <span className='text-xs text-red-500 font-light'>{errors.confirmPassword.message}</span>
                            }
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-2 rounded-sm hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}