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
    
    <div className="max-w-7xl mx-auto p-6 space-y-10 bg-white rounded-lg shadow-md">
      <div className="flex justify-end mb-4">
  <button
    onClick={() => setShowCreateModal(true)}
    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md shadow-sm"
  >
    Thêm Người Dùng
  </button>
</div>
      <h2 className="text-3xl font-semibold text-gray-800 border-b pb-4">Danh Sách Người Dùng</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-5 text-left text-sm font-medium text-gray-600 uppercase border-b">ID</th>
              <th className="py-3 px-5 text-left text-sm font-medium text-gray-600 uppercase border-b">Tên</th>
              <th className="py-3 px-5 text-left text-sm font-medium text-gray-600 uppercase border-b">Email</th>
              <th className="py-3 px-5 text-left text-sm font-medium text-gray-600 uppercase border-b">Vai trò</th>
              <th className="py-3 px-5 text-center text-sm font-medium text-gray-600 uppercase border-b">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.userId} className="even:bg-gray-50 hover:bg-gray-100">
                <td className="py-3 px-5">{u.userId}</td>
                <td className="py-3 px-5 font-medium">{u.username}</td>
                <td className="py-3 px-5">{u.email}</td>
                <td className="py-3 px-5 capitalize">{u.role?.name}</td>
                <td className="py-3 px-5 text-center space-x-3">
                  <button
                    onClick={() => toast.info("Tính năng sửa sẽ làm sau")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(u.userId)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>

      {showCreateModal && (
        <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
    <motion.div
        className="bg-white p-6 rounded-md shadow-lg w-full max-w-xl mx-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
      <h3 className="text-2xl font-semibold mb-6 border-b pb-3">Thêm Người Dùng Mới</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <input
          type="text"
          name="username"
          value={newUser.username}
          onChange={handleInputChange}
          placeholder="Tên người dùng"
          className="border rounded-md px-4 py-2"
        />
        <input
          type="password"
          name="password"
          value={newUser.password}
          onChange={handleInputChange}
          placeholder="Mật khẩu"
          className="border rounded-md px-4 py-2"
        />
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="border rounded-md px-4 py-2"
        />
        <select
          name="role"
          value={newUser.role}
          onChange={handleInputChange}
          className="border rounded-md px-4 py-2"
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
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
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
