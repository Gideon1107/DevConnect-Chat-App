import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react"
import PropTypes from "prop-types"


export const SignInModal = ({ isOpen, onClose, onSwitchToSignUp }) => {
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
        <button className="w-full bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-100 flex items-center justify-center gap-2 mb-4">
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
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500 placeholder:opacity-40"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500 placeholder:opacity-40"
              placeholder="Enter Password"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-500 hover:text-blue-400"
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
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
  isOpen: PropTypes.func.isRequired, //onSignInClick must be a function and is required
  onClose: PropTypes.func.isRequired, //onClose must be a function and is required
  onSwitchToSignUp: PropTypes.func.isRequired // onSwitchToSignUp must be a function and is required
};