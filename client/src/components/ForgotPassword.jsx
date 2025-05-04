import { useState } from 'react';
import { toast } from 'sonner';
import { HOST, PASSWORD_RESET_REQUEST_ROUTE } from '@/utils/constants';
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import axiosInstance from '@/utils/axiosConfig';


// Reset-password email schema
const emailSchema = Yup.object().shape({
    email: Yup.string().matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address"
      ).required("Email is required"),
})

export default function ForgotPassword() {
    const [isSubmitting, setIsSubmitting] = useState(false);
   
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({ resolver: yupResolver(emailSchema)})
    

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const response = await axiosInstance.post(`${HOST}/${PASSWORD_RESET_REQUEST_ROUTE}`, data);

            if (response.data.success) {
                toast.success(response.data.message || 'Check your email for password reset instructions');
                reset()
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Error requesting password reset');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className=' py-20 px-8'>
            <div className="max-w-lg mx-auto mt-8 p-6 py-10 bg-slate-800/30 rounded-lg shadow-md border border-slate-800">
                <h2 className="text-xl font-medium mb-6">Reset Password</h2>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4' noValidate>
                    <div className="mb-4">
                        <label className="block text-gray-200 text-sm font-normal mb-2">
                            Email Address
                        </label>
                        <div>
                            <input
                                type="email"
                                {...register('email')}
                                className="w-full px-3 py-2 border bg-slate-700/50 border-slate-700 rounded-tr-xl rounded-bl-xl text-white focus:outline-none focus:border-blue-500 placeholder:opacity-40 placeholder:text-sm"
                                placeholder='Enter email'
                                autoComplete="off"
                                required
                            />

                            {
                                errors.email ? 
                                <span className="text-red-500 text-sm font-light">{errors.email.message}</span>
                                : null
                            }
                        </div>
                       
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-2 rounded-sm hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    );
}