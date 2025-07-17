import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [note, setNote] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      alert("Không thể tải đơn hàng");
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/payment-methods");
      setPaymentMethods(res.data);
    } catch (err) {
      alert("Không thể tải phương thức thanh toán");
    }
  };

  useEffect(() => {
    fetchOrder();
    fetchPaymentMethods();
  }, [orderId]);

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("Chọn phương thức thanh toán");
      return;
    }

    const cashierId = parseInt(localStorage.getItem("userId"));
    const data = {
      orderId: parseInt(orderId),
      paymentMethodId: selectedMethod,
      paidAmount: order.total,
      cashierId,
      note
    };

    try {
      await axios.post("http://localhost:8080/api/payments", data);
      alert("Thanh toán thành công");
      navigate("/orders");
    } catch (err) {
      alert("Thanh toán thất bại");
    }
  };

  if (!order) return <div>Đang tải...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Chi tiết đơn hàng #{order.orderId}</h2>
      <p><strong>Bàn:</strong> {order.restaurantTable?.tableName}</p>
      <p><strong>Trạng thái:</strong> {order.status}</p>

      <div className="mt-4">
        <h3 className="font-semibold">Danh sách món ăn:</h3>
        <ul className="list-disc ml-5">
          {order.orderDetails.map(item => (
            <li key={item.orderDetailId}>
              {item.food.foodName} x {item.quantity} = {(item.price * item.quantity).toLocaleString()} VND
            </li>
          ))}
        </ul>
        <p className="mt-2 font-bold">Tổng tiền: {order.total.toLocaleString()} VND</p>
      </div>

      {order.status !== "Đã thanh toán" && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Thanh toán</h3>
          <label>Phương thức:</label>
          <select
            className="w-full border rounded p-2"
            value={selectedMethod || ""}
            onChange={e => setSelectedMethod(parseInt(e.target.value))}
          >
            <option value="">-- Chọn phương thức --</option>
            {paymentMethods.map(method => (
              <option key={method.paymentMethodID} value={method.paymentMethodID}>
                {method.methodName}
              </option>
            ))}
          </select>

          <label className="mt-2 block">Ghi chú:</label>
          <textarea
            className="w-full border rounded p-2"
            rows="2"
            value={note}
            onChange={e => setNote(e.target.value)}
          />

          <button
            onClick={handlePayment}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Xác nhận thanh toán
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
