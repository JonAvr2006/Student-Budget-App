import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";


export default function Dashboard() {
  const { data: session, status } = useSession();
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (session) {
      fetchBudgetAndExpenses();
    }
  }, [session]);

  const fetchBudgetAndExpenses = async () => {
    const res1 = await fetch("/api/budget");
    const res2 = await fetch("/api/expenses");
    const budgetData = await res1.json();
    const expensesData = await res2.json();
    setExpenses(Array.isArray(expensesData) ? expensesData : []);
    setBudget(budgetData);
    setLoading(false);
  };

  if (status === "loading" || loading) return <p className="p-4">Loading...</p>;
  if (!session) return <p className="p-4">Access denied. Please login.</p>;

  const totalSpent = Array.isArray(expenses)
  ? expenses.reduce((sum, e) => sum + e.amount, 0)
  : 0;

  const remaining = budget?.amount - totalSpent;

  return (
    
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 mb-6">
        <div className="p-4 border rounded">
          <p className="text-lg">Monthly Budget: <strong>${budget?.amount ?? 0}</strong></p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-lg">Total Spent: <strong>${totalSpent.toFixed(2)}</strong></p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-lg">Remaining: <strong>${remaining?.toFixed(2)}</strong></p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/edit-budget">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Edit Budget</button>
        </Link>
        <Link href="/add-expense">
          <button className="bg-green-600 text-white px-4 py-2 rounded">Add Expense</button>
        </Link>
      </div>

      {!loading && expenses.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Recent Expenses</h2>
          <ul className="space-y-2">
            {[...expenses].reverse().slice(0, 10).map((e) => (
              <li key={e.id} className="border p-2 rounded">
                <div className="flex justify-between">
                  <span>{e.category}</span>
                  <span>${e.amount.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</div>
                {e.note && <div className="text-sm italic">{e.note}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
      >
        Sign Out
      </button>

    </div>
  );
}
