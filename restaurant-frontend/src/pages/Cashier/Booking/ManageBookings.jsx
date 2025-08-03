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

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTables();
    fetchReservations();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tables", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(res.data);
    } catch {
      toast.error("Không thể tải danh sách bàn.");
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/reservations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(res.data);
    } catch {
      toast.error("Không thể tải danh sách đặt bàn.");
    }
  };

  // ✅ Cho phép click tất cả bàn (không chặn theo status)
  const handleTableClick = (table) => {
    setSelectedTable(table);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { customerName, phone, email, numberOfPeople, note, reservationTime } = formData;

    if (!customerName || !email || !reservationTime || !selectedTable) {
      toast.warn("Vui lòng nhập đầy đủ thông tin và chọn bàn.");
      return;
    }

    const reservationTimeDate = new Date(reservationTime);
    const start = new Date(reservationTimeDate.getTime() - 90 * 60 * 1000); // -1.5h
    const end = new Date(reservationTimeDate.getTime() + 90 * 60 * 1000); // +1.5h

    const overlappingReservation = reservations.find(r =>
      r.restaurantTable?.tableId === selectedTable.tableId &&
      new Date(r.reservationTime) >= start &&
      new Date(r.reservationTime) <= end &&
      r.reservationId !== (formData.id || null)
    );

    if (overlappingReservation) {
      toast.error("Bàn đã được đặt trong khoảng thời gian này hoặc quá gần thời gian khác.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/reservations",
        {
          customerName: customerName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          numberOfPeople: parseInt(numberOfPeople),
          note: note.trim(),
          reservationTime,
          restaurantTable: { tableId: selectedTable.tableId },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Đặt bàn thành công!");
      setShowForm(false);
      setSelectedTable(null);
      setFormData({
        customerName: "",
        phone: "",
        email: "",
        numberOfPeople: 1,
        note: "",
        reservationTime: ""
      });
      fetchReservations();
      await fetchTables();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Bàn đã được đặt trong thời gian này.");
      } else {
        toast.error("Đặt bàn thất bại.");
      }
    }
  };

  const handleCancel = async (id) => {
    const reservation = reservations.find(r => r.reservationId === id);
    if (!reservation || ["Khách đã đến", "Hoàn thành"].includes(reservation.status)) {
      toast.warning("Không thể hủy đặt bàn khi trạng thái là 'Khách đã đến' hoặc 'Hoàn thành'.");
      return;
    }
    if (!window.confirm("Bạn có chắc muốn huỷ đặt bàn này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Huỷ đặt bàn thành công!");
      fetchReservations();
      fetchTables();
    } catch {
      toast.error("Huỷ đặt bàn thất bại.");
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Quản lý đặt bàn</h2>

      {/* Danh sách bàn */}
      <div>
        <h3 className="text-lg font-bold text-red-600 mb-4 uppercase">Danh sách bàn</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {tables.map((table) => (
            <div
              key={table.tableId}
              onClick={() => handleTableClick(table)} // ✅ sửa: luôn cho click
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center text-white font-semibold text-sm shadow-md transition-all duration-300 select-none ${
                table.status === "Trống"
                  ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                  : table.status === "Đã đặt"
                  ? "bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
                  : "bg-red-500 hover:bg-red-600 cursor-pointer"
              } ${selectedTable?.tableId === table.tableId ? "ring-4 ring-red-400" : ""}`}
            >
              <div className="text-base">{table.tableName}</div>
              <div className="text-xs">{table.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Danh sách đặt bàn */}
      <div>
        <h3 className="font-semibold text-lg text-gray-700 mb-3">Danh sách đặt bàn</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-md">
            <thead className="bg-gradient-to-r from-sky-400 to-green-400 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Khách hàng</th>
                <th className="px-4 py-3 text-left">Bàn</th>
                <th className="px-4 py-3 text-left">Thời gian</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.reservationId} className="even:bg-gray-50 hover:bg-rose-100">
                  <td className="px-4 py-2">{r.customerName}</td>
                  <td className="px-4 py-2">{r.restaurantTable?.tableName}</td>
                  <td className="px-4 py-2">{new Date(r.reservationTime).toLocaleString()}</td>
                  <td className="px-4 py-2">{r.status}</td>
                  <td className="px-4 py-2 text-center">
                    {["Khách đã đến", "Hoàn thành"].includes(r.status) ? (
                      <button
                        disabled
                        className="bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed"
                      >
                        Huỷ
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCancel(r.reservationId)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Huỷ
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form đặt bàn */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-5 relative border-t-4 border-red-600">
            <h3 className="text-2xl font-bold text-red-600 mb-3">
              Đặt bàn: {selectedTable?.tableName}
            </h3>

            <input
              type="text"
              name="customerName"
              placeholder="Tên khách hàng *"
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <div>
              <label className="block mb-2 font-semibold text-gray-700">Số người:</label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`px-3 py-2 rounded-lg border font-medium transition
                      ${
                        formData.numberOfPeople == num
                          ? "bg-red-100 border-red-500 text-red-600"
                          : "bg-white border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-600"
                      }`}
                    onClick={() => setFormData({ ...formData, numberOfPeople: num })}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  className={`px-3 py-2 rounded-lg border font-medium transition
                    ${
                      formData.numberOfPeople > 5 || formData.numberOfPeople === ""
                        ? "bg-red-100 border-red-500 text-red-600"
                        : "bg-white border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-600"
                    }`}
                  onClick={() => setFormData({ ...formData, numberOfPeople: "" })}
                >
                  Khác
                </button>
              </div>
              {formData.numberOfPeople === "" && (
                <input
                  type="number"
                  name="numberOfPeople"
                  min="1"
                  placeholder="Nhập số người"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  className="mt-3 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              )}
            </div>

            <input
              type="datetime-local"
              name="reservationTime"
              value={formData.reservationTime}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <textarea
              name="note"
              placeholder="Ghi chú"
              rows={3}
              value={formData.note}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Huỷ
              </button>
              <button
                onClick={handleSubmit}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
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
