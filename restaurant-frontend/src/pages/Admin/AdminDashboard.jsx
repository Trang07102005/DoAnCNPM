import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/admin/test", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(res.data);
      } catch (err) {
        setMessage("Không thể truy cập: " + (err.response?.data || "Lỗi không xác định"));
      }
    };

    fetchAdminData();
  }, []);

    return (
        <div>
            <div className="p-4 text-lg">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>{message}</p>
    </div>
        </div>
    );
};

export default AdminDashboard;