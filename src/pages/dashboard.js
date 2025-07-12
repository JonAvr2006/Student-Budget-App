"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'


export default function Dashboard() {
  const { data: session, status } = useSession()
  const [budget, setBudget] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) fetchBudgetAndExpenses()
  }, [session])

  const fetchBudgetAndExpenses = async () => {
    const res1 = await fetch("/api/budget")
    const res2 = await fetch("/api/expenses")
    const budgetData = await res1.json()
    const expensesData = await res2.json()
    setBudget(budgetData)
    setExpenses(Array.isArray(expensesData) ? expensesData : [])
    setLoading(false)
  }

  if (status === "loading" || loading) return <p className="p-4">Loading...</p>
  if (!session) return <p className="p-4">Access denied. Please login.</p>

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remaining = budget?.amount - totalSpent || 0
  const budgetUsed = budget?.amount ? (totalSpent / budget.amount) * 100 : 0

  const categoryTotals = expenses.reduce((acc, e) => {
    if (e.type !== "income") {
      acc[e.category] = (acc[e.category] || 0) + e.amount
    }
    return acc
  }, {})

  const now = new Date()
const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
const today = now.getDate()

const currentMonthExpenses = expenses.filter((e) => {
  const d = new Date(e.date)
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
})

const categoryMap = {}
const dailyMap = Array.from({ length: daysInMonth }, (_, i) => ({
  day: i + 1,
  spent: 0,
}))

let totalSpentThisMonth = 0

currentMonthExpenses.forEach((e) => {
  const day = new Date(e.date).getDate()
  dailyMap[day - 1].spent += e.amount

  if (e.type !== 'income') {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount
    totalSpentThisMonth += e.amount
  }
})

const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
  name,
  value,
}))

const daysLeft = daysInMonth - today
const allCategories = new Set(expenses.map(e => e.category))
const avgPerDay = today > 0 ? (totalSpent / today).toFixed(2) : 0
const transactionCount = expenses.length
const uniqueCategories = new Set(expenses.map(e => e.category))
const categoryCount = uniqueCategories.size

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6']

  return (
    <div className="signInBg min-h-screen flex items-center justify-center px-4">
  <div className="bg-white rounded-xl shadow-md w-full max-w-5xl p-8 border border-gray-200">
        {/* Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="mx-auto h-12 w-12 flex items-center justify-center bg-white border border-gray-200 rounded-full overflow-hidden mb-4">
              <img
                src="/images/logo.png"
                alt="App logo"
                className="h-14 w-14 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
            <p className="text-gray-600">Track your expenses and manage your budget</p>
          </div>


        {/* Budget Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card title="Monthly Budget" amount={budget?.amount ?? 0} color="gray" />
          <Card title="Total Spent" amount={totalSpent} color="gray" />
          <Card title="Remaining" amount={remaining} color="gray" />
        </div>

        {/* Budget Progress */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Budget Progress</h2>
          <p className="text-gray-600">You've used {budgetUsed.toFixed(1)}% of your monthly budget</p>

          <div className="w-full bg-gray-200 rounded-full h-3 mt-4 mb-2">

          <div
            className="h-3 rounded-full"
            style={{ width: `${budgetUsed}%`, backgroundColor: 'var(--lightGreen)' }}
          />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span className="font-medium">${totalSpent.toLocaleString()} spent</span>
            <span>${(budget?.amount ?? 0).toLocaleString()}</span>
          </div>
        </div>


        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h2>
          {Object.entries(categoryTotals).map(([category, amt]) => {
            const percent = (amt / totalSpent) * 100
            return (
              <div key={category} className="mb-4">
                <div className="flex justify-between text-sm text-gray-900 font-semibold">
                  <span>{category}</span>
                  <span>${amt.toFixed(2)} ({percent.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                    className="h-2 rounded-full"
                    style={{ width: `${percent}%`, backgroundColor: 'var(--lightGreen)' }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Transactions" value={transactionCount} />
          <StatCard label="Categories" value={categoryCount} />
          <StatCard label="Avg/Day" value={`$${avgPerDay}`} green/>
          <StatCard label="Days Left In Month" value={daysLeft} />
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          {[...expenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10)
            .map((e) => (
            <div key={e.id} className="border-b py-3 flex justify-between">
              <div>
                <div className="font-medium font-semibold text-gray-900">{e.category}</div>
                <div className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</div>
                {e.note && <div className="text-sm italic text-green-800">{e.note}</div>}
              </div>
              <div className={`text-right font-semibold ${e.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                {e.type === 'income' ? '+' : '-'}${e.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button onClick={() => signOut({ callbackUrl: "/" })} className="signInButton">
            Sign Out
          </button>
          <div className="flex gap-4">
            <a href="/edit-budget" className="signInButton">Edit Budget</a>
            <a href="/add-expense" className="signInButton">Add Expense</a>
          </div>
        </div>

      </div>
    </div>
  )
}

function Card({ title, amount, color }) {
  const colorMap = {
    red: "text-red-400",
    green: "text-green-400",
    gray: "text-gray-400"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <svg className={`w-4 h-4 ${colorMap[color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
      <div className="text-2xl font-bold text-gray-900">${amount.toLocaleString()}</div>
    </div>
  )
}

function StatCard({ label, value, green }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
      <div
        className="text-2xl font-bold"
        style={green ? { color: 'var(--lightGreen)' } : { color: '#1f2937' }}  
        >
        {value}
      </div>
      <div className="text-sm text-gray-700">{label}</div>
    </div>
  )
}

