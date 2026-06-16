"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, setAuthToken } from "@/lib/api";

export default function HistoryPage() {
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const token = localStorage.getItem("token");
      setAuthToken(token);

      try {
        const res = await api.get("/reflections");
        setReflections(res.data.data);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (loading) {
    return <p className="text-[#8d98a7]">Gathering your reflections...</p>;
  }

  return (
    <div className="fade-thought max-w-5xl">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#8d98a7]">
        Reflection history
      </p>

      <h1 className="max-w-3xl text-5xl leading-tight text-[#eef3f6]">
        A record of the thoughts you chose to face.
      </h1>

      <div className="mt-10 space-y-5">
        {reflections.length === 0 ? (
          <div className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-7 text-[#8d98a7]">
            No reflection yet.
          </div>
        ) : (
          reflections.map((item) => (
            <Link
              href={`/dashboard/history/${item.id}`}
              key={item.id}
              className="block rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-7 transition hover:border-[#d8b56d]/40"
            >
              <div className="mb-4 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-[#d8b56d]/30 px-4 py-1 capitalize text-[#d8b56d]">
                  {item.emotion_analysis?.emotion ?? "N/A"}
                </span>

                <span className="rounded-full border border-[#c8d6df]/10 px-4 py-1 capitalize text-[#a9b4c2]">
                  {item.emotion_analysis?.sentiment ?? "N/A"}
                </span>

                <span className="rounded-full border border-[#c8d6df]/10 px-4 py-1 capitalize text-[#a9b4c2]">
                  {item.insight?.pattern_detected ?? "N/A"}
                </span>
              </div>

              <p className="leading-8 text-[#eef3f6]">
                {item.reflection_text}
              </p>

              <p className="mt-5 leading-7 text-[#a9b4c2]">
                {item.insight?.generated_insight}
              </p>

              <p className="mt-5 text-xs text-[#667080]">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}