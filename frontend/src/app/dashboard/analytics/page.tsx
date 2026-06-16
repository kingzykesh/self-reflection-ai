"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, setAuthToken } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const [emotionTrends, setEmotionTrends] = useState<any[]>([]);
  const [patternTrends, setPatternTrends] = useState<any[]>([]);
  const [growth, setGrowth] = useState<any>(null);
  const [relationship, setRelationship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      const token = localStorage.getItem("token");
      setAuthToken(token);

      try {
        const [emotionRes, patternRes, growthRes, relationshipRes] =
          await Promise.all([
            api.get("/emotion-trends"),
            api.get("/pattern-trends"),
            api.get("/emotional-growth"),
            api.get("/relationship-insights"),
          ]);

        setEmotionTrends(emotionRes.data.data);
        setPatternTrends(patternRes.data.data);
        setGrowth(growthRes.data.data);
        setRelationship(relationshipRes.data.data);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return <p className="text-[#8d98a7]">Reading your emotional patterns...</p>;
  }

  const hasAnalytics = emotionTrends.length > 0 || patternTrends.length > 0;

  return (
    <div className="fade-thought max-w-6xl">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#8d98a7]">
        Analytics
      </p>

      <h1 className="max-w-3xl text-5xl leading-tight text-[#eef3f6]">
        Patterns become clearer when they are gently observed.
      </h1>

      {!hasAnalytics ? (
        <div className="mt-10 rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-8">
          <h2 className="text-3xl text-[#d8b56d]">
            Patterns emerge through consistency.
          </h2>

          <p className="mt-4 max-w-2xl leading-8 text-[#a9b4c2]">
            Write a few reflections first. As you continue, this space will
            begin to show your emotional trends, recurring patterns, and
            relationship insights.
          </p>

          <Link
            href="/dashboard/new-reflection"
            className="mt-7 inline-block rounded-full bg-[#d8b56d] px-7 py-3 text-sm text-[#05070d]"
          >
            Write reflection
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ChartCard title="Emotion trends">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={emotionTrends}>
                  <XAxis dataKey="emotion" stroke="#8d98a7" />
                  <YAxis stroke="#8d98a7" />
                  <Tooltip
                    contentStyle={{
                      background: "#08111f",
                      border: "1px solid rgba(200,214,223,0.1)",
                      color: "#eef3f6",
                    }}
                  />
                  <Bar dataKey="total" fill="#d8b56d" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Pattern trends">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={patternTrends}>
                  <XAxis
                    dataKey="pattern_detected"
                    stroke="#8d98a7"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis stroke="#8d98a7" />
                  <Tooltip
                    contentStyle={{
                      background: "#08111f",
                      border: "1px solid rgba(200,214,223,0.1)",
                      color: "#eef3f6",
                    }}
                  />
                  <Bar dataKey="total" fill="#c8d6df" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-6">
              <p className="text-sm text-[#8d98a7]">Period</p>
              <h3 className="mt-3 text-3xl text-[#eef3f6]">
                {growth?.period ?? "N/A"}
              </h3>
            </div>

            <div className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-6">
              <p className="text-sm text-[#8d98a7]">Total reflections</p>
              <h3 className="mt-3 text-3xl text-[#eef3f6]">
                {growth?.total_reflections ?? 0}
              </h3>
            </div>

            <div className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-6">
              <p className="text-sm text-[#8d98a7]">Dominant pattern</p>
              <h3 className="mt-3 text-2xl capitalize text-[#d8b56d]">
                {relationship?.dominant_pattern ?? "N/A"}
              </h3>
            </div>
          </div>

          <section className="mt-6 rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-7">
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#8d98a7]">
              Relationship insight
            </p>

            <p className="max-w-4xl text-xl leading-9 text-[#eef3f6]">
              {relationship?.relationship_insight ??
                "No relationship insight available yet."}
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-6">
      <h2 className="mb-6 text-2xl text-[#d8b56d]">{title}</h2>
      {children}
    </section>
  );
}