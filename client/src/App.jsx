import { useState } from 'react'
import { Toaster } from 'sonner';
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
import Settings from './pages/Settings'
import PublicRoute from './components/PublicRoute';
import ScrollToTop from './components/ScollToTop';
import BackToTop from './components/BackToTop';
import { useAppStore } from './store/store';
import { useEffect } from 'react';
import axios from 'axios';
import { HOST, GETUSER_ROUTE, CHECK_AUTH_ROUTE } from './utils/constants';




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

  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {

        const authResponse = await axios.get(`${HOST}/${CHECK_AUTH_ROUTE}`, { withCredentials: true });

        if (authResponse.data.isAuthenticated) {
          const response = await axios.get(`${HOST}/${GETUSER_ROUTE}`, {
            withCredentials: true, // Ensures cookies (authToken) are sent with the request
          });

          if (response.status === 200) {
            setUser(response.data); // state to store user details
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

    if (!user) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [user, setUser])


  if (loading) {
    return <div>Loading...</div>
  }


  return (
    <Router>
      <ScrollToTop />
      <div className="bg-slate-900 min-h-screen z-10">
        <BackToTop />
        <Toaster position='top-center' />
        {!user && <Navbar onSignInClick={handleOpenSignIn} />}

        <Routes>
          {/* Public Pages - Restricted for Authenticated Users */}
          <Route path="/" element={<PublicRoute element={<Home onGetStarted={() => setIsSignUpOpen(true)} />} />} />
          <Route path="/features" element={<PublicRoute element={<Features />} />} />
          <Route path="/community" element={<PublicRoute element={<Community />} />} />
          <Route path="/docs" element={<PublicRoute element={<Documentation />} />} />
          <Route path="/about" element={<PublicRoute element={<About />} />} />

          {/* Protected Routes */}
          {/* Main Chat Route - DM or Default Chat */}
          <Route path="/chat" element={<PrivateRoute element={<Chat />} />} />

          {/* Dynamic Chat Route - for Individual Messages (DM) */}
          <Route path="/chat/:userId" element={<PrivateRoute element={<Chat />} />} />

          {/* Dynamic Chat Route - for Group or Channel Messages */}
          <Route path="/chat/:type/:id" element={<PrivateRoute element={<Chat />} />} />

          {/* User Profile Route */}
          <Route path="/profile/:userId" element={<PrivateRoute element={<Profile />} />} />

          {/* Settings Route */}
          <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />

          {/* Redirects */}
          <Route path="/pricing" element={<Navigate to="/features" />} />
          <Route path="/blog" element={<Navigate to="/community" />} />
          <Route path="/contact" element={<Navigate to="/about" />} />

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