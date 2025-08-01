import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManagerInvoiceManagement = () => {
  const token = localStorage.getItem("token");

  // Hóa đơn
  const [invoices, setInvoices] = useState([]);

  // Bộ lọc đơn hàng

  const [date, setDate] = useState("");
  const [orderID, setOrderID] = useState("");

  // Danh sách đơn hàng (đã lọc theo filter)
  const [orders, setOrders] = useState([]);

  // Dữ liệu phụ cho modal
  const [methods, setMethods] = useState([]);
  const [cashiers, setCashiers] = useState([]);

  // Modal thêm/sửa hóa đơn
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  // Form hóa đơn
  const [formData, setFormData] = useState({
    orderID: "",
    paymentMethodID: "",
    paidAmount: "",
    note: "",
    status: "DRAFT",
    cashierID: "",
  });

  // Chi tiết đơn hàng khi xem
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Load dữ liệu phụ ban đầu: payment methods, cashiers
  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        const [methodsRes, cashiersRes] = await Promise.all([
          axios.get("/api/manager/payment-methods", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/manager/users?role=staff", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setMethods(
          Array.isArray(methodsRes.data) ? methodsRes.data : methodsRes.data.data
        );
        setCashiers(cashiersRes.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu phụ:", err);
      }
    };
    fetchSupportData();
  }, [token]);

  // Load hóa đơn
  const fetchInvoices = async () => {
    try {
      const res = await axios.get("/api/manager/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy hóa đơn:", err);
    }
  };

  // Load hóa đơn lần đầu
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Hàm gọi API lọc đơn hàng theo bộ lọc (status, date, tableId)
  const fetchFilteredInvoices = async () => {
    try {
      const params = {};
      if (date) params.date = date;
  
      console.log("Gửi filter: date =", date);
      const response = await axios.get("http://localhost:8080/api/manager/invoices/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
  
      setInvoices(response.data);
  
      if (response.data.length === 0) {
        toast.info("Không tìm thấy hóa đơn phù hợp.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API lọc hóa đơn:", error);
      toast.error("Lỗi khi tìm kiếm hóa đơn");
      setInvoices([]);
    }
  };
  
  
  
  const handleSearch = () => {
    fetchFilteredInvoices();
  };
  

  // Mở modal thêm hóa đơn
  const openAddModal = () => {
    setEditingInvoice(null);
    setFormData({
      orderID: "",
      paymentMethodID: "",
      paidAmount: "",
      note: "",
      status: "DRAFT",
      cashierID: "",
    });
    setShowModal(true);
  };

  // Mở modal sửa hóa đơn
  const openEditModal = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      orderID: invoice.order?.orderID || "",
      paymentMethodID: invoice.paymentMethod?.paymentMethodID || "",
      paidAmount: invoice.paidAmount,
      note: invoice.note || "",
      status: invoice.status,
      cashierID: invoice.cashier?.userID || "",
    });
    setShowModal(true);
  };

  // Thay đổi form
  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Lưu hóa đơn (thêm hoặc cập nhật)
  const handleFormSubmit = async () => {
    try {
      if (editingInvoice) {
        await axios.put(
          `/api/manager/invoices/${editingInvoice.invoiceID}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Cập nhật hóa đơn thành công");
      } else {
        await axios.post("/api/manager/invoices", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm hóa đơn thành công");
      }
      setShowModal(false);
      fetchInvoices();
    } catch (err) {
      console.error("Lỗi khi lưu hóa đơn:", err);
      toast.error("Lỗi khi lưu hóa đơn");
    }
  };

  // Xóa hóa đơn
  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xóa hóa đơn?")) {
      try {
        await axios.delete(`/api/manager/invoices/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Xóa hóa đơn thành công");
        fetchInvoices();
      } catch (err) {
        console.error("Lỗi khi xóa hóa đơn:", err);
        toast.error("Lỗi khi xóa hóa đơn");
      }
    }
  };

  // Xem chi tiết đơn hàng (order details)
  const handleViewDetails = async (orderId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/order-details/by-order/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedOrderDetails(res.data);
      setShowDetailModal(true);
    } catch (error) {
      toast.error("Không thể tải chi tiết hóa đơn");
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white via-blue-100 to-green-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center drop-shadow-sm">
        🧾 Quản lý hóa đơn thanh toán
      </h2>

      <div className="flex justify-end mb-6">
        <button
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
          onClick={openAddModal}
        >
          + Thêm hóa đơn
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-300"
        />

  

        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
        >
          TÌM
        </button>
    </div>



      {/* Bảng hóa đơn */}
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
            <tr>
              <th className="p-3">Mã</th>
              <th className="p-3">Đơn hàng</th>
              <th className="p-3">Phương thức</th>
              <th className="p-3">Số tiền</th>
              <th className="p-3">Ngày</th>
              <th className="p-3">Thu ngân</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.invoiceID} className="hover:bg-blue-50 transition">
                  <td className="p-3">{invoice.invoiceID}</td>
                  <td className="p-3">#{invoice.orderId}</td>
                  <td className="p-3">{invoice.paymentMethodName}</td>
                  <td className="p-3 text-green-700 font-bold">
                    {Number(invoice.paidAmount).toLocaleString()} ₫
                  </td>
                  <td className="p-3">{invoice.paidAt ? new Date(invoice.paidAt).toLocaleString() : "-"}</td>

                  <td className="p-3">{invoice.cashierUsername}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        invoice.status === "FINALIZED"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "DRAFT"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow-sm"
                      onClick={() => openEditModal(invoice)}
                    >
                      ✏️
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow-sm"
                      onClick={() => handleDelete(invoice.invoiceID)}
                    >
                      🗑️
                    </button>
                    <button
                      onClick={() => handleViewDetails(invoice.orderId)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md shadow-sm"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-3 text-center text-gray-500">
                  Không có hóa đơn nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa hóa đơn */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl border-[5px] border-green-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {editingInvoice ? "📝 Cập nhật hóa đơn" : "➕ Thêm hóa đơn"}
            </h3>

            {/* Đơn hàng */}
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Đơn hàng
            </label>
            <select
              name="orderID"
              value={formData.orderID}
              onChange={handleFormChange}
              className="w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2 rounded-lg mb-4"
            >
              <option value="">-- Chọn đơn hàng --</option>
              {orders.map((o) => (
                <option key={o.orderID} value={o.orderID}>
                  #{o.orderID}
                </option>
              ))}
            </select>

            {/* Phương thức thanh toán */}
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Phương thức thanh toán
            </label>
            <select
              name="paymentMethodID"
              value={formData.paymentMethodID}
              onChange={handleFormChange}
              className="w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2 rounded-lg mb-4"
            >
              <option value="">-- Phương thức thanh toán --</option>
              {methods.map((m) => (
                <option key={m.paymentMethodID} value={m.paymentMethodID}>
                  {m.methodName}
                </option>
              ))}
            </select>

            {/* Số tiền thanh toán */}
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Số tiền thanh toán
            </label>
            <input
              type="number"
              name="paidAmount"
              placeholder="Nhập số tiền..."
              value={formData.paidAmount}
              onChange={handleFormChange}
              className="w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2 rounded-lg mb-4"
            />

            {/* Thu ngân */}
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Thu ngân
            </label>
            <select
              name="cashierID"
              value={formData.cashierID}
              onChange={handleFormChange}
              className="w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2 rounded-lg mb-4"
            >
              <option value="">-- Chọn thu ngân --</option>
              {cashiers.map((c) => (
                <option key={c.userID} value={c.userID}>
                  {c.fullName}
                </option>
              ))}
            </select>

            {/* Ghi chú */}
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Ghi chú
            </label>
            <textarea
              name="note"
              placeholder="Ghi chú..."
              value={formData.note}
              onChange={handleFormChange}
              className="w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2 rounded-lg mb-4"
            />

            {/* Trạng thái */}
            
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className="w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2 rounded-lg mb-6"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="FINALIZED">FINALIZED</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition duration-200"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button
                className="bg-green-300 hover:bg-blue-700 hover:text-white text-black font-semibold px-4 py-2 rounded-lg transition duration-200"
                onClick={handleFormSubmit}
              >
                {editingInvoice ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      {showDetailModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full shadow-xl border-[5px] border-green-300">
            <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
              Chi tiết hóa đơn
            </h2>
            <table className="w-full border border-collapse">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="border px-3 py-2">Tên món</th>
                  <th className="border px-3 py-2">Số lượng</th>
                  <th className="border px-3 py-2">Đơn giá</th>
                  <th className="border px-3 py-2">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrderDetails.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="border px-3 py-2 text-gray-800">{item.foodName}</td>
                    <td className="border px-3 py-2 text-center text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="border px-3 py-2 text-right text-gray-700">
                      {item.price?.toLocaleString()} ₫
                    </td>
                    <td className="border px-3 py-2 text-right font-medium text-green-700">
                      {(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()} ₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerInvoiceManagement;
