import { useState } from 'react'
import { Toaster, toast } from 'sonner';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { SignUpModal } from './components/SignUpModal'
import { SignInModal } from './components/SignInModal'
import { Home } from './pages/Home'
import { Features } from './pages/Features'
import { Community } from './pages/Community'
import { Documentation } from './pages/Documentation'
import About from './components/About'
import NotFound from './components/NotFound'
import PrivateRoute from './components/PrivateRoute'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import PublicRoute from './components/PublicRoute';
import ScrollToTop from './components/ScollToTop';
import BackToTop from './components/BackToTop';
import { useAppStore } from './store/store';
import { useEffect } from 'react';
import axiosInstance from './utils/axiosConfig';
import { HOST, GETUSER_ROUTE, GETALLUSERS_ROUTE } from './utils/constants';
import ChangePassword from './components/ChangePassword';
import AuthCallback from './components/AuthCallback';
import { isAuthenticated } from './utils/authUtils';
import TestEmptyChat from './pages/TestEmptyChat';
import LoadingScreen from './components/LoadingScreen';
import ActivateAccount from './components/ActivateAccount';
import AwaitingAccountVerification from './components/AwaitingAccountVerification';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';




const App = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)

  const handleOpenSignUp = () => {
    setIsSignInOpen(false)
    setIsSignUpOpen(true)
  }

  const handleOpenSignIn = () => {
    setIsSignUpOpen(false)
    setIsSignInOpen(true)
  }

  const { user, setUser, setUsers } = useAppStore();
  const [loading, setLoading] = useState(true);

  // Clean up any lingering toasts
  useEffect(() => {
    const pendingToastId = sessionStorage.getItem('pendingGoogleSignIn');
    if (pendingToastId) {
      // Dismiss the toast
      toast.dismiss(pendingToastId);
      // Clear from sessionStorage
      sessionStorage.removeItem('pendingGoogleSignIn');
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if user is authenticated using localStorage
        if (isAuthenticated()) {
          // Get user profile using our custom axios instance with auth headers
          // This will automatically use refreshToken to get a new authToken if needed
          const response = await axiosInstance.get(`${HOST}/${GETUSER_ROUTE}`);
          if (response.status === 200) {
            setUser(response.data); // state to store user details
            setLoading(false)

            // Check if we got a new auth token in the response
            const newAuthToken = response.headers['x-new-auth-token'];
            if (newAuthToken && !localStorage.getItem('authToken')) {
              console.log('Received new auth token from refresh token');
            }
          }
        } else {
          setUser(undefined)
        }
      } catch (error) {
        console.error('Error fetching user:', error.response?.data?.message || error.message);
        setUser(undefined)
      } finally {
        setLoading(false)
      }
    };


    const fetchAllUsers = async () => {
      try {
        // Check if user is authenticated using localStorage
        if (isAuthenticated()) {
          // Use our custom axios instance with auth headers
          const response = await axiosInstance.get(`${HOST}/${GETALLUSERS_ROUTE}`)
          setUsers(response.data)
        }
      } catch (error) {
        console.error('Error fetching all users:', error.response?.data?.message || error.message);
        setUsers(undefined)
      }
    }

    if (!user) {
      fetchUser()
      fetchAllUsers()
    } else {
      setLoading(false)
    }
  }, [user, setUser, setUsers])



  if (loading) {
    return <LoadingScreen />;
  }

  // Don't show BackToTop on chat page
  const showBackToTop = location.pathname !== '/chat';


  return (
    <Router>
      <ScrollToTop />
      <div className="bg-slate-900 min-h-[100dvh] relative scrollbar-hidden">
        {showBackToTop && <BackToTop />}
        <Toaster position='top-center' duration={3000}/>
        {!user && <Navbar onSignInClick={handleOpenSignIn} />}

        <Routes>
          {/* Public Pages - Restricted for Authenticated Users */}
          <Route path="/" element={<PublicRoute element={<Home onGetStarted={() => setIsSignUpOpen(true)} />} />} />
          <Route path="/features" element={<PublicRoute element={<Features />} />} />
          <Route path="/community" element={<PublicRoute element={<Community />} />} />
          <Route path="/docs" element={<PublicRoute element={<Documentation />} />} />
          <Route path="/about" element={<PublicRoute element={<About />} />} />

          {/* Pages to registration verfication */}
          <Route path="/awaiting-account-verification" element={<PublicRoute element={<AwaitingAccountVerification/>}/>}/>
          <Route path="/activate/:token" element={<PublicRoute element={<ActivateAccount/>}/>}/>

          {/* Pages to password resetting */}
          <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword/>}/>}/>
          <Route path="/reset-password/:token" element={<PublicRoute element={<ResetPassword/>}/>}/>
          

          {/* Auth Callback for Google OAuth */}
          <Route path="/auth-callback" element={<AuthCallback />} />

          {/* Protected Routes */}
          {/* Main Chat Route - DM or Default Chat */}
          <Route path="/chat" element={<PrivateRoute element={<Chat />} />} />

          {/* Dynamic Chat Route - for Individual Messages (DM) */}
          <Route path="/chat/:userId" element={<PrivateRoute element={<Chat />} />} />

          {/* Dynamic Chat Route - for Group or Channel Messages */}
          <Route path="/chat/:type/:id" element={<PrivateRoute element={<Chat />} />} />

          {/* User Profile Route */}
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />

          {/* Settings Route */}
          <Route path="/change-password" element={<PrivateRoute element={<ChangePassword />} />} />

          {/* Redirects */}
          <Route path="/pricing" element={<Navigate to="/features" />} />
          <Route path="/blog" element={<Navigate to="/community" />} />
          <Route path="/contact" element={<Navigate to="/about" />} />

          {/* Test Route */}
          <Route path="/test-empty-chat" element={<TestEmptyChat />} />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {!user && <Footer />}


        {/* Modals */}
        <SignUpModal
          isOpen={isSignUpOpen}
          onClose={() => setIsSignUpOpen(false)}
          onSwitchToSignIn={handleOpenSignIn}
        />
        <SignInModal
          isOpen={isSignInOpen}
          onClose={() => setIsSignInOpen(false)}
          onSwitchToSignUp={handleOpenSignUp}
        />

      </div>
    </Router>
  )
}

export default App;