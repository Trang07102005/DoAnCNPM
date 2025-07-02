import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const roles = ["Admin", "Customer", "Staff", "Manager", "Cashier", "Chef"];

  useEffect(() => {
    fetchUsers();
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
                      className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="capitalize">{u.role}</span>
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
                      onClick={() => startEditing(u.userId, u.role)}
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
    </div>
  );
};

export default RoleManagement;
