import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react"
import PropTypes from "prop-types"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";
import { HOST, AUTH_ROUTES, LOGIN_ROUTE, SIGNUP_ROUTE, GOOGLE_LOGIN_ROUTE } from "@/utils/constants";


// Sign In Schema
const signInSchemna = Yup.object().shape({
  email: Yup.string().matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Invalid email address"
  ).required("Email is required"),
  password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters")
});


export const SignInModal = ({ isOpen, onClose, onSwitchToSignUp }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(signInSchemna)}); // Integrate Yup validation with React Hook Form

  const onSubmit = async (data) => {
    try {
      // Call sign in API
      const response = await axios.post(`${HOST}/${LOGIN_ROUTE}`, data);
      console.log(response.data);
      // Reset the form
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const onGoogleSignIn = async () => {
    window.location.href = `${HOST}/${GOOGLE_LOGIN_ROUTE}`;
  };


  const [showPassword, setShowPassword] = useState(false);


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-8 rounded-lg w-full max-w-md border border-slate-800">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Sign In</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <button className="w-full bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-100 flex items-center justify-center gap-2 mb-4" onClick={onGoogleSignIn}>
          <FcGoogle />
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
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500 placeholder:opacity-40 placeholder:text-sm"
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
              type= {showPassword ? "text" : "password"}
              className="w-full px-4 py-2 bg-slate-800 border text-base border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500 placeholder:opacity-40 placeholder:text-sm"
              placeholder="Enter Password"
            />
            { showPassword ? <FiEyeOff onClick={() => setShowPassword(!showPassword)} className="absolute text-white right-3"/> : <FiEye onClick={() => setShowPassword(!showPassword)} className="absolute text-white right-3"/> }
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
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
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