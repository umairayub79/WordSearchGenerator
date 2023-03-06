import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="mb-[2%] h-[3rem] w-full py-1 shadow-xl bg-blue-600 text-white">
       <div className="flex h-full items-center justify-between px-5">
          <div>
            <p className="text-xl font-bold dark:text-gray-200">WordSearch Generator</p>
          </div>
          <div>
            <a href="https://github.com/umairayub79/WordSearchGenerator" target="_blank">
              <FaGithub className="w-7 h-7" />
            </a>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;