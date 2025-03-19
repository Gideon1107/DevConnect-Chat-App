import Logo from "../assets/devLogo4.png"
import { Github, Twitter, Linkedin, Facebook } from "lucide-react"
import { Link } from "react-router-dom"
export const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-12">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-blue-500">
              <img src={Logo} alt="logo"  width={150}/>
            </Link>
            <p className="text-gray-400 text-sm font-light">
              Connect, collaborate, and grow with developers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 font-light">
              <li>
                <Link to="/features" className="text-gray-400 hover:text-white text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-gray-400 hover:text-white text-sm">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 font-light">
              <li>
                <Link to="/docs" className="text-gray-400 hover:text-white text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-400 hover:text-white text-sm">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 font-light">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 font-light">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} DevConnect. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}