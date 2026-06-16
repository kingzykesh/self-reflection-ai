"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="breathing-bg flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-8 backdrop-blur"
      >
        <h1 className="mb-2 text-4xl text-[#eef3f6]">Welcome back.</h1>
        <p className="mb-8 text-[#8d98a7]">
          Return gently to your reflections.
        </p>

        {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

        <input
          type="email"
          placeholder="email"
          className="mb-4 w-full rounded-2xl border border-[#c8d6df]/10 bg-[#05070d]/70 px-4 py-3 text-[#eef3f6] outline-none placeholder:text-[#667080] focus:border-[#d8b56d]/50"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="password"
          className="mb-4 w-full rounded-2xl border border-[#c8d6df]/10 bg-[#05070d]/70 px-4 py-3 text-[#eef3f6] outline-none placeholder:text-[#667080] focus:border-[#d8b56d]/50"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={loading}
          className="mt-2 w-full rounded-full bg-[#d8b56d] px-6 py-3 text-[#05070d]"
        >
          {loading ? "Entering..." : "Sign in"}
        </button>

        <p className="mt-6 text-center text-sm text-[#8d98a7]">
          New here?{" "}
          <Link href="/register" className="text-[#d8b56d]">
            Create account
          </Link>
        </p>
      </form>
    </main>
  );
}