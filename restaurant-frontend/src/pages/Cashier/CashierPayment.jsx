import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CashierPayment = () => {
  const [step, setStep] = useState(1);
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [splitCount, setSplitCount] = useState(1);
  const [cashReceived, setCashReceived] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const token = localStorage.getItem("token");
  const cashierId = parseInt(localStorage.getItem("userId"));

  // Tính toán subtotal và tax
  const subtotal = orderDetails.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;

  // Cập nhật totalAmount khi subtotal thay đổi
  useEffect(() => {
    setTotalAmount(subtotal + tax);
  }, [subtotal]);

  useEffect(() => {
    fetchPendingOrders();
    fetchPaymentMethods();
  }, []);
    useEffect(() => {
    if (step !== 2 || selectedOrders.length === 0) return;

    const fetchDetails = async () => {
        let details = [];
        for (const id of selectedOrders) {
        try {
            const res = await axios.get(`http://localhost:8080/api/cashier/order-details/by-order/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
            });
            details = [...details, ...res.data];
        } catch (err) {
            toast.error("Lỗi chi tiết đơn: " + id);
        }
        }
        setOrderDetails(details);
    };

    fetchDetails();
    }, [step, selectedOrders]);

  const fetchPendingOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/cashier/pending-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      toast.error("Lỗi tải danh sách đơn: " + (err.response?.data || err.message));
    }
  };

  const updateQuantity = async (orderDetailId, newQuantity) => {
    try {
      await axios.put(`http://localhost:8080/api/order-details/${orderDetailId}/quantity`, null, {
        params: { quantity: newQuantity },
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Cập nhật số lượng thành công");
      fetchOrderDetails();
    } catch (err) {
      toast.error("Lỗi cập nhật số lượng: " + (err.response?.data?.message || JSON.stringify(err.response?.data) || err.message));
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/cashier/payment-methods", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPaymentMethods(res.data);
    } catch (err) {
      toast.error("Lỗi tải phương thức thanh toán: " + (err.response?.data || err.message));
    }
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]);
  };

  const fetchOrderDetails = async () => {
    let details = [];
    for (const id of selectedOrders) {
      try {
        const res = await axios.get(`http://localhost:8080/api/cashier/order-details/by-order/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        details = [...details, ...res.data];
      } catch (err) {
        toast.error("Lỗi chi tiết đơn: " + id);
      }
    }
    setOrderDetails(details);
    setStep(2);
  };

  const amountPerPerson = totalAmount / splitCount;

  const goToFinalPaymentStep = () => {
    if (!paymentMethod || selectedOrders.length === 0) {
      toast.error("Vui lòng chọn đơn hàng và phương thức!");
      return;
    }
    setStep(3);
  };

  const handlePay = async () => {
    const methodName = paymentMethods.find(
      (m) => m.paymentMethodID === parseInt(paymentMethod)
    )?.methodName;
  
    // ❗ Dùng tổng tính từ UI, không lấy lại từ API
    const finalAmount = totalAmount;
  
    if (methodName === "Tiền mặt" && cashReceived < finalAmount) {
      toast.error("Số tiền khách đưa không đủ để thanh toán!");
      return;
    }
  
    try {
      const res = await axios.post(
        "http://localhost:8080/api/cashier/pay-orders",
        {
          orderIds: selectedOrders,
          methodId: paymentMethod,
          cashierId: cashierId,
          note: `Chia ${splitCount} người`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      toast.success(res.data.message || "Thanh toán thành công!");
  
      fetchPendingOrders();
      setSelectedOrders([]);
      setOrderDetails([]);
      setPaymentMethod("");
      setCashReceived(0);
      setSplitCount(1);
      setStep(1);
    } catch (err) {
      toast.error(
        "Lỗi khi thanh toán: " + (err.response?.data?.message || err.message)
      );
    }
  };
  
  

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Thanh toán hóa đơn</h2>

      {step === 1 && (
        <>
          <table className="table-auto w-full border mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Chọn</th>
                <th className="p-2 border">Mã đơn</th>
                <th className="p-2 border">Bàn</th>
                <th className="p-2 border">Thời gian</th>
                <th className="p-2 border">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.orderId}>
                  <td className="p-2 border text-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.orderId)}
                      onChange={() => toggleOrderSelection(order.orderId)}
                    />
                  </td>
                  <td className="p-2 border text-center">{order.orderId}</td>
                  <td className="p-2 border text-center">{order.tableName || order.restaurantTable?.tableName}</td>
                  <td className="p-2 border text-center">{new Date(order.orderTime).toLocaleString()}</td>
                  <td className="p-2 border text-center">{order.total.toLocaleString()} ₫</td>
                </tr>
              ))}
            </tbody>
          </table>
            <button
            onClick={() => {
                if (selectedOrders.length === 0) {
                toast.error("Vui lòng chọn đơn hàng!");
                return;
                }
                setStep(2); // ✅ chỉ setStep, việc fetch sẽ chạy tự động ở Bước 2
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            >
            Tiếp theo
            </button>
        </> 
      )}

      {step === 2 && (
        <>
          <h3 className="text-lg font-semibold mb-2">Chi tiết món trong đơn</h3>
          <table className="table-auto w-full border mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Tên món</th>
                <th className="p-2 border">Số lượng</th>
                <th className="p-2 border">Đơn giá</th>
                <th className="p-2 border">Tạm tính</th>
                <th className="p-2 border">Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{item.foodName}</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) => {
                        const newDetails = [...orderDetails];
                        newDetails[idx].quantity = parseInt(e.target.value) || 1;
                        setOrderDetails(newDetails);
                      }}
                      className="border p-1 w-16 text-center"
                    />
                  </td>
                  <td className="p-2 border text-right">{item.price.toLocaleString()} ₫</td>
                  <td className="p-2 border text-right">{(item.price * item.quantity).toLocaleString()} ₫</td>
                  <td className="p-2 border text-center">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() => item.orderDetailId != null ? updateQuantity(item.orderDetailId, item.quantity) : toast.error("Không thể cập nhật: thiếu ID món ăn!")}
                    >
                      Lưu
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mb-4">
            <label>Phương thức thanh toán: </label>
            <select
              className="border p-2 ml-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">--Chọn--</option>
              {paymentMethods.map(method => (
                <option key={method.paymentMethodID} value={method.paymentMethodID}>
                  {method.methodName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label>Chia hóa đơn cho bao nhiêu người: </label>
            <input
              type="number"
              min={1}
              value={splitCount}
              onChange={(e) => setSplitCount(parseInt(e.target.value) || 1)}
              className="border p-2 w-24 ml-2"
            />
          </div>

          <div className="text-right font-semibold text-lg mt-4">
            Tổng tiền: {totalAmount.toLocaleString()} ₫<br />
            Mỗi người trả: {amountPerPerson.toLocaleString()} ₫
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="bg-gray-400 text-white px-4 py-2 rounded">Quay lại</button>
            <button onClick={goToFinalPaymentStep} className="bg-green-600 text-white px-4 py-2 rounded">Xác nhận thanh toán</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h3 className="text-xl font-bold mb-4">Xác nhận thanh toán</h3>
          {paymentMethods.find(m => m.paymentMethodID === parseInt(paymentMethod))?.methodName === "Tiền mặt" && (
            <div className="mb-4">
              <label>Tiền khách đưa: </label>
              <input
                type="number"
                min={0}
                value={cashReceived}
                onChange={(e) => setCashReceived(parseInt(e.target.value) || 0)}
                className="border p-2 ml-2 w-32"
              />
              <div className="mt-2 text-green-700 font-semibold">
                {cashReceived > 0 &&    
                  `Tiền thối lại: ${(cashReceived - totalAmount).toLocaleString()} ₫`}
              </div>
            </div>
          )}

          {paymentMethods.find(m => m.paymentMethodID === parseInt(paymentMethod))?.methodName === "Chuyển khoản" && (
            <div className="mb-4">
              <p className="text-blue-600">Vui lòng quét mã QR bên dưới để thanh toán:</p>
              <img src="/images/qr-code-momo.png" alt="QR chuyển khoản" className="w-48 h-48 mt-2" />
              <p className="text-sm text-gray-600 mt-2">Ghi chú: "Thanh toán đơn tại quầy"</p>
            </div>
          )}

          <div className="text-right font-semibold text-lg mt-4">
            Tạm tính: {subtotal.toLocaleString()} ₫<br />
            Thuế (5%): {tax.toLocaleString()} ₫<br />
            Tổng tiền: {totalAmount.toLocaleString()} ₫<br />
            Mỗi người trả: {amountPerPerson.toLocaleString()} ₫
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="bg-gray-400 text-white px-4 py-2 rounded">Quay lại</button>
            <button onClick={handlePay} className="bg-green-600 text-white px-4 py-2 rounded">Hoàn tất thanh toán</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CashierPayment;