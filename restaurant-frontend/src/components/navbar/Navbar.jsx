import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const  [open, setOpen] = React.useState(false);

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
                    <Link to={"/login"} className="bg-yellow-600 px-6 py-1 rounded-full border border-yellow-600 text-sm text-neutral-50 font-medium hover:bg-yellow-600/5 hover:text-yellow-600 ease-in-out duration-300">
                        ĐĂNG NHẬP
                    </Link>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;