import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/dashboard"); // Redirect if logged in
      }
    };
    checkSession();
  }, []);

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Budget Buddy 💸</h1>
      <p className="mb-6">Please log in or sign up to manage your finances.</p>

      <div className="flex justify-center gap-4">
        <a
          href="/api/auth/signin"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </a>
        <a
          href="/signup"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}
