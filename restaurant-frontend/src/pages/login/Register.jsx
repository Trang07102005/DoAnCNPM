import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import banner from '../../assets/images/loginbanner.png';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Register = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [username, setUsername] = useState(''); // giả sử bạn thêm field username sau này

const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }

  try {
    await axios.post("http://localhost:8080/api/auth/register", {
      email,
      password,
      username,
      confirmPassword
    });
    alert("Đăng ký thành công!");
    navigate("/login");
  } catch (err) {
    alert(err.response?.data || "Lỗi đăng ký");
  }
};
    return (
        <div className="text-white h-[100vh] flex justify-center items-center object-cover bg-cover bg-center bg-no-repeat" style={{"backgroundImage": `url(${banner})`}}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative">
            <h1 className='text-4xl text-white font-bold text-center mb-6'>Đăng Ký</h1>
            <form action="" onSubmit={handleSubmit}>
                <div className="relative my-10  ">
                <input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:text-white focus:border-blue-600 peer"
  placeholder=""
/>
                <label htmlFor="" className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Email</label>
                <FontAwesomeIcon className='absolute top-0 right-4' icon={faUser} />
          
            </div>
            <div className="relative my-10">
                    <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:text-white focus:border-blue-600 peer"
                    placeholder=""
                />
                <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Tên người dùng
                </label>
                <FontAwesomeIcon className="absolute top-0 right-4" icon={faUser} />
</div>
            <div className="relative my-10">
                <input type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className='block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0  border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus::text-white focus:border-blue-600 peer' placeholder=''/>
                <label htmlFor="" className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Mật Khẩu</label>
                <FontAwesomeIcon className='absolute top-0 right-4' icon={faLock} />
            </div>
            <div className="relative my-10">
                <input type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                 className='block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0  border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus::text-white focus:border-blue-600 peer' placeholder=''/>
                <label htmlFor="" className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Xác Nhận Mật Khẩu</label>
                <FontAwesomeIcon className='absolute top-0 right-4' icon={faLock} />
            </div>
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <input type="checkbox" name="" id="" />
                    <label htmlFor="Ghi Nhớ Mật Khẩu">Ghi Nhớ Mật Khẩu</label>
                </div>
                <span className='text-blue-500'>Quên mật khẩu?</span>
            </div>
            <button className='w-full mb-4 text-[18px] mt-6 rounded-full  text-white bg-yellow-600 hover:bg-white hover:text-yellow-600 py-2 transition border-[2px] border-yellow-600 ' type="Submit">Đăng Ký</button>
            <div className="">
                <span className='m-4'>Đã có tài Khoản? <Link className='text-blue-500 ml-15' to = {"/login"}>Đăng Nhập</Link></span>
            </div>
            </form>
        </div>
    </div>
    );
};

export default Register;