import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import banner from '../../assets/images/loginbanner.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import { toast } from 'react-toastify';          // Thêm import toast
import 'react-toastify/dist/ReactToastify.css'; // Thường import CSS ở App.js, hoặc bạn có thể import ở đây cũng được

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warn("Vui lòng nhập đầy đủ email và mật khẩu.");  // Thay alert bằng toast.warn
      return;
    }

    try {
      const cleanInput = (str) =>
        str.replace(/[\n\r]/g, "").trim();

      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email: cleanInput(email),
        password: cleanInput(password)
      });

      const { token, role, username, email: userEmail } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      localStorage.setItem("email", userEmail);

      onLogin?.(role); // gọi callback để App biết đã đăng nhập
      toast.success("Đăng nhập thành công!");    // Thay alert thành toast.success

      // Điều hướng theo role
      switch (role) {
        case "Admin":
          navigate("/admin/dashboard");
          break;
        case "Cashier":
          navigate("/cashier/dashboard");
          break;
        case "Staff":
          navigate("/staff/dashboard");
          break;
        case "Customer":
          navigate("/");
          break;
        case "Chef":
          navigate("/chef/dashboard");
          break;
        case "Manager":
          navigate("/manager/dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err) {
      console.error("Đăng nhập thất bại:", err);
      toast.error("Sai email hoặc mật khẩu.");   // Thay alert thành toast.error
    }
  };

  return (
    <div
      className="text-white h-[100vh] flex justify-center items-center object-cover bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative">
        <h1 className="text-4xl text-white font-bold text-center mb-6">Đăng Nhập</h1>
        <form onSubmit={handleSubmit}>
          <div className="relative my-10">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:text-white focus:border-blue-600 peer"
              placeholder=""
              required
            />
            <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Email
            </label>
            <FontAwesomeIcon className="absolute top-0 right-4" icon={faUser} />
          </div>

          <div className="relative my-10">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:text-white focus:border-blue-600 peer"
              placeholder=""
              required
            />
            <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Mật Khẩu
            </label>
            <FontAwesomeIcon className="absolute top-0 right-4" icon={faLock} />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Ghi Nhớ Mật Khẩu</label>
            </div>
            <span className="text-blue-500 cursor-pointer">Quên mật khẩu?</span>
          </div>

          <button
            className="w-full mb-4 text-[18px] mt-6 rounded-full text-white bg-yellow-600 hover:bg-white hover:text-yellow-600 py-2 transition border-[2px] border-yellow-600"
            type="submit"
          >
            Đăng Nhập
          </button>

          <div className="text-center">
            <span>
              Chưa Có Tài Khoản?{' '}
              <Link className="text-blue-500 ml-2" to="/register">
                Tạo Tài Khoản
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
