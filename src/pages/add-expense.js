"use client"

import { useState } from "react"
import { useRouter } from "next/router"

export default function AddExpense() {
  const router = useRouter()

  const [form, setForm] = useState({
    category: "",
    customCategory: "",
    amount: "",
    note: "",
    date: new Date().toISOString().slice(0, 10),
  })

  const categories = [
    "Food",
    "Groceries",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Health",
    "Income",
    "Other",
  ]

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const categoryToUse =
      form.category === "Other" ? form.customCategory.trim() : form.category

    if (!categoryToUse) {
      alert("Please enter a category.")
      return
    }

    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: categoryToUse,
        amount: parseFloat(form.amount),
        note: form.note,
        date: form.date,
        createdAt: new Date().toISOString(),
        type: categoryToUse.toLowerCase() === "income" ? "income" : "expense",
      }),
    })

    if (res.ok) {
      router.push("/dashboard")
    } else {
      alert("Failed to save expense.")
    }
  }

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

        <h2 className="mt-6 text-2xl font-bold text-gray-900 text-center">Add Expense</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Category dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-2 py-2 text-gray-900"
            >
              <option value="" disabled>
                -- Select Category --
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Custom category if "Other" */}
          {form.category === "Other" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Category</label>
              <input
                type="text"
                name="customCategory"
                value={form.customCategory}
                onChange={handleChange}
                placeholder="Enter your category"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
              />
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Optional description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Expense</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="signInButton w-full"
          >
            Save Expense
          </button>

          {/* Go back */}
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
  )
}
