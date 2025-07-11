import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import banner from '../../assets/images/loginbanner.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warn("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      const cleanInput = (str) => str.replace(/[\n\r]/g, "").trim();

      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email: cleanInput(email),
        password: cleanInput(password)
      });

      const { token, role, username, email: userEmail, userId } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("userId", userId);
      onLogin?.(role);
      toast.success("Đăng nhập thành công!");

      switch (role) {
        case "Admin":
          navigate("/admin/dashboard"); break;
        case "Cashier":
          navigate("/cashier/dashboard"); break;
        case "Staff":
          navigate("/staff/dashboard"); break;
        case "Customer":
          navigate("/"); break;
        case "Chef":
          navigate("/chef/dashboard"); break;
        case "Manager":
          navigate("/manager/dashboard"); break;
        default:
          navigate("/"); break;
      }
    } catch (err) {
      console.error("Đăng nhập thất bại:", err);
      toast.error("Sai email hoặc mật khẩu.");
    }
  };

  return (
    <div className="text-white min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${banner})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-slate-400">
        <h1 className="text-4xl font-bold text-white text-center mb-6">Đăng Nhập</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          <InputField icon={faUser} label="Email" type="email" value={email} onChange={setEmail} />
          <InputField icon={faLock} label="Mật khẩu" type="password" value={password} onChange={setPassword} />

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-yellow-500" />
              Ghi nhớ đăng nhập
            </label>
            <span className="text-blue-400 hover:underline cursor-pointer">Quên mật khẩu?</span>
          </div>

          <button type="submit" className="w-full bg-yellow-600 text-white py-2 rounded-full text-lg hover:bg-white hover:text-yellow-600 border-2 border-yellow-600 transition">
            Đăng Nhập
          </button>

          <div className="text-center text-sm">
            <span>Chưa có tài khoản? </span>
            <Link to="/register" className="text-blue-400 hover:underline">Tạo tài khoản</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable input field
const InputField = ({ icon, label, type, value, onChange }) => (
  <div className="relative">
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full py-2 px-4 text-sm text-white bg-transparent border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-blue-500 peer"
      placeholder=" "
      required
    />
    <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6">
      {label}
    </label>
    <FontAwesomeIcon icon={icon} className="absolute right-3 top-2.5 text-white" />
  </div>
);

export default Login;
