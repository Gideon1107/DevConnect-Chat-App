import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react"
import PropTypes from "prop-types"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import axiosInstance from "@/utils/axiosConfig";
import { HOST, SIGNUP_ROUTE, GOOGLE_LOGIN_ROUTE } from "@/utils/constants";
import { toast } from 'sonner';
import { storeTokens } from "@/utils/authUtils";
import { useAppStore } from "@/store/store";
import { useNavigate } from "react-router-dom";


// Sign Up Schema
const signUpSchemna = Yup.object().shape({
  username: Yup.string().required("Username is required").min(3, "Username must be at least 3 characters").matches(
    /^[a-zA-Z0-9_]*$/,
    "Username must contain only letters, numbers, and underscores"
  ),
  email: Yup.string().matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Invalid email address"
  ).required("Email is required"),
  password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters")
});


export const SignUpModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const { setUser } = useAppStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(signUpSchemna) }); // Integrate Yup validation with React Hook Form

  const onSubmit = async (data) => {
    try {
      // Call sign-up API using our custom axios instance
      const response = await axiosInstance.post(`${HOST}/${SIGNUP_ROUTE}`, data);

      if (response.data.success) {
        // Store tokens in localStorage instead of cookies
        const { authToken, refreshToken, user } = response.data;
        storeTokens(authToken, refreshToken);

        // Set user in the global store immediately
        if (user) {
          setUser(user);
        }

        toast.success(response.data.message, {theme: "light"});

        // Reset the form
        reset();
        onClose(); // Close the modal

        // Use React Router's navigate instead of window.location for a smoother transition
        setTimeout(() => {
          navigate('/chat');
        }, 1000);
      } else {
        toast.error(response.data.message, {theme: "light"});
      }

    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error(error.message);
      } else {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    }
  };

  const onGoogleSignIn = async () => {
    toast.loading("Redirecting to Google Sign In", {theme: "light"});
    setTimeout(() => {window.location.href = `${HOST}/${GOOGLE_LOGIN_ROUTE}`; }, 1000);
  };

  const [showPassword, setShowPassword] = useState(false);


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md border border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <button className="w-full bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-100 flex items-center justify-center gap-2 mb-4" onClick={onGoogleSignIn}>
            <FcGoogle/>
          Continue with Google
        </button>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-400 bg-slate-900">
              or continue with email
            </span>
          </div>
        </div>

        <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>

            {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              {...register("username")}
              type="text"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500 placeholder:opacity-40 placeholder:text-sm"
              placeholder="JohnDoe"
              autoComplete="off"
            />

            {/* Username Error message */}
            {errors.username && (
              <span className="text-red-600 text-sm mt-1">{errors.username.message}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500 placeholder:opacity-40 placeholder:text-sm"
              placeholder="you@example.com"
              autoComplete="off"
            />

            {/* Email Error message */}
            {errors.email && (
              <span className="text-red-600 text-sm mt-1">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative flex items-center">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500 placeholder:opacity-40 placeholder:text-sm"
              placeholder="••••••••"
              autoComplete="off"
            />
              {showPassword ? <FiEyeOff onClick={() => setShowPassword(!showPassword)} className="absolute text-white right-3 cursor-pointer" /> : <FiEye onClick={() => setShowPassword(!showPassword)} className="absolute text-white right-3 cursor-pointer" />}
            </div>

            {/* Password Error message */}
            {errors.password && (
              <span className="text-red-600 text-sm mt-1">{errors.password.message}</span>
            )}
          </div>

          {/* Sign Up button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Account
          </button>
          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-blue-500 hover:text-blue-400"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Prop Validation
SignUpModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, //onSignInClick must be a function and is required
  onClose: PropTypes.func.isRequired, //onClose must be a function and is required
  onSwitchToSignIn: PropTypes.func.isRequired // onSwitchToSignUp must be a function and is required
};