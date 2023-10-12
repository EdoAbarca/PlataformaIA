import React, { useState } from 'react';
import { Link } from 'react-router-dom';
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between flex-wrap p-6 bg-black">
      <div className="block lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400"
        >
          <svg
            className={`fill-current h-3 w-3 ${isOpen ? "hidden" : "block"}`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
          <svg
            className={`fill-current h-3 w-3 ${isOpen ? "block" : "hidden"}`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
          </svg>
        </button>
      </div>
      <div
        className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isOpen ? "block" : "hidden"}`}
      >
        <div className="text-sm lg:flex-grow">
          <Link to="/" className="block text-lg mt-4 lg:inline-block lg:mt-0 text-white font-bold mr-4">
            Home
          </Link>
          <Link to="/register" className="block mt-4 lg:inline-block lg:mt-0 text-white font-semibold mr-4">
            Register
          </Link>
          <Link to="/login" className="block mt-4 lg:inline-block lg:mt-0 text-white font-semibold mr-4">
            Login
          </Link>
          <Link to="/loggedin" className="block mt-4 lg:inline-block lg:mt-0 text-white font-semibold mr-4">
            After login
          </Link>
          <Link to="/analysis-form" className="block mt-4 lg:inline-block lg:mt-0 text-white font-semibold mr-4">
            Analysis form
          </Link>
          <Link to="/keys" className="block mt-4 lg:inline-block lg:mt-0 text-white font-semibold mr-4">
            Keys
          </Link>
          <Link to="/analysis" className="block mt-4 lg:inline-block lg:mt-0 text-white font-semibold mr-4">
            Analysis
          </Link>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 hover:bg-gray-400 focus:outline-none focus:shadow-outline"
          >
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
              />
            </svg>
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 py-2 w-64 bg-white rounded-lg shadow-xl">
              <p
                className="block px-4 py-2 text-gray-800"
              >
                Username
              </p>
              <p
                className="block px-4 py-2 text-gray-800"
              >
                Email
              </p>
              <p
                className="block px-4 py-2 text-gray-800"
              >
                Role
              </p>
              <p
                className="block px-4 py-2 text-gray-800 hover:bg-red-500 hover:text-white"
              >
                Sign out
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;