import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Lấy danh sách người dùng thất bại.");
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/admin/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRolesList(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Không thể lấy danh sách vai trò.");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xóa người dùng thành công.");
      fetchUsers();
    } catch (err) {
      console.log(err);
      toast.error("Xóa người dùng thất bại.");
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.password || !newUser.email || !newUser.role) {
      toast.warn("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/users",
        {
          ...newUser,
          role: { name: newUser.role },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Tạo người dùng mới thành công!");
      setNewUser({ username: "", password: "", email: "", role: "" });
      fetchUsers();
    } catch (err) {
      console.log(err);
      toast.error("Tạo người dùng thất bại.");
    }
  };

  return (
    
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-slate-200">
  <h2 className="text-4xl font-extrabold text-slate-800 mb-6 border-b-2 border-yellow-300 pb-3">
    Danh Sách Người Dùng
  </h2>

  <div className="flex justify-end mb-4">
    <button
      onClick={() => setShowCreateModal(true)}
      className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
    >
      + Thêm Người Dùng
    </button>
  </div>

  <div className="overflow-x-auto rounded-xl border border-gray-300">
    <table className="min-w-full bg-white text-sm text-slate-700">
      <thead className="bg-yellow-100 text-slate-700 font-semibold text-xs uppercase tracking-wider">
        <tr>
          <th className="py-3 px-5 text-left border-b">ID</th>
          <th className="py-3 px-5 text-left border-b">Tên</th>
          <th className="py-3 px-5 text-left border-b">Email</th>
          <th className="py-3 px-5 text-left border-b">Vai trò</th>
          <th className="py-3 px-5 text-center border-b">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr
            key={u.userId}
            className="even:bg-slate-50 hover:bg-yellow-50 transition-all duration-150"
          >
            <td className="py-3 px-5">{u.userId}</td>
            <td className="py-3 px-5 font-semibold">{u.username}</td>
            <td className="py-3 px-5">{u.email}</td>
            <td className="py-3 px-5 capitalize text-indigo-600 font-medium">{u.role?.name}</td>
            <td className="py-3 px-5 text-center space-x-2">
              <button
                onClick={() => toast.info("Tính năng sửa sẽ làm sau")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md shadow-sm"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(u.userId)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md shadow-sm"
              >
                Xoá
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Modal thêm người dùng */}
  <AnimatePresence>
    {showCreateModal && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-slate-300"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <h3 className="text-2xl font-bold mb-6 text-slate-700 border-b pb-3">
            Thêm Người Dùng Mới
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
              placeholder="Tên người dùng"
              className="border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              placeholder="Mật khẩu"
              className="border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              className="border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Chọn vai trò</option>
              {rolesList.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={() => setShowCreateModal(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Đóng
            </button>
            <button
              onClick={handleCreateUser}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md shadow-sm"
            >
              Tạo
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</div>


  );
};

export default UserManagement;
