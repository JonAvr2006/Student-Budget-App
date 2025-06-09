import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
    setBudget(budgetData);
    setExpenses(expensesData);
    setLoading(false);
  };

  if (status === "loading" || loading) return <p className="p-4">Loading...</p>;
  if (!session) return <p className="p-4">Access denied. Please login.</p>;

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
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
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Edit Budget</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Add Expense</button>
      </div>
    </div>
  );
}
