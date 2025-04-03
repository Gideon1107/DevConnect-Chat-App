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
    <>
      <div className="py-5 sm:py-5 flex items-center w-full justify-between bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50 sticky top-0 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">

        <Link to="/" >
          <img src={Logo} alt="logo" width={180} />
        </Link>


        <nav className="hidden sm:block">
          <ul className="flex lg:gap-10 md:gap-8">
            <Link
              to="/features"
              className={`text-gray-300 font-light hover:text-white px-3 py-2 rounded-md text-base${location.pathname === '/features' ? 'text-white' : ''
                }`}
            >
              Features
            </Link>

            <Link
              to="/community"
              className={`text-gray-300 font-light hover:text-white px-3 py-2 rounded-md text-base ${location.pathname === '/community' ? 'text-white' : ''
                }`}
            >
              Community
            </Link>

            <Link
              to="/docs"
              className={`text-gray-300 font-light hover:text-white px-3 py-2 rounded-md text-base ${location.pathname === '/docs' ? 'text-white' : ''
                }`}
            >
              Docs
            </Link>

            <button
              onClick={onSignInClick}
              className="bg-blue-600 text-white px-8 py-2 rounded-[3px] text-sm hover:bg-blue-700"
            >
              Sign In
            </button>

          </ul>
        </nav>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <button className="text-gray-300 hover:text-white text-base" onClick={handleMobileMenu}>
            {isMenuOpen ? <RxCross1 size={24} /> : <HiOutlineMenuAlt3 size={24} />}
          </button>
        </div>
      </div>


      {/* Mobile menu */}
      <div className={`z-10 text-white fixed top-[64px] left-0 bg-slate-900/95 backdrop-blur-sm w-full  transition-all duration-500 ease-in-out  ${isMenuOpen ? "max-h-[600px] opacity-100 py-8" : "max-h-0 opacity-0 overflow-hidden "}`}>
        <ul className="flex flex-col gap-6 justify-center w-full items-center">
          <Link
            to="/"
            onClick={handleMobileMenu}
            className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm ${location.pathname === '/' ? 'text-white font-semibold' : ''
              }`}
          >
            Home
          </Link>

          <Link
            to="/features"
            onClick={handleMobileMenu}
            className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm ${location.pathname === '/features' ? 'text-white font-semibold' : ''
              }`}
          >
            Features
          </Link>
          <Link
            to="/community"
            onClick={handleMobileMenu}
            className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm ${location.pathname === '/community' ? 'text-white font-semibold' : ''
              }`}
          >
            Community
          </Link>
          <Link
            to="/docs"
            onClick={handleMobileMenu}
            className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm ${location.pathname === '/docs' ? 'text-white font-semibold' : ''
              }`}
          >
            Docs
          </Link>
          <button
            onClick={onSignInClick}
            className="bg-blue-600 text-white px-6 py-2  rounded-[3px] text-sm hover:bg-blue-700 active:bg-blue-800"
          >
            Sign In
          </button>
        </ul>
      </div>

    </>
  )
}


// Prop Validation
Navbar.propTypes = {
  onSignInClick: PropTypes.func.isRequired //onSignInClick must be a function and is required
};



