import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

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
      router.push("/login");
    } else {
      const msg = await res.text();
      setError(msg);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("name")} placeholder="Name" className="border w-full p-2" />
        <input {...register("email")} placeholder="Email" type="email" className="border w-full p-2" />
        <input {...register("password")} placeholder="Password" type="password" className="border w-full p-2" />
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Create Account</button>
      </form>
    </div>
  );
}
