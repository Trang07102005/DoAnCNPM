import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const  [open, setOpen] = React.useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [username, setUsername] = useState(localStorage.getItem("username"));
    useEffect(() => {
        const interval = setInterval(() => {
          const storedUsername = localStorage.getItem("username");
          if (storedUsername !== username) {
            setUsername(storedUsername);
          }
        }, 500); // check mỗi 0.5 giây
      
        return () => clearInterval(interval);
      }, [username]);
    const navLinks = [
        {href:"/", name:"Trang Chủ"},
        {href:"/menus", name:"Menu"},
        {href:"/danhmuc", name:"Danh Mục"},
        {href:"/vitri", name:"Vị Trí"},
        {href:"/lienlac", name:"Liên Hệ"},
    ]

    const handleClose = () => {
        setOpen(false)
    }

    const handleLogout = () => {
        localStorage.clear();
        setUsername(null);         // cập nhật state ngay lập tức
        setDropdownOpen(false);   // đóng menu dropdown
      };

    return (
        <nav className='w-full h-[8ch] bg-neutral-50 flex items-center md:flex-row lg:px-28 md:px-16 sm:px-7 px-4 fixed top-0 z-50 shadow'>
            {/* Logo */}
            <Link to = {"/"} className='text-2xl text-neutral-800 font-bold mr-16'>
                <span className='text-yellow-500'>VIET</span>TAURANT
            </Link>
            {/* Button */}
            <button className="flex-1 lg:hidden text-neutral-600 flex items-center justify-end">
                {
                    open
                    ?
                    <p>aa</p>
                    :
                    <i className="fa-solid fa-bars text-xl"></i>
                }
            </button>
            {/* Nav Links */}
            <div className={`${open ? 'flex absolute top-14 left-0 w-full h-auto md:h-auto md:relative' : 'hidden'} flex-1 md:flex flex-col md:flex-row gap-x-5 gap-y-2 md:items-center md:p-0 sm:p-4 p-4 justify-between md:bg-transparent bg-neutral-100 md:shadow-none shadow-md rounded-md`}>
                <ul className="list-none flex md:items-center items-start gap-x-7 gap-y-1 flex-wrap md:flex-row flex-col text-base text-neutral-600 font-medium">
                    {navLinks.map((item) => (
                        <li>
                            <Link onClick={handleClose} to = {item.href} className="hover:text-yellow-500">
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                
                <div className="flex md:items-center items-start gap-x-5 gap-y-2 flex-wrap md:flex-row flex-col text-base font-medium text-neutral-800">
                    <div className="w-[300px] px-3 py-1 rounded-full border border-neutral-400/70 bg-transparent flex items-center gap-x-2">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className='w-3.5 h-3.5'/>
                        <input type="text" placeholder='Tìm kiếm món ăn..' className="flex-1 bg-transparent outline-none text-base text-neutral-800 font-normal placeholder:text-neutral-400/80" />
                    </div>
                    {
  username ? (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="bg-yellow-600 px-6 py-1 rounded-full border border-yellow-600 text-sm text-white font-medium hover:bg-yellow-600/90"
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
      className="bg-yellow-600 px-6 py-1 rounded-full border border-yellow-600 text-sm text-neutral-50 font-medium hover:bg-yellow-600/5 hover:text-yellow-600 ease-in-out duration-300"
    >
      ĐĂNG NHẬP
    </Link>
  )
}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;