"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, setAuthToken } from "@/lib/api";

export default function TimelinePage() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      const token = localStorage.getItem("token");
      setAuthToken(token);

      try {
        const res = await api.get("/reflection-timeline");
        setTimeline(res.data.data);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeline();
  }, []);

  if (loading) {
    return <p className="text-[#8d98a7]">Arranging your reflections in time...</p>;
  }

  return (
    <div className="fade-thought max-w-5xl">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#8d98a7]">
        Reflection timeline
      </p>

      <h1 className="max-w-3xl text-5xl leading-tight text-[#eef3f6]">
        See how your emotions have moved over time.
      </h1>

      <div className="mt-10">
        {timeline.length === 0 ? (
          <div className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-8">
            <h2 className="text-2xl text-[#d8b56d]">
              Your story begins with one honest sentence.
            </h2>
            <p className="mt-4 text-[#a9b4c2]">
              Write a reflection first, and your emotional timeline will begin to form here.
            </p>

            <Link
              href="/dashboard/new-reflection"
              className="mt-6 inline-block rounded-full bg-[#d8b56d] px-6 py-3 text-sm text-[#05070d]"
            >
              Write reflection
            </Link>
          </div>
        ) : (
          <div className="relative ml-4 border-l border-[#d8b56d]/20 pl-8">
            {timeline.map((item, index) => (
              <Link
                href={`/dashboard/history/${item.reflection_id}`}
                key={`${item.reflection_id}-${index}`}
                className="group relative mb-8 block rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-6 transition hover:border-[#d8b56d]/40"
              >
                <span className="absolute -left-[43px] top-7 h-5 w-5 rounded-full border border-[#d8b56d]/40 bg-[#05070d] shadow-[0_0_25px_rgba(216,181,109,0.25)] group-hover:bg-[#d8b56d]" />

                <p className="text-sm text-[#8d98a7]">{item.date}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full border border-[#d8b56d]/30 px-4 py-1 capitalize text-[#d8b56d]">
                    {item.emotion}
                  </span>

                  <span className="rounded-full border border-[#c8d6df]/10 px-4 py-1 capitalize text-[#a9b4c2]">
                    {item.sentiment}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl capitalize text-[#eef3f6]">
                  {item.pattern}
                </h2>

                <p className="mt-3 text-sm text-[#8d98a7]">
                  Click to open full reflection and coach questions.
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}