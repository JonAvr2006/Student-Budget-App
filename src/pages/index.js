import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, []);

  return (
    <div className="signInBg">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow text-center border border-gray-200">
        {/* Logo / Icon area */}
        <div className="mx-auto h-12 w-12 flex items-center justify-center bg-white border border-gray-200 rounded-full overflow-hidden">
          <img
            src="/images/logo.png"
            alt="App logo"
            className="h-14 w-14 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">Welcome to Budget Buddy</h1>
        <p className="text-gray-700">Please sign in or sign up to manage your finances.</p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <a href="/api/auth/signin" className="signInButton">
            Sign In
          </a>
          <a href="/signup" className="signInButton">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
