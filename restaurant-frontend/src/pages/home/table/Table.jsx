import React from 'react';
import tableImg from '../../../assets/images/table.png'
const Table = () => {
    return (
        <div className='w-full lg:px-29 md:px-16 sm:px-7 px-4 pb-6'>
            <div className="grid md:grid-cols-2 grid-cols-1">
                <div className="md:block hidden">
                    <img src={tableImg} alt="" className="w-full aspect-square object-cover object-center rounded-l-xl" />
                </div>
                <div className="w-full bg-zinc-800 md:p-8 p-4 flex items-center justify-center md:rounded-r-xl md:rounded-l-none rounded-r-xl rounded-l-xl">
                    <div className="w-full space-y-6">
                        <div className="space-y-1">
                            <h5 className="text-base text-yellow-500 font-normal">
                                DỊCH VỤ
                            </h5>
                            <h1 className="text-xl text-neutral-100 font-bold">
                                ĐẶT BÀN ONLINE
                            </h1>
                        </div>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">

                            <div className="space-y-1.5">
                                <label htmlFor="Họ và Tên" className="text-base text-neutral-400 font-normal block">
                                    Họ Và Tên
                                </label>
                                <input type="text" placeholder='VD: Nguyễn Văn A' className="w-full h-12 border border-neutral-400/40 bg-neutral-900/5 px-3 rounded-lg text-base text-neutral-300 placeholder:text-neutral-500/90 outline-none focus:bg-yellow-600/5 focus:border-yellow-500 ease-in out duration-300" />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="Email" className="text-base text-neutral-400 font-normal block">
                                    Email
                                </label>
                                <input type="text" placeholder='VD: nguyenvana@gmail.com' className="w-full h-12 border border-neutral-400/40 bg-neutral-900/5 px-3 rounded-lg text-base text-neutral-300 placeholder:text-neutral-500/90 outline-none focus:bg-yellow-600/5 focus:border-yellow-500 ease-in out duration-300" />
                            </div>



                            <div className="space-y-1.5">
                                <label htmlFor="Thời Gian" className="text-base text-neutral-400 font-normal block">
                                    Thời Gian
                                </label>
                                <input type="datetime-local" placeholder='' className="w-full h-12 border border-neutral-400/40 bg-neutral-900/5 px-3 rounded-lg text-base text-neutral-300 placeholder:text-neutral-500/90 outline-none focus:bg-yellow-600/5 focus:border-yellow-500 ease-in out duration-300" />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="Số Người" className="text-base text-neutral-400 font-normal block">
                                    Số Người
                                </label>
                                <select name="noofpeople" id="noofpeople" className="w-full h-12 border border-neutral-400/40 bg-neutral-900/5 px-3 rounded-lg text-base text-neutral-300 placeholder:text-neutral-500/90 outline-none focus:bg-yellow-600/5 focus:border-yellow-500 ease-in out duration-300">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>


                            <div className="space-y-1.5"></div>
                        </div>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-6"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;