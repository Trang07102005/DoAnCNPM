import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách người dùng:", err);
      toast.error("Lấy danh sách người dùng thất bại.");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Xóa người dùng thành công.");
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi xóa người dùng:", err);
      toast.error("Xóa người dùng thất bại.");
    }
  };

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.password || !newUser.email || !newUser.role) {
      toast.warn("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/users", newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Tạo người dùng mới thành công!");
      setNewUser({ username: "", password: "", email: "", role: "" });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi tạo người dùng:", err);
      toast.error("Tạo người dùng thất bại.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800 border-b pb-4">Danh Sách Người Dùng</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-5 text-left text-sm font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200">ID</th>
              <th className="py-3 px-5 text-left text-sm font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200">Tên</th>
              <th className="py-3 px-5 text-left text-sm font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200">Email</th>
              <th className="py-3 px-5 text-left text-sm font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200">Role</th>
              <th className="py-3 px-5 text-center text-sm font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.userId} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                <td className="py-3 px-5 text-gray-700">{u.userId}</td>
                <td className="py-3 px-5 text-gray-800 font-medium">{u.username}</td>
                <td className="py-3 px-5 text-gray-700">{u.email}</td>
                <td className="py-3 px-5 text-gray-700 capitalize">{u.role}</td>
                <td className="py-3 px-5 text-center space-x-3">
                  <button
                    className="inline-block bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => toast.info("Tính năng sửa sẽ làm sau")}
                  >
                    Sửa
                  </button>
                  <button
                    className="inline-block bg-red-600 hover:bg-red-700 transition text-white px-4 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    onClick={() => handleDelete(u.userId)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form thêm người dùng */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Thêm Người Dùng Mới</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            placeholder="Tên người dùng"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          />
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Mật khẩu"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          >
            <option value="">Chọn vai trò</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
            <option value="Staff">Staff</option>
            <option value="Manager">Manager</option>
            <option value="Cashier">Cashier</option>
            <option value="Chef">Chef</option>
          </select>
        </div>
        <button
          onClick={handleCreateUser}
          className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-md shadow-md transition focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Tạo người dùng
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
