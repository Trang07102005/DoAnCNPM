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
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-slate-200">
  <h2 className="text-4xl font-extrabold mb-8 text-indigo-700 border-b-2 border-indigo-200 pb-3">
    Quản Lý Phân Quyền
  </h2>

  <div className="flex justify-end mb-6">
    <button
      onClick={openRoleModal}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition duration-200"
    >
      Xem Vai Trò
    </button>
  </div>

  <div className="overflow-x-auto rounded-xl border border-gray-300">
    <table className="min-w-full bg-white">
      <thead className="bg-indigo-100 text-gray-700 text-sm uppercase font-semibold">
        <tr>
          {["ID", "Tên", "Email", "Vai trò", "Thao tác"].map((head) => (
            <th key={head} className="py-3 px-6 text-left border-b border-slate-300">{head}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.userId} className="even:bg-slate-100 hover:bg-yellow-50 transition">
            <td className="py-3 px-6">{u.userId}</td>
            <td className="py-3 px-6 font-semibold text-slate-700">{u.username}</td>
            <td className="py-3 px-6">{u.email}</td>
            <td className="py-3 px-6">
              {editUserId === u.userId ? (
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {rolesList.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="capitalize text-indigo-600 font-medium">{u.role?.name}</span>
              )}
            </td>
            <td className="py-3 px-6 text-center">
              {editUserId === u.userId ? (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => saveRoleChange(u.userId)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md shadow"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded-md shadow"
                  >
                    Huỷ
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing(u.userId, u.role.name)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md shadow"
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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white p-6 rounded-xl shadow-2xl w-[460px] max-w-full border border-slate-300"
        >
          <h3 className="text-2xl font-bold mb-5 text-indigo-700">Danh Sách Vai Trò</h3>

          <ul className="space-y-3 mb-6">
            {rolesList.map((role) => (
              <li
                key={role.id}
                className="flex justify-between items-center bg-indigo-50 border border-indigo-200 rounded-md px-4 py-2"
              >
                <span className="font-medium text-gray-800 capitalize">{role.name}</span>
                <div className="space-x-2">
                  <button className="text-sm px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 shadow-sm">
                    Sửa
                  </button>
                  <button className="text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 shadow-sm">
                    Xoá
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-3 mb-6">
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="Tên vai trò mới"
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleAddRole}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md"
            >
              Thêm
            </button>
          </div>

          <div className="text-right">
            <button
              onClick={() => setShowRoleModal(false)}
              className="text-gray-600 hover:text-red-500 px-4 py-2 rounded-md transition"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</div>


    
  );
};

export default RoleManagement;
