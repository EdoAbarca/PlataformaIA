import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCircleUser } from '@fortawesome/free-solid-svg-icons';
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
          <FontAwesomeIcon
            icon={faCircleUser}
            className={`fill-current h-12 w-12 ${isOpen ? "hidden" : "block"}`}
          />
          <FontAwesomeIcon
            icon={faCircleUser}
            className={`fill-current h-12 w-12 ${isOpen ? "block" : "hidden"}`}
          />
        </button>
      </div>
      <div
        className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isOpen ? "block" : "hidden"}`}
      >
        <div className="text-sm lg:flex-grow">
          <Link to="/" className="block text-lg mt-4 lg:inline-block lg:mt-0 font-bold mr-4 transition ease-in-out duration-500 hover:text-white">
            Home <FontAwesomeIcon icon={faHouse} fade className='text-white'/>
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
          <Link to="/faq" className="block mt-4 lg:inline-block lg:mt-0 text-white font-semibold mr-4">
            FAQ
          </Link>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 hover:bg-gray-400 focus:outline-none focus:shadow-outline"
          >
            <FontAwesomeIcon
              icon={faCircleUser}
              className="h-12 w-12 text-gray-700"
            />
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