import { useState } from 'react'
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
import Chat  from './pages/Chat'
import Profile  from './pages/Profile'
import Settings from './pages/Settings'




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


  return (
    <Router>
      <div className="bg-slate-900 min-h-screen">
        <Navbar onSignInClick={handleOpenSignIn} />
        <Routes>
          <Route path="/" element={<Home onGetStarted={() => setIsSignUpOpen(true)} />} />
          <Route path="/features" element={<Features />} />
          <Route path="/community" element={<Community />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/about" element={<About />} />

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
        <Footer />

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