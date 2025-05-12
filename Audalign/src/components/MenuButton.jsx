import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalStore from '../zustand/store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logedIn, setLogedIn } = useGlobalStore();

  const handleLogout = () => {
    setLogedIn(false);
    setIsOpen(false); // close the menu after logout
    navigate('/'); // redirect to home or login page
  };

  const menuItems = [
    { name: 'Home', link: '/' },
    { name: 'Upload a Video', link: '/Upload' },
    !logedIn
      ? { name: 'Login', link: '/Auth' }
      : { name: 'Logout', link: '#', onClick: handleLogout }
  ];

  return (
    <div className="relative min-h-[50px]">
      {!isOpen && (
        <button
          className="gap-2.5 px-5 py-3.5 whitespace-nowrap bg-lime-300 rounded-3xl min-h-[50px] active:scale-95 transition-transform duration-150"
          onClick={() => setIsOpen(true)}
        >
          MENU
        </button>
      )}

      {isOpen && (
        <div
          className="absolute top-0 left-0 w-[300px] min-h-[50px] bg-[#D0FF71] rounded-xl p-6 shadow-lg"
          style={{ zIndex: 100 }}
        >
          <button
            className="bg-black text-white rounded-full px-4 py-2 mb-4 active:scale-95 transition-transform duration-150"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>

          <ul className="space-y-4">
            {menuItems.map((menuItem, index) => (
              <li
                key={index}
                className="group text-black text-2xl font-bold cursor-pointer flex items-center"
                onClick={() => {
                  if (menuItem.onClick) {
                    menuItem.onClick();
                  } else {
                    if(menuItem.link === '/Upload' && logedIn) {
                      navigate(menuItem.link);
                    }
                    else if(menuItem.link === '/Upload' && !logedIn){
                      toast.error('Login First to use this functionality!');
                    }
                    else {
                      navigate(menuItem.link);
                    }
                  }
                }}
              >
                <span className="group-hover:mr-3 transition-all duration-400 text-3xl"></span>
                {menuItem.name}
              </li>
            ))}
          </ul>

          <div className="flex gap-4 mt-8 text-black text-base">
            <a href="#" className="hover:underline">Facebook</a>
            <a href="#" className="hover:underline">LinkedIn</a>
          </div>
          <div className="flex gap-4 mt-2 text-black text-sm">
            <a href="#" className="hover:underline">Instagram</a>
            <a href="#" className="hover:underline">Twitter</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;