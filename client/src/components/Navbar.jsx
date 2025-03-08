import { useState } from "react"
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom"
import Logo from "../assets/devLogo4.png"
import PropTypes from "prop-types"

export const Navbar = ({ onSignInClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const location = useLocation()

  const handleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

    return (
      <div className="fixed w-full z-10">
        <nav className=" w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
          <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] ">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/" >
                  <img src={Logo} alt="logo" width={180} />
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/features"
                  className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-base${location.pathname === '/features' ? 'text-white' : ''
                    }`}
                >
                  Features
                </Link>
                <Link
                  to="/community"
                  className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-base ${location.pathname === '/community' ? 'text-white' : ''
                    }`}
                >
                  Community
                </Link>
                <Link
                  to="/docs"
                  className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-base ${location.pathname === '/docs' ? 'text-white' : ''
                    }`}
                >
                  Docs
                </Link>
                <button
                  onClick={onSignInClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  Sign In
                </button>
              </div>
              <div className="md:hidden">
                <button className="text-gray-300 hover:text-white text-base" onClick={handleMobileMenu}>
                  {isMenuOpen ? <RxCross1 size={24} /> : <HiOutlineMenuAlt3 size={24} />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={` text-white absolute top-[64px]  bg-slate-900/95 backdrop-blur-sm w-full py-8 transition-all duration-500 ease-out overflow-hidden ${isMenuOpen ? "max-h-[300px] opacity-100 " : "max-h-0 opacity-0 "}`}>
          <div className="flex flex-col md:hidden items-center space-y-4 w-full ">
            <Link
              to="/"
              onClick={handleMobileMenu}
              className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm ${location.pathname === '/' ? 'text-white' : ''
                }`}
            >
              Home
            </Link>

            <Link
              to="/features"
              onClick={handleMobileMenu}
              className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm ${location.pathname === '/features' ? 'text-white' : ''
                }`}
            >
              Features
            </Link>
            <Link
              to="/community"
              onClick={handleMobileMenu}
              className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm ${location.pathname === '/community' ? 'text-white' : ''
                }`}
            >
              Community
            </Link>
            <Link
              to="/docs"
              onClick={handleMobileMenu}
              className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm ${location.pathname === '/docs' ? 'text-white' : ''
                }`}
            >
              Docs
            </Link>
            <button
              onClick={onSignInClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Prop Validation
  Navbar.propTypes = {
    onSignInClick: PropTypes.func.isRequired //onSignInClick must be a function and is required
  };