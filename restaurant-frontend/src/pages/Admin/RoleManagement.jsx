import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [rolesList, setRolesList] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/admin/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRolesList(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách roles:", err);
      toast.error("Không thể lấy danh sách vai trò.");
    }
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      toast.warn("Tên vai trò không được để trống!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/admin/roles",
        { name: newRoleName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Thêm vai trò thành công!");
      setNewRoleName("");
      fetchRoles(); // reload lại danh sách
    } catch (err) {
      console.error("Lỗi thêm role:", err);
      toast.error("Thêm vai trò thất bại.");
    }
  };

  const openRoleModal = () => {
    setShowRoleModal(true);
  };

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
      console.error("Lỗi lấy danh sách:", err);
      toast.error("Lấy danh sách người dùng thất bại.");
    }
  };

  const startEditing = (userId, currentRole) => {
    setEditUserId(userId);
    setEditRole(currentRole);
  };

  const cancelEditing = () => {
    setEditUserId(null);
    setEditRole("");
  };

  const saveRoleChange = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:8080/api/admin/users/${userId}/role`,
        { role: editRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Cập nhật vai trò thành công!");
      setEditUserId(null);
      setEditRole("");
      fetchUsers();
    } catch (err) {
      console.error("Lỗi đổi vai trò:", err);
      toast.error("Không thể cập nhật vai trò.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 border-b pb-3 text-gray-800">Quản Lý Phân Quyền</h2>
      <div className="flex justify-end mb-4">
  <button
    onClick={openRoleModal}
    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-sm"
  >
    Xem Vai Trò
  </button>
</div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "Tên", "Email", "Vai trò", "Thao tác"].map((head) => (
                <th
                  key={head}
                  className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.userId} className="even:bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700">
                <td className="py-3 px-6">{u.userId}</td>
                <td className="py-3 px-6 font-medium">{u.username}</td>
                <td className="py-3 px-6">{u.email}</td>
                <td className="py-3 px-6">
                  {editUserId === u.userId ? (
                    <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200 text-gray-700"
                      >
                        {rolesList.map((role) => (
                          <option key={role.id} value={role.name} className="bg-white text-gray-800">
                            {role.name}
                          </option>
                        ))}
                      </select>     ) : (
                    <span className="capitalize">{u.role?.name}</span>
                  )}
                </td>
                <td className="py-3 px-6 space-x-3 text-center">
                  {editUserId === u.userId ? (
                    <>
                      <button
                        onClick={() => saveRoleChange(u.userId)}
                        className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-400 hover:bg-gray-500 transition text-white px-4 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                      >
                        Huỷ
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(u.userId, u.role.name)}
                      className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Sửa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>

      {showRoleModal && (
        <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white p-6 rounded-md shadow-md w-[400px]"
      >
      <h3 className="text-xl font-semibold mb-4">Danh Sách Vai Trò</h3>
      <ul className="space-y-2 mb-4">
        {rolesList.map((role) => (
          <li key={role.id} className="flex justify-between items-center">
            <span>{role.name}</span>
            <div className="space-x-2">
              <button className="text-sm px-3 py-1 bg-yellow-400 rounded-md text-white hover:bg-yellow-500">
                Sửa
              </button>
              <button className="text-sm px-3 py-1 bg-red-500 rounded-md text-white hover:bg-red-600">
                Xoá
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          placeholder="Tên vai trò mới"
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={handleAddRole}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Thêm
        </button>
      </div>

      <button
        onClick={() => setShowRoleModal(false)}
        className="ml-2 text-gray-600 hover:bg-red-300 transition px-4 rounded-md py-2"
      >
        Đóng
      </button>
      </motion.div>
      </motion.div>
)}
      </AnimatePresence>
    </div>

    
  );
};

export default RoleManagement;
