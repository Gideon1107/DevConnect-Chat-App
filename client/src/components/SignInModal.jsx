import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react"
import PropTypes from "prop-types"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosConfig";
import { HOST, LOGIN_ROUTE, GOOGLE_LOGIN_ROUTE } from "@/utils/constants";
import { toast } from 'sonner';
import { storeTokens } from "@/utils/authUtils";
import { useAppStore } from "@/store/store";
import { useNavigate } from "react-router-dom";


// Sign In Schema
const signInSchemna = Yup.object().shape({
  email: Yup.string().matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Invalid email address"
  ).required("Email is required"),
  password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters")
});


export const SignInModal = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const { setUser } = useAppStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(signInSchemna) }); // Integrate Yup validation with React Hook Form

  const onSubmit = async (data) => {
    try {
      // Call sign-in API using our custom axios instance
      const response = await axiosInstance.post(`${HOST}/${LOGIN_ROUTE}`, data);
      if (response.data.success) {
        // Store tokens in localStorage instead of cookies
        const { authToken, refreshToken, user } = response.data;
        storeTokens(authToken, refreshToken);

        // Set user in the global store immediately
        if (user) {
          setUser(user);
        }

        toast.success(response.data.message, { theme: "light" });
        // Reset the form
        reset();
        onClose(); // Close the modal

        // Use React Router's navigate instead of window.location for a smoother transition
        setTimeout(() => {
          navigate('/chat');
        }, 1000);
      } else {
        toast.error(response.data.message, { theme: "light" });
      }

    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error(error.message);
      } else {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    }
  };

  const onGoogleSignIn = async () => {
    // Create a unique ID for this toast
    const toastId = `google-signin-${Date.now()}`;

    // Store the toast ID in sessionStorage
    sessionStorage.setItem('pendingGoogleSignIn', toastId);

    // Show the toast with the ID
    toast.loading("Redirecting to Google Sign In", {
      id: toastId,
      theme: "light",
      duration: 2000 // Auto dismiss after 2 seconds even if not redirected
    });

    setTimeout(() => {
      window.location.href = `${HOST}/${GOOGLE_LOGIN_ROUTE}`;
    }, 1000);
  };

  // Check for and dismiss any lingering toasts when component mounts
  useEffect(() => {
    const pendingToastId = sessionStorage.getItem('pendingGoogleSignIn');
    if (pendingToastId) {
      // Dismiss the toast
      toast.dismiss(pendingToastId);
      // Clear from sessionStorage
      sessionStorage.removeItem('pendingGoogleSignIn');
    }
  }, []);


  const [showPassword, setShowPassword] = useState(false);


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 max-sm: flex items-center justify-center z-[9999]">
      <div className="bg-slate-900 p-8 sm:rounded-xl w-full max-w-md border border-slate-800">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Sign In</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <button className="w-full bg-white text-gray-900 px-4 py-3 rounded-[3px] text-sm font-semibold hover:bg-gray-100 flex items-center justify-center gap-2 mb-4" onClick={onGoogleSignIn}>
          <FcGoogle size={15}/>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-tr-xl rounded-bl-xl text-white focus:outline-none focus:border-blue-500 placeholder:opacity-40 placeholder:text-sm"
              placeholder="Enter Email"
              autoComplete="off"
            />

            {/* Email Error */}
            {errors.email && (
              <span className="text-red-600 text-sm">
                {errors.email.message}
              </span>
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
                className="w-full px-4 py-3 bg-slate-800 border text-base border-slate-700 rounded-tr-xl rounded-bl-xl text-white focus:outline-none focus:border-blue-500 placeholder:opacity-40 placeholder:text-sm"
                placeholder="Enter Password"
              />
              {showPassword ? <FiEyeOff onClick={() => setShowPassword(!showPassword)} className="absolute text-white right-3 cursor-pointer" /> : <FiEye onClick={() => setShowPassword(!showPassword)} className="absolute text-white right-3 cursor-pointer" />}
            </div>

            {/* Password Error */}
            {errors.password && (
              <span className="text-red-600 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-500 hover:text-blue-400"
              onClick={() => {
                onClose()
                navigate('/forgot-password')
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-[3px] hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>

          {/* Sign Up */}
          <div className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-blue-500 hover:text-blue-400"
            >
              Sign up
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// Prop Validation
SignInModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, //onSignInClick must be a function and is required
  onClose: PropTypes.func.isRequired, //onClose must be a function and is required
  onSwitchToSignUp: PropTypes.func.isRequired // onSwitchToSignUp must be a function and is required
};