import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import banner from '../../assets/images/loginbanner.png';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("❌ Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        email,
        password,
        username,
        confirmPassword
      });

      toast.success("✅ Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data || "Đăng ký thất bại.");
    }
  };

  return (
    <div className="text-white min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${banner})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-slate-400">
        <h1 className="text-4xl font-bold text-white text-center mb-6">Đăng Ký</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <InputField icon={faUser} label="Email" type="email" value={email} onChange={setEmail} />
          <InputField icon={faUser} label="Tên người dùng" type="text" value={username} onChange={setUsername} />
          <InputField icon={faLock} label="Mật khẩu" type="password" value={password} onChange={setPassword} />
          <InputField icon={faLock} label="Xác nhận mật khẩu" type="password" value={confirmPassword} onChange={setConfirmPassword} />

          <button type="submit" className="w-full bg-yellow-600 text-white py-2 rounded-full text-lg hover:bg-white hover:text-yellow-600 border-2 border-yellow-600 transition">
            Đăng Ký
          </button>

          <div className="text-center">
            <span>Đã có tài khoản? </span>
            <Link to="/login" className="text-blue-400 hover:underline">Đăng Nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// Tách input riêng để tái sử dụng
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

export default Register;
