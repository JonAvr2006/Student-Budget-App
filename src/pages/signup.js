import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { signIn } from "next-auth/react"; // make sure this is imported


export default function Signup() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const router = useRouter();


const onSubmit = async (data) => {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  
  if (res.ok) {
    // Automatically log the user in after signup
    const loginResult = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (loginResult.ok) {
      router.push("/dashboard");
    } else {
      setError("Account created, but auto-login failed. Please log in manually.");
    }
  } else {
    const msg = await res.text();
    setError(msg);
  }
};


  return (
    <div className="signInBg">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-white border border-gray-200 rounded-full overflow-hidden">
            <img
              src="/images/logo.png"
              alt="App logo"
              className="h-14 w-14 object-contain"
            />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name field with icon */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primaryGreen">
              <FaUser className="text-gray-400 mr-2 w-5 h-5" />
              <input
                {...register("name")}
                id="name"
                type="text"
                required
                placeholder="Your name"
                className="flex-1 border-none outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              />
            </div>
          </div>

          {/* Email field with icon */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primaryGreen">
              <MdEmail className="text-gray-400 mr-2 w-5 h-5" />
              <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="flex-1 border-none outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              />
            </div>
          </div>

          {/* Password field with icon */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primaryGreen">
              <RiLockPasswordLine className="text-gray-400 mr-2 w-5 h-5" />
              <input
                {...register("password")}
                id="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                className="flex-1 border-none outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" className="signInButton w-full">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <a href="/login" className="text-stone-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
