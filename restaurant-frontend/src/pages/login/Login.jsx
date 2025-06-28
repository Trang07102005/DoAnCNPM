import React from 'react';
import { Link } from 'react-router-dom';
import banner from '../../assets/images/loginbanner.png';

const Login = () => {
  return (
    <div className="text-white h-[100vh] flex justify-center items-center object-cover bg-cover bg-center bg-no-repeat" style={{"backgroundImage": `url(${banner})`}}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative">
            <h1 className='text-4xl text-white font-bold text-center mb-6'>Đăng Nhập</h1>
            <form action="">
                <div className="relative my-4   ">
                <input type="email" className='block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0  border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder=''/>
                <label htmlFor="" className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Email</label>
            </div>
            <div className="relative my-4">
                <input type="password" className='block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0  border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus::text-white focus:border-blue-600 peer' placeholder=''/>
                <label htmlFor="" className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Mật Khẩu</label>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <input type="checkbox" name="" id="" />
                    <label htmlFor="Ghi Nhớ Mật Khẩu"></label>
                </div>
                <span className='text-blue-500'>Quên mật khẩu?</span>
            </div>
            <button type="Submit">Đăng Nhập</button>
            <div className="">
                <span>Chưa Có Tài Khoản? <Link to = {"/register"}>Tạo Tài Khoản</Link></span>
            </div>
            </form>
        </div>
    </div>

  )
}

export default Login;
