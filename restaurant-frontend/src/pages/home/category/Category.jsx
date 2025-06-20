import { faPizzaSlice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

const Category = () => {
    return (
        <div className='w-full lg:px-28 md:px-16 sm:px-7 px-4 py-6 space-y-4'>
            {/* Top Section */}
            <div className="w-full flex items-center justify-between">
                <h5 className="text-xl text-neutral-700 font-semibold">
                    Danh Mục Nổi Bật
                </h5>

                <Link to = {"/"} className='text-sm text-neutral-500 font-medium hover:text-yellow-500 ease-in-out duration-300'>
                    Xem Tất Cả
                </Link>
            </div>

            {/*  */}
            <div className="grid md:grid-cols-8 sm:grid-cols-4 grid-cols-3 md:gap-x-6 md:gap-y-6 sm-gap-x-4 sm:gap-y-4 gap-x-3 gap-y-3.5 items-center">
                <Link to = {"/"} className='w-full bg-neutral-300/60 flex items-center justify-center gap-x-2.5 px-3.5 py-3 rounded-full hover:bg-neutral-400/50 focus:bg-zinc-400/50 ease-in-out duration-300'>
                    <FontAwesomeIcon icon={faPizzaSlice} className='w-5 h-5 text-yellow-600'/>
                    <h6 className="md:text-base text-sm text-neutral-600 font-medium">Pizza</h6>
                </Link>
                <Link to = {"/"} className='w-full bg-neutral-300/60 flex items-center justify-center gap-x-2.5 px-3.5 py-3 rounded-full hover:bg-neutral-400/50 focus:bg-zinc-400/50 ease-in-out duration-300'>
                    <FontAwesomeIcon icon={faPizzaSlice} className='w-5 h-5 text-yellow-600'/>
                    <h6 className="md:text-base text-sm text-neutral-600 font-medium">Pizza</h6>
                </Link>
                <Link to = {"/"} className='w-full bg-neutral-300/60 flex items-center justify-center gap-x-2.5 px-3.5 py-3 rounded-full hover:bg-neutral-400/50 focus:bg-zinc-400/50 ease-in-out duration-300'>
                    <FontAwesomeIcon icon={faPizzaSlice} className='w-5 h-5 text-yellow-600'/>
                    <h6 className="md:text-base text-sm text-neutral-600 font-medium">Pizza</h6>
                </Link>
                <Link to = {"/"} className='w-full bg-neutral-300/60 flex items-center justify-center gap-x-2.5 px-3.5 py-3 rounded-full hover:bg-neutral-400/50 focus:bg-zinc-400/50 ease-in-out duration-300'>
                    <FontAwesomeIcon icon={faPizzaSlice} className='w-5 h-5 text-yellow-600'/>
                    <h6 className="md:text-base text-sm text-neutral-600 font-medium">Pizza</h6>
                </Link>
                <Link to = {"/"} className='w-full bg-neutral-300/60 flex items-center justify-center gap-x-2.5 px-3.5 py-3 rounded-full hover:bg-neutral-400/50 focus:bg-zinc-400/50 ease-in-out duration-300'>
                    <FontAwesomeIcon icon={faPizzaSlice} className='w-5 h-5 text-yellow-600'/>
                    <h6 className="md:text-base text-sm text-neutral-600 font-medium">Pizza</h6>
                </Link>
                <Link to = {"/"} className='w-full bg-neutral-300/60 flex items-center justify-center gap-x-2.5 px-3.5 py-3 rounded-full hover:bg-neutral-400/50 focus:bg-zinc-400/50 ease-in-out duration-300'>
                    <FontAwesomeIcon icon={faPizzaSlice} className='w-5 h-5 text-yellow-600'/>
                    <h6 className="md:text-base text-sm text-neutral-600 font-medium">Pizza</h6>
                </Link>
                <Link to = {"/"} className='w-full bg-neutral-300/60 flex items-center justify-center gap-x-2.5 px-3.5 py-3 rounded-full hover:bg-neutral-400/50 focus:bg-zinc-400/50 ease-in-out duration-300'>
                    <FontAwesomeIcon icon={faPizzaSlice} className='w-5 h-5 text-yellow-600'/>
                    <h6 className="md:text-base text-sm text-neutral-600 font-medium">Pizza</h6>
                </Link>
                <Link to = {"/"} className='w-full bg-neutral-300/60 flex items-center justify-center gap-x-2.5 px-3.5 py-3 rounded-full hover:bg-neutral-400/50 focus:bg-zinc-400/50 ease-in-out duration-300'>
                    <FontAwesomeIcon icon={faPizzaSlice} className='w-5 h-5 text-yellow-600'/>
                    <h6 className="md:text-base text-sm text-neutral-600 font-medium">Pizza</h6>
                </Link>
            </div>
        </div>
    );
};

export default Category;