
import React, { useState, useRef } from "react";
import { mockSubmit } from "./mockApi";

const MAX_RETRIES = 3;

export default function App() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("idle");
  const [records, setRecords] = useState([]);

  const isSubmitting = useRef(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting.current) return;

    const id = Date.now();
    isSubmitting.current = true;
    setStatus("pending");

    const payload = { id, email, amount };
    attemptSubmit(payload, 0);
  };

  const attemptSubmit = async (payload, retryCount) => {
    try {
      const response = await mockSubmit(payload);

      if (response.status === 200) {
        setRecords((prev) => {
          const exists = prev.some((r) => r.id === payload.id);
          if (exists) return prev;
          return [...prev, payload];
        });

        setStatus("success");
        isSubmitting.current = false;
      }
    } catch (err) {
      if (err.status === 503 && retryCount < MAX_RETRIES) {
        setStatus(`retrying (${retryCount + 1})`);
        setTimeout(() => {
          attemptSubmit(payload, retryCount + 1);
        }, 2000 * (retryCount + 1));
      } else {
        setStatus("failed");
        isSubmitting.current = false;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Eventually Consistent Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />

          <input
            type="number"
            placeholder="Amount"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />

          <button
            type="submit"
            disabled={isSubmitting.current}
            className="w-full py-2.5 rounded-lg font-medium bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isSubmitting.current ? "Processing..." : "Submit"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Status: <span className="font-medium">{status}</span>
        </p>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Submitted Records</h3>
          <ul className="space-y-2">
            {records.map((r) => (
              <li key={r.id} className="bg-gray-50 border rounded-lg px-4 py-2 flex justify-between text-sm">
                <span>{r.email}</span>
                <span className="font-medium">₹{r.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
