"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function EditBudget() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const now = new Date();
const monthName = now.toLocaleString('default', { month: 'long' });
const year = now.getFullYear();
const displayMonth = `${monthName} ${year}`;
const currentMonth = now.toISOString().slice(0, 7); // still used for backend API


  useEffect(() => {
    const fetchBudget = async () => {
      const res = await fetch("/api/budget");
      const data = await res.json();
      if (data && data.amount) setAmount(data.amount);
      setLoading(false);
    };
    fetchBudget();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month: currentMonth,
        amount: parseFloat(amount),
      }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Failed to save budget");
    }
  };

  if (status === "loading" || loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="signInBg min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow border border-gray-200">

        {/* Logo at top */}
        <div className="mx-auto h-12 w-12 flex items-center justify-center bg-white border border-gray-200 rounded-full overflow-hidden">
          <img
            src="/images/logo.png"
            alt="App logo"
            className="h-14 w-14 object-contain"
          />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-gray-900 text-center">Edit Budget for {displayMonth}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter budget amount"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="signInButton w-full"
          >
            Save Budget
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full mt-2 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-2 rounded-md transition"
          >
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
}
