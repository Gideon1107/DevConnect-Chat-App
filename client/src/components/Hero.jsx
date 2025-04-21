import { FcGoogle } from "react-icons/fc";
import { MessageSquare, Globe, Users} from "lucide-react"
import heroImg from "../assets/threeconnect.png"
import PropTypes from "prop-types"
import { motion } from "framer-motion"
import { Typewriter } from 'react-simple-typewriter'
import { toast } from 'sonner';
import { useEffect } from 'react';
import { HOST, GOOGLE_LOGIN_ROUTE } from "@/utils/constants";


export const Hero = ({ onGetStarted }) => {


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


  return (
    <div className="bg-slate-900 min-h-screen sm:pt-16">
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pt-8 sm:pt-20 pb-16 ">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}>
            <div className="text-center lg:text-left pt-5">
              <div className="flex flex-col gap-1 sm:gap-2">
                <h1 className="text-4xl sm:text-6xl font-medium  text-white  ">
                  Connect with
                </h1>
                <span className="text-blue-400 text-4xl sm:text-6xl sm:py-2">
                  <Typewriter
                    words={['Developers']}
                    loop={false}
                    cursor
                    cursorStyle='|'
                    typeSpeed={200}
                    deleteSpeed={120}
                  // delaySpeed={1000}
                  />
                </span>
                <h1 className="text-4xl sm:text-6xl text-white mb-6  font-medium ">
                  Worldwide
                </h1>
              </div>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl lg:max-w-none mx-auto font-light ">
                Join a global community of developers. Share ideas, collaborate on
                projects, and grow together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 pt-4">
                <button
                  onClick={onGetStarted}
                  className="bg-blue-600  text-white px-8 py-3 rounded-[3px] font-light text-base hover:bg-blue-700 transition-all duration-200 ease-in-out"
                >
                  Get Started
                </button>
                <button className="bg-transparent text-white border-[1px] border-white px-8 py-3 rounded-[3px] text-base font-light flex items-center justify-center gap-2 hover:bg-white hover:text-slate-900 transition-all duration-300 ease-in-out"
                  onClick={onGoogleSignIn}
                >
                  <FcGoogle />
                  Continue with Google
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="flex justify-center lg:justify-end">
              <img
                src={heroImg}
                alt="Developer Illustration"
                className="w-full max-w-md xl:max-w-lg"
              />
            </div>
          </motion.div>
        </div>


        {/* Features grid  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
          <div className="flex flex-col items-center">
            <div className="bg-blue-500/10 p-4 rounded-full mb-4">
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-white font-semibold mb-2">Global Community</h3>
            <p className="text-gray-400 text-center font-light">
              Connect with developers from around the world
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-500/10 p-4 rounded-full mb-4">
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-white font-semibold mb-2">Real-time Chat</h3>
            <p className="text-gray-400 text-center font-light">
              Instant messaging with code sharing support
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-500/10 p-4 rounded-full mb-4">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-white font-semibold mb-2">
              Team Collaboration
            </h3>
            <p className="text-gray-400 text-center font-light">
              Create groups and collaborate seamlessly
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Prop Validation
Hero.propTypes = {
  onGetStarted: PropTypes.func.isRequired //onSignInClick must be a function and is required
};