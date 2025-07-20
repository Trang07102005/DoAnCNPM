
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername !== username) {
        setUsername(storedUsername);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [username]);

  const navLinks = [
    { href: "/", name: "Trang Chủ" },
    { href: "/foodmenu", name: "Menu" },
    { href: "/thuvien", name: "Thư Viện" },
    { href: "/daubep", name: "Đầu Bếp" },
    { href: "/lienhe", name: "Liên Hệ" },
  ];

  const handleClose = () => setOpen(false);
  const handleLogout = () => {
    localStorage.clear();
    setUsername(null);
    setDropdownOpen(false);
  };

  return (
    <nav className={`w-full fixed top-0 z-50 transition-all duration-300
      ${scrolled ? 'bg-[#0d1d18] py-3 shadow-md' : 'bg-transparent py-6'}
      flex items-center md:flex-row lg:px-28 md:px-16 sm:px-7 px-4`}>
      
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold mr-16 text-white">
        <span className="text-yellow-500">VIET</span>TAURANT
      </Link>
    
      {/* Button (mobile) */}
      <button className="flex-1 lg:hidden text-white flex items-center justify-end">
        {open ? <p>aa</p> : <i className="fa-solid fa-bars text-xl"></i>}
      </button>
    
      {/* Nav Links */}
      <div className={`${open ? 'flex absolute top-14 left-0 w-full h-auto md:h-auto md:relative' : 'hidden'}
        flex-1 md:flex flex-col md:flex-row gap-x-5 gap-y-2 md:items-center md:p-0 sm:p-4 p-4 justify-between
        md:bg-transparent bg-neutral-900 md:shadow-none shadow-md rounded-md`}>
        
        <ul className="list-none flex md:items-center items-start gap-x-7 gap-y-1 flex-wrap
          md:flex-row flex-col text-base text-white font-thin">
          {navLinks.map((item) => {
  const isActive = location.pathname === item.href;
  return (
    <li key={item.href} className="relative group">
      <Link
        onClick={handleClose}
        to={item.href}
        className={`transition-all duration-200 relative 
          ${isActive ? 'text-[#E6B15F]' : 'text-white group-hover:text-[#E6B15F]'}`}
      >
        {item.name}
        {/* Gạch dưới animation */}
        <span
          className={`absolute left-1/35 -bottom-2 h-[2px] w-0 bg-[#E6B15F] transition-all duration-300 group-hover:w-full group-hover:left-0 
            ${isActive ? 'w-full left-0' : ''}`}
        ></span>
      </Link>
    </li>
  );
})}

        </ul>
    
        <div className="flex md:items-center items-start gap-x-5 gap-y-2 flex-wrap
          md:flex-row flex-col text-base font-medium text-white">
          
          {username ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-[#E6B15F] px-6 py-1 rounded-full border border-yellow-600 text-sm text-white font-medium hover:bg-yellow-600/90"
              >
                {username}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-md z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={"/login"}
              className="bg-[#E6B15F] px-11 py-3  border border-yellow-600 text-sm text-black font-medium hover:bg-yellow-500 transition-all duration-300"
            >
              ĐĂNG NHẬP
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
