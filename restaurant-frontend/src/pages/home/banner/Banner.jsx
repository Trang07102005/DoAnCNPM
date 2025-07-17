import { faCircleInfo, faCreditCard, faHeadset } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Banner = () => {
    return (
        <div className='w-full bg-[#152C29] lg:px-28 md:px-16 sm:px-7 px-4 lg:py-10 md:py-8 sm:py-6 py-4'>
            <div className="bg-zinc-700 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-14 md:gap-12 sm:gap-8 gap-6 items-center rounded-md px-4 py-8">
                <div className="flex items-center justify-center gap-x-3">
                    <div className="w-11 h-11 rounded-xl bg-[#E6B15F] flex items-center justify-center text-2xl text-neutral-100">
                        <FontAwesomeIcon icon={faCreditCard}  className='text-black'/>
                    </div>
                    <h5 className="text-lg text-neutral-200 font-medium">
                        Thanh Toán Mọi Hình Thức
                    </h5>
                </div>
                <div className="flex items-center justify-center gap-x-3">
                    <div className="w-11 h-11 rounded-xl bg-[#E6B15F] flex items-center justify-center text-2xl text-neutral-100">
                        <FontAwesomeIcon icon={faCircleInfo}  className='text-black'/>
                    </div>
                    <h5 className="text-lg text-neutral-200 font-medium">
                        Mở Cửa Từ 18:00 - 00:00
                    </h5>
                </div>
                <div className="flex items-center justify-center gap-x-3">
                    <div className="w-11 h-11 rounded-xl bg-[#E6B15F] flex items-center justify-center text-2xl text-neutral-100">
                        <FontAwesomeIcon icon={faHeadset}  className='text-black'/>
                    </div>
                    <h5 className="text-lg text-neutral-200 font-medium">
                        Hỗ Trợ Nhanh Chóng
                    </h5>
                </div>
            </div>
        </div>
    );
};

export default Banner;