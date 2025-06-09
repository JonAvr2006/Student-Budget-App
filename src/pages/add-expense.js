import { useState } from "react";
import { useRouter } from "next/router";

export default function AddExpense() {
  const [form, setForm] = useState({
    category: "",
    amount: "",
    note: "",
    date: new Date().toISOString().slice(0, 10), // today
  });

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: parseFloat(form.amount),
      }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Failed to save expense");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          required
          className="w-full border p-2"
        />
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
          className="w-full border p-2"
        />
        <input
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Note (optional)"
          className="w-full border p-2"
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Save Expense
        </button>
      </form>
    </div>
  );
}
// This code defines a simple "Add Expense" page in a Next.js application.
// It allows users to input details about an expense, including category, amount, note, and date.
// When the form is submitted, it sends a POST request to the `/api/expenses` endpoint to save the expense.
// If the request is successful, it redirects the user back to the dashboard page.
// The form uses controlled components to manage the input state, and it includes basic validation to ensure required fields are filled out.