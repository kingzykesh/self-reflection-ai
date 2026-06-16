"use client";

import { useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [relationship, setRelationship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const prompts = useMemo(
    () => [
      "What feeling have you been carrying that you have not fully named yet?",
      "What situation has been asking for your honesty recently?",
      "Where did you feel misunderstood, and what did you need in that moment?",
      "What pattern are you beginning to notice in how you respond to people?",
      "What truth would feel freeing to admit gently today?",
    ],
    []
  );

  const todayPrompt = prompts[new Date().getDay() % prompts.length];

  useEffect(() => {
    async function fetchDashboard() {
      const token = localStorage.getItem("token");
      setAuthToken(token);

      try {
        const [summaryRes, relationshipRes] = await Promise.all([
          api.get("/dashboard-summary"),
          api.get("/relationship-insights"),
        ]);

        setSummary(summaryRes.data.data);
        setRelationship(relationshipRes.data.data);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="text-[#8d98a7]">Settling into your dashboard...</p>;
  }

  return (
    <div className="fade-thought max-w-6xl">
      <section className="rounded-[2rem] border border-[#c8d6df]/10 bg-[#08111f]/70 p-8 md:p-10">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#8d98a7]">
          Welcome back
        </p>

        <h1 className="max-w-4xl text-5xl leading-tight text-[#eef3f6] md:text-6xl">
          The patterns you notice today can become the choices you change
          tomorrow.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#a9b4c2]">
          This is your quiet overview — a place to observe your reflections,
          emotions, and recurring relationship signals without rushing them.
        </p>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-4">
        <Card
          label="Reflections written"
          value={summary?.total_reflections ?? 0}
        />
        <Card
          label="Most common emotion"
          value={summary?.dominant_emotion ?? "N/A"}
        />
        <Card
          label="Most common pattern"
          value={summary?.common_pattern ?? "N/A"}
        />
        <Card
          label="Reflection streak"
          value={`${summary?.streak ?? 0} days`}
        />
      </section>

      {summary?.streak >= 7 && (
        <div className="mt-5 rounded-3xl border border-[#d8b56d]/20 bg-[#05070d]/70 p-5 text-[#d8b56d]">
          You&apos;ve reflected consistently for {summary.streak} days. Small
          honest moments can create meaningful change.
        </div>
      )}

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#d8b56d]/20 bg-[#05070d]/70 p-7">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#8d98a7]">
            Today&apos;s reflection prompt
          </p>

          <h2 className="text-3xl leading-tight text-[#d8b56d]">
            {todayPrompt}
          </h2>

          <Link
            href="/dashboard/new-reflection"
            className="mt-8 inline-block rounded-full bg-[#d8b56d] px-7 py-3 text-sm text-[#05070d]"
          >
            Reflect now
          </Link>
        </div>

        <div className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-7">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#8d98a7]">
            Latest relationship insight
          </p>

          <p className="text-xl leading-9 text-[#eef3f6]">
            {relationship?.relationship_insight ??
              "Write a few reflections to begin seeing deeper relationship patterns."}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-7">
        <h2 className="mb-4 text-2xl text-[#d8b56d]">Latest reflection</h2>

        {summary?.latest_reflection ? (
          <>
            <p className="max-w-4xl text-lg leading-8 text-[#a9b4c2]">
              {summary.latest_reflection.reflection_text}
            </p>

            <Link
              href={`/dashboard/history/${summary.latest_reflection.id}`}
              className="mt-6 inline-block rounded-full border border-[#d8b56d]/30 px-6 py-3 text-sm text-[#d8b56d]"
            >
              View reflection
            </Link>
          </>
        ) : (
          <p className="text-[#8d98a7]">
            No reflection yet. Begin with one honest sentence.
          </p>
        )}
      </section>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-6">
      <p className="text-sm text-[#8d98a7]">{label}</p>
      <h3 className="mt-4 text-3xl capitalize text-[#eef3f6]">{value}</h3>
    </div>
  );
}