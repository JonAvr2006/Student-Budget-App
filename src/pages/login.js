import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdEmail } from "react-icons/md";


export default function Login() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid login");
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
              <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign in to your account</h2>
            </div>
    
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-gray-500"
                />
              </div>
    
              {error && <p className="text-red-600 text-sm">{error}</p>}
    
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-500">
                  <input type="checkbox" className="mr-2 rounded border-gray-300" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-stone-500 hover:underline">
                  Forgot password?
                </a>
              </div>
    
              <button type="submit" className="signInButton w-full">
                Sign in
              </button>
            </form>
            
    
            <p className="text-center text-sm text-gray-500 mt-6">
              Not a member? <a href="/signup" className="text-stone-600 hover:underline">Start here</a>
            </p>
          </div>
        </div>
      );
    }
