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
            console.log(err);
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
          console.log(err);
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
      const selectedMethod = paymentMethods.find(
        (m) => m.paymentMethodID === parseInt(paymentMethod)
      );
    
      if (!selectedMethod) {
        toast.error("Vui lòng chọn phương thức thanh toán hợp lệ.");
        return;
      }
    
      if (selectedMethod.methodName === "Tiền mặt" && cashReceived < totalAmount) {
        toast.error("Số tiền khách đưa không đủ để thanh toán!");
        return;
      }
    
      try {
        const response = await axios.post(
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
    
        toast.success(response.data.message || "Thanh toán thành công!");
        setStep(4);
      } catch (error) {
        console.error(error);
        toast.error("Lỗi khi thanh toán: " + (error.response?.data?.message || error.message));
      }
    };
    
    

    
    
    

    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Thanh toán hóa đơn</h2>

        {step === 1 && (
          <>
          <table className="table-auto w-full rounded-lg overflow-hidden shadow-lg">
    <thead>
      <tr className="bg-gradient-to-r from-sky-400 to-green-400 text-white font-semibold">
        <th className="p-3 border border-green-200">Chọn</th>
        <th className="p-3 border border-green-200">Mã đơn</th>
        <th className="p-3 border border-green-200">Bàn</th>
        <th className="p-3 border border-green-200">Thời gian</th>
        <th className="p-3 border border-green-200">Tổng tiền</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order, idx) => (
        <tr
          key={order.orderId}
          className={`${idx % 2 === 0 ? "bg-green-50" : "bg-white"} hover:bg-green-100 transition-colors cursor-pointer`}
        >
          <td className="p-3 border border-green-200 text-center">
            <input
              type="checkbox"
              checked={selectedOrders.includes(order.orderId)}
              onChange={() => toggleOrderSelection(order.orderId)}
              className="w-5 h-5 cursor-pointer accent-green-500"
            />
          </td>
          <td className="p-3 border border-green-200 text-center">{order.orderId}</td>
          <td className="p-3 border border-green-200 text-center">{order.tableName || order.restaurantTable?.tableName}</td>
          <td className="p-3 border border-green-200 text-center">{new Date(order.orderTime).toLocaleString()}</td>
          <td className="p-3 border border-green-200 text-green-600 font-bold text-center">{order.total.toLocaleString()} ₫</td>
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
    className="bg-blue-600 hover:bg-blue-700 mt-10 focus:outline-none focus:ring-4 focus:ring-blue-300 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-200 ease-in-out"
  >
    Tiếp theo
  </button>

          </> 
        )}

        {step === 2 && (
          <>
            <h3 className="text-lg font-semibold mb-2">Chi tiết món trong đơn</h3>
            <table className="table-auto w-full rounded-lg overflow-hidden shadow-lg mb-4">
    <thead>
      <tr className="bg-gradient-to-r from-sky-400 to-green-400 text-white font-semibold">
        <th className="p-3 border border-green-200">Tên món</th>
        <th className="p-3 border border-green-200">Số lượng</th>
        <th className="p-3 border border-green-200">Đơn giá</th>
        <th className="p-3 border border-green-200">Tạm tính</th>
        <th className="p-3 border border-green-200">Cập nhật</th>
      </tr>
    </thead>
    <tbody>
      {orderDetails.map((item, idx) => (
        <tr
          key={idx}
          className={`${idx % 2 === 0 ? "bg-green-50" : "bg-white"} hover:bg-green-100 transition-colors`}
        >
          <td className="p-3 border border-green-200">{item.foodName}</td>
          <td className="p-3 border border-green-200 text-center">
            <input
              type="number"
              value={item.quantity}
              min={1}
              onChange={(e) => {
                const newDetails = [...orderDetails];
                newDetails[idx].quantity = parseInt(e.target.value) || 1;
                setOrderDetails(newDetails);
              }}
              className="border border-green-300 rounded px-2 w-16 text-center"
            />
          </td>
          <td className="p-3 border border-green-200 text-right">{item.price.toLocaleString()} ₫</td>
          <td className="p-3 border border-green-200 text-right">{(item.price * item.quantity).toLocaleString()} ₫</td>
          <td className="p-3 border border-green-200 text-center">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-3 py-1 rounded shadow transition duration-300"
              onClick={() =>
                item.orderDetailId != null
                  ? updateQuantity(item.orderDetailId, item.quantity)
                  : toast.error("Không thể cập nhật: thiếu ID món ăn!")
              }
            >
              Lưu
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
            <div className="mb-4 flex items-center gap-3">
    <label className="font-semibold text-gray-700 whitespace-nowrap">Phương thức thanh toán:</label>
    <select
      className="border border-green-400 bg-white text-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 shadow-sm"
      value={paymentMethod}
      onChange={(e) => setPaymentMethod(e.target.value)}
    >
      <option value="" disabled>--Chọn--</option>
      {paymentMethods.map(method => (
        <option key={method.paymentMethodID} value={method.paymentMethodID}>
          {method.methodName}
        </option>
      ))}
    </select>
  </div>


  <div className="mb-6 flex items-center gap-3">
    <label className="font-semibold text-gray-700 whitespace-nowrap">
      Chia hóa đơn cho bao nhiêu người:
    </label>
    <input
      type="number"
      min={1}
      value={splitCount}
      onChange={(e) => setSplitCount(parseInt(e.target.value) || 1)}
      className="border border-green-400 rounded-md px-3 py-2 w-24 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 shadow-sm"
    />
  </div>

  <div className="text-right font-semibold text-lg text-gray-800 mt-6 mb-6 space-y-1">
    <p>Tổng tiền: <span className="text-green-600">{totalAmount.toLocaleString()} ₫</span></p>
    <p>Mỗi người trả: <span className="text-green-600">{amountPerPerson.toLocaleString()} ₫</span></p>
  </div>

  <div className="flex gap-4 justify-end">
    <button
      onClick={() => setStep(1)}
      className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-md transition duration-200"
    >
      Quay lại
    </button>
    <button
      onClick={goToFinalPaymentStep}
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition duration-200"
    >
      Xác nhận thanh toán
    </button>
  </div>

          </>
        )}

        {step === 3 && (
          <>

          <div className="mb-8 p-6 rounded-lg shadow-lg bg-gradient-to-br from-sky-100 via-green-50 to-green-200">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Xác nhận thanh toán</h3>
    {paymentMethods.find(m => m.paymentMethodID === parseInt(paymentMethod))?.methodName === "Tiền mặt" && (
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">Tiền khách đưa:</label>
        <input
          type="number"
          min={0}
          value={cashReceived}
          onChange={(e) => setCashReceived(parseInt(e.target.value) || 0)}
          className="border border-green-400 rounded-md px-3 py-2 w-36 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 shadow-sm"
        />
        {cashReceived > 0 && (
          <p className="mt-3 text-green-700 font-semibold">
            Tiền thối lại: {(cashReceived - totalAmount).toLocaleString()} ₫
          </p>
        )}
      </div>
    )}

    {paymentMethods.find(m => m.paymentMethodID === parseInt(paymentMethod))?.methodName === "Chuyển khoản" && (
      <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-300">
        <p className="text-blue-700 font-medium mb-3">
          Vui lòng quét mã QR bên dưới để thanh toán:
        </p>
        <img src="/images/qr-code-momo.png" alt="QR chuyển khoản" className="w-48 h-48 mx-auto mb-3 rounded-md shadow-sm" />
        <p className="text-sm text-gray-500 italic text-center">
          Ghi chú: "Thanh toán đơn tại quầy"
        </p>
      </div>
    )}

    <div className="text-right font-semibold text-lg mt-6 space-y-1 text-gray-800">
      <p>Tạm tính: {subtotal.toLocaleString()} ₫</p>
      <p>Thuế (5%): {tax.toLocaleString()} ₫</p>
      <p className="text-xl font-bold text-green-700">Tổng tiền: {totalAmount.toLocaleString()} ₫</p>
      <p className="text-lg text-gray-700">Mỗi người trả: {amountPerPerson.toLocaleString()} ₫</p>
    </div>

    <div className="flex gap-3 mt-6">
      <button
        onClick={() => setStep(2)}
        className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-md transition"
      >
        Quay lại
      </button>
      <button
        onClick={handlePay}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition"
      >
        Hoàn tất thanh toán
      </button>
    </div>
  </div>

  

          </>
          
        )}

        {step === 4 && (
  <div className="text-center p-10 bg-green-50 rounded-lg shadow-lg max-w-xl mx-auto mt-10">
    <h2 className="text-3xl font-bold text-green-700 mb-4">🎉 Thanh toán thành công!</h2>
    <p className="text-lg text-gray-700 mb-6">
      Cảm ơn bạn đã sử dụng dịch vụ. Bạn có thể in hóa đơn hoặc quay lại danh sách đơn hàng.
    </p>

    <div className="flex justify-center gap-4">
      {/* In hóa đơn */}
      <button
        onClick={async () => {
          try {
            const res = await axios.get("http://localhost:8080/api/cashier/invoice", {
  params: { orderIds: selectedOrders },
  paramsSerializer: (params) => {
    return params.orderIds.map(id => `orderIds=${id}`).join("&");
  },
  responseType: "blob",
  headers: { Authorization: `Bearer ${token}` },
});


            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "hoa_don.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
          } catch (err) {
            console.error(err);
            toast.error("Lỗi khi in hóa đơn");
          }
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-md transition"
      >
        In hóa đơn
      </button>

      {/* Quay lại */}
      <button
        onClick={() => {
          fetchPendingOrders();
          setSelectedOrders([]);
          setOrderDetails([]);
          setPaymentMethod("");
          setCashReceived(0);
          setSplitCount(1);
          setStep(1);
        }}
        className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-md shadow-md transition"
      >
        Quay lại
      </button>
    </div>
  </div>
)}


      </div>
      
      
    );
  };

  export default CashierPayment;