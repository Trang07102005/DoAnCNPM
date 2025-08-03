import React, { useState } from "react";

const CustomerInfoModal = ({ onClose, onContinue }) => {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1); // giá trị chọn
  const [customGuests, setCustomGuests] = useState(""); // input custom
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    const finalGuests = guests === 0 ? parseInt(customGuests) : guests;

    if (!name.trim()) {
      alert("Vui lòng nhập tên khách hàng");
      return;
    }
    if (!finalGuests || finalGuests < 1) {
      alert("Số khách phải >= 1");
      return;
    }

    onContinue(name, finalGuests, note);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-gray-800">Tạo Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-xl"
          >
            ×
          </button>
        </div>

        <label className="text-sm font-medium text-gray-600 mb-1 block">
          Tên Khách:
        </label>
        <input
          type="text"
          placeholder="Nhập tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4"
        />

        <label className="text-sm font-medium text-gray-600 mb-1 block">
          Số người:
        </label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => {
                setGuests(n);
                setCustomGuests("");
              }}
              className={`rounded-lg border px-4 py-2 text-sm
                ${guests === n
                  ? "border-red-500 bg-red-100 text-red-600 font-semibold"
                  : "border-gray-200 text-gray-700 hover:border-gray-400"}
              `}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => {
              setGuests(0);
              setCustomGuests("");
            }}
            className={`rounded-lg border px-4 py-2 text-sm col-span-3 text-center
              ${guests === 0
                ? "border-red-500 bg-red-100 text-red-600 font-semibold"
                : "border-gray-200 text-gray-700 hover:border-gray-400"}
            `}
          >
            Custom
          </button>
        </div>

        {guests === 0 && (
          <input
            type="number"
            min="1"
            placeholder="Enter number of guests"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4"
            value={customGuests}
            onChange={(e) => setCustomGuests(e.target.value)}
          />
        )}

        <label className="text-sm font-medium text-gray-600 mb-1 block">
          Ghi Chú
        </label>
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4"
          rows="2"
          placeholder="Ví dụ: Thích ngồi ở trong góc.."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 text-white font-semibold rounded-lg py-3 hover:bg-red-700 transition"
        >
          Order 
        </button>
      </div>
    </div>
  );
};

export default CustomerInfoModal;
