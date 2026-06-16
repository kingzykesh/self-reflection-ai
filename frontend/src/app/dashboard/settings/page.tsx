"use client";

import { useEffect, useState } from "react";
import { api, setAuthToken } from "@/lib/api";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      setAuthToken(token);

      try {
        const res = await api.get("/me");
        setUser(res.data.user);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return <p className="text-[#8d98a7]">Opening your settings...</p>;
  }

  return (
    <div className="fade-thought max-w-5xl">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#8d98a7]">
        Settings
      </p>

      <h1 className="max-w-3xl text-5xl leading-tight text-[#eef3f6]">
        Your reflection space, kept simple.
      </h1>

      <section className="mt-10 rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-8">
        <h2 className="text-2xl text-[#d8b56d]">Profile</h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm text-[#8d98a7]">Name</p>
            <div className="rounded-2xl border border-[#c8d6df]/10 bg-[#05070d]/70 px-5 py-4 text-[#eef3f6]">
              {user?.name}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-[#8d98a7]">Email</p>
            <div className="rounded-2xl border border-[#c8d6df]/10 bg-[#05070d]/70 px-5 py-4 text-[#eef3f6]">
              {user?.email}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-[#d8b56d]/20 bg-[#05070d]/70 p-8">
        <h2 className="text-2xl text-[#d8b56d]">Important note</h2>

        <p className="mt-5 max-w-3xl leading-8 text-[#a9b4c2]">
          This system supports self-reflection and relationship awareness. It is
          not a medical diagnosis, therapy replacement, or clinical assessment.
        </p>
      </section>
    </div>
  );
}