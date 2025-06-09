import { useState, useEffect } from "react";              // React hooks for state and lifecycle
import { useRouter } from "next/router";                  // Used to redirect after saving
import { useSession } from "next-auth/react";             // Used to get the logged-in user session

export default function EditBudget() {
  const { data: session, status } = useSession();         // useSession() provides info about the logged-in user
  const router = useRouter();                             // useRouter() allows navigation (e.g., redirect after submit)
  const [amount, setAmount] = useState("");               // Holds the budget amount in state
  const [loading, setLoading] = useState(true);           // Show a loading screen until data is fetched

  // Get current month in "YYYY-MM" format (e.g., "2025-06")
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Load the current month's budget when component mounts
  useEffect(() => {
    const fetchBudget = async () => {
      const res = await fetch("/api/budget");             // Call your backend API to get budget
      const data = await res.json();
      if (data && data.amount) setAmount(data.amount);    // If budget exists, pre-fill the input
      setLoading(false);                                  // Done loading
    };
    fetchBudget();
  }, []);

  // Submit the form to update or create the budget
  const handleSubmit = async (e) => {
    e.preventDefault();                                   // Prevent default form submission
    const res = await fetch("/api/budget", {
      method: "POST",                                     // POST method to upsert budget
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month: currentMonth,
        amount: parseFloat(amount),                       // Ensure it's saved as a number
      }),
    });

    if (res.ok) {
      router.push("/dashboard");                          // Redirect back to dashboard if successful
    } else {
      alert("Failed to save budget");                     // Show error message if request failed
    }
  };

  // Handle loading state while waiting for session or data
  if (status === "loading" || loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Edit Budget for {currentMonth}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}     // Update state as user types
          className="border p-2 w-full"
          placeholder="Enter budget amount"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Budget
        </button>
      </form>
    </div>
  );
}
