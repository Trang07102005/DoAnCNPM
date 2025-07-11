import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageBookings = () => {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    numberOfPeople: 1,
    note: "",
    reservationTime: ""
  });

  useEffect(() => {
    fetchTables();
    fetchReservations();
  }, []);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/tables", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách bàn.");
    }
  };

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/reservations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách đặt bàn.");
    }
  };

  const handleBookClick = () => {
    setShowForm(true);
    setSelectedTable(null);
    setFormData({
      customerName: "",
      phone: "",
      email: "",
      numberOfPeople: 1,
      note: "",
      reservationTime: ""
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.customerName || !formData.email || !formData.reservationTime || !selectedTable) {
      toast.warn("Vui lòng nhập đầy đủ thông tin và chọn bàn.");
      return;
    }

    const data = {
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      numberOfPeople: parseInt(formData.numberOfPeople),
      note: formData.note.trim(),
      reservationTime: formData.reservationTime,
      restaurantTable: { tableId: selectedTable.tableId }
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/reservations", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Đặt bàn thành công!");
      setShowForm(false);
      fetchReservations();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        toast.error("Bàn đã có người đặt trong thời gian này, vui lòng chọn giờ khác.");
      } else {
        toast.error("Đặt bàn thất bại.");
      }
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc muốn huỷ đặt bàn này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Huỷ đặt bàn thành công!");
      fetchReservations();
    } catch (err) {
      console.error(err);
      toast.error("Huỷ đặt bàn thất bại.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Quản lý đặt bàn</h2>
        <button
          onClick={handleBookClick}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Đặt Bàn
        </button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Danh sách đặt bàn</h3>
        <table className="min-w-full border bg-white rounded shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2">Khách hàng</th>
              <th className="border px-3 py-2">Bàn</th>
              <th className="border px-3 py-2">Thời gian</th>
              <th className="border px-3 py-2">Trạng thái</th>
              <th className="border px-3 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.reservationId} className="even:bg-gray-50">
                <td className="border px-3 py-2">{r.customerName}</td>
                <td className="border px-3 py-2">{r.restaurantTable?.tableName}</td>
                <td className="border px-3 py-2">
                  {new Date(r.reservationTime).toLocaleString()}
                </td>
                <td className="border px-3 py-2">{r.status}</td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => handleCancel(r.reservationId)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Huỷ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg space-y-3">
            <h3 className="text-lg font-semibold mb-2">Thông tin đặt bàn</h3>

            <select
              value={selectedTable?.tableId || ""}
              onChange={(e) => {
                const t = tables.find((tb) => tb.tableId === parseInt(e.target.value));
                setSelectedTable(t);
              }}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Chọn bàn</option>
              {tables.map((t) => (
                <option key={t.tableId} value={t.tableId}>
                  {t.tableName}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="Tên khách hàng *"
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Số điện thoại"
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email *"
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              min="1"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleInputChange}
              placeholder="Số người"
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="datetime-local"
              name="reservationTime"
              value={formData.reservationTime}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Ghi chú"
              className="w-full border rounded px-3 py-2"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Đóng
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
