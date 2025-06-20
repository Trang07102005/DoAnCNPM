import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faFacebook, faInstagram,  faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <footer className='w-full bg-neutral-700 lg:px-28 md:px-16 sm:px-7 px-4 py-10 mt-[3ch]'>
            <div className="grid md:grid-cols-6 sm:grid-cols-4 grid-cols-1 gap-14">
               
                <div className="col-span-2 space-y-7">
                    <div className="space-y-3">
                        <Link to = {"/"} className='text-4xl text-neutral-800 font-bold'>
                            <span className='text-yellow-500'>VIET</span>TAURANT
                        </Link>
                        <p className="text-base text-neutral-400 font-normal line-clamp-3">
                             ipsum dolor, sit amet consectetur adipisicing elit. Adipisci porro qui velit neque, voluptate autem sunt deleniti facere ullam assumenda ut tenetur totam eligendi cum at molestias facilis eius sit?
                        </p>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Link to= {"/"} className='w-11 h-11 rounded-lg bg-neutral-100/20 flex items-center justify-center text-xl text-neutral-200 group ease-in-out duration-300'>  
                            <FontAwesomeIcon icon={faInstagram} className='w-6 h-8 group-hover:text-yellow-500 ease-in-out duration-300'/>
                        </Link>
                        <Link to= {"/"} className='w-11 h-11 rounded-lg bg-neutral-100/20 flex items-center justify-center text-xl text-neutral-200 group ease-in-out duration-300'>  
                            <FontAwesomeIcon icon={faFacebook} className='w-6 h-8 group-hover:text-yellow-500 ease-in-out duration-300'/>
                        </Link>
                        <Link to= {"/"} className='w-11 h-11 rounded-lg bg-neutral-100/20 flex items-center justify-center text-xl text-neutral-200 group ease-in-out duration-300'>  
                            <FontAwesomeIcon icon={faYoutube} className='w-6 h-8 group-hover:text-yellow-500 ease-in-out duration-300'/>
                        </Link>
                        <Link to= {"/"} className='w-11 h-11 rounded-lg bg-neutral-100/20 flex items-center justify-center text-xl text-neutral-200 group ease-in-out duration-300'>  
                            <FontAwesomeIcon icon={faXTwitter} className='w-6 h-8 group-hover:text-yellow-500 ease-in-out duration-300'/>
                        </Link>
                    </div>
                </div>

                <div className="col-span-1 space-y-7">
                    <h2 className="text-xl text-neutral-100 font-medium">
                        LINK NGẮN GỌN
                    </h2>
                    <div className="space-y-3 flex flex-col">
                        <Link to = {"/"} className='text-base text-neutral-400 hover:text-yellow-500 font-normal ease-in-out duration-300'> 
                            Giới Thiệu
                        </Link>
                        <Link to = {"/"} className='text-base text-neutral-400 hover:text-yellow-500 font-normal ease-in-out duration-300'> 
                            Món ăn nổi bật
                        </Link>
                        <Link to = {"/"} className='text-base text-neutral-400 hover:text-yellow-500 font-normal ease-in-out duration-300'> 
                            Thư viện
                        </Link>
                        <Link to = {"/"} className='text-base text-neutral-400 hover:text-yellow-500 font-normal ease-in-out duration-300'> 
                            Liên hệ
                        </Link>
                    </div>
                </div>

                <div className="col-span-1 space-y-7">
                    <h2 className="text-xl text-neutral-100 font-medium">
                        MÓN ĂN NỔI BẬT
                    </h2>
                    <div className="space-y-3 flex flex-col">
                        <Link to = {"/"} className='text-base text-neutral-400 hover:text-yellow-500 font-normal ease-in-out duration-300'> 
                            GÀ NƯỚNG NGŨ VỊ
                        </Link>
                        <Link to = {"/"} className='text-base text-neutral-400 hover:text-yellow-500 font-normal ease-in-out duration-300'> 
                            FRESH BURGER
                        </Link>
                        <Link to = {"/"} className='text-base text-neutral-400 hover:text-yellow-500 font-normal ease-in-out duration-300'> 
                            PIZZA HAWAII
                        </Link>
                        <Link to = {"/"} className='text-base text-neutral-400 hover:text-yellow-500 font-normal ease-in-out duration-300'> 
                            MÓN ĂN ĐỊA PHƯƠNG
                        </Link>
                    </div>
                </div>

                <div className="col-span-2 space-y-7">
                    <h2 className="text-xl text-neutral-100 font-medium">
                        GIỮ LIÊN LẠC VỚI CHÚNG TÔI
                    </h2>
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <h6 className="text-lg text-neutral-300 font-medium">
                                ĐỊA CHỈ NHÀ HÀNG
                            </h6>
                            <div className="flex items-center gap-x-2">
                                <div className="w-5 h-8 rounded-lg bg-yellow-600/40 text-neutral-300 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faMapPin} />
                                </div>
                                <p className="text-base text-neutral-400 font-normal flex-1">
                                    828 Sư Vạn Hạnh, Phường 13, Quận 10, thành phố Hồ Chí Minh
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <h6 className="text-lg text-neutral-300 font-medium">
                                HOTLINE
                            </h6>
                            <div className="flex items-center gap-x-2">
                                <div className="w-5 h-8 rounded-lg bg-yellow-600/40 text-neutral-300 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faMapPin} />
                                </div>
                                <p className="text-base text-neutral-400 font-normal flex-1">
                                    0123 456 789
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <h6 className="text-lg text-neutral-300 font-medium">
                                EMAIL
                            </h6>
                            <div className="flex items-center gap-x-2">
                                <div className="w-5 h-8 rounded-lg bg-yellow-600/40 text-neutral-300 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faMapPin} />
                                </div>
                                <p className="text-base text-neutral-400 font-normal flex-1">
                                    restaurant@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;