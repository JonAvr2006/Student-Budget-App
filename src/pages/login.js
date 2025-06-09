import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";

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
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("email")} placeholder="Email" className="border w-full p-2" />
        <input {...register("password")} placeholder="Password" type="password" className="border w-full p-2" />
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Login</button>
      </form>
    </div>
  );
}
