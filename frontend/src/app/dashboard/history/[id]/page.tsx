"use client";

import { useEffect, useState } from "react";
import { api, setAuthToken } from "@/lib/api";
import { useParams } from "next/navigation";

export default function ReflectionDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [reflection, setReflection] = useState<any>(null);
  const [coach, setCoach] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      const token = localStorage.getItem("token");
      setAuthToken(token);

      try {
        const [reflectionRes, coachRes] = await Promise.all([
          api.get(`/reflections/${id}`),
          api.get(`/reflection-coach/${id}`),
        ]);

        setReflection(reflectionRes.data.data);
        setCoach(coachRes.data.data);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id]);

  if (loading) {
    return <p className="text-[#8d98a7]">Opening this reflection gently...</p>;
  }

  return (
    <div className="fade-thought max-w-5xl">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#8d98a7]">
        Reflection details
      </p>

      <h1 className="max-w-3xl text-5xl leading-tight text-[#eef3f6]">
        A closer look at what this moment revealed.
      </h1>

      <section className="mt-10 rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-7">
        <p className="mb-5 text-sm text-[#8d98a7]">
          {new Date(reflection.created_at).toLocaleString()}
        </p>

        <p className="text-xl leading-9 text-[#eef3f6]">
          {reflection.reflection_text}
        </p>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-3">
        <InfoCard label="Emotion" value={reflection.emotion_analysis?.emotion ?? "N/A"} />
        <InfoCard label="Sentiment" value={reflection.emotion_analysis?.sentiment ?? "N/A"} />
        <InfoCard
          label="Confidence"
          value={`${reflection.emotion_analysis?.confidence_score ?? 0}%`}
        />
      </section>

      <section className="mt-6 rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-7">
        <p className="text-sm text-[#8d98a7]">Pattern detected</p>

        <h2 className="mt-3 text-3xl capitalize text-[#d8b56d]">
          {reflection.insight?.pattern_detected ?? "N/A"}
        </h2>

        <p className="mt-5 max-w-4xl text-lg leading-8 text-[#a9b4c2]">
          {reflection.insight?.generated_insight}
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-[#d8b56d]/20 bg-[#05070d]/70 p-7">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#8d98a7]">
          Reflection coach
        </p>

        <h2 className="text-3xl text-[#eef3f6]">
          Questions to sit with, not rush through.
        </h2>

        <div className="mt-6 space-y-4">
          {coach?.coach_questions?.map((question: string, index: number) => (
            <div
              key={index}
              className="rounded-2xl border border-[#c8d6df]/10 bg-[#08111f]/60 p-5 text-[#a9b4c2]"
            >
              <span className="mr-3 text-[#d8b56d]">{index + 1}.</span>
              {question}
            </div>
          ))}
        </div>

        {coach?.recommended_action && (
          <div className="mt-8 rounded-3xl border border-[#d8b56d]/20 bg-[#08111f]/70 p-6">
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#8d98a7]">
              Recommended Action
            </p>

            <p className="text-lg leading-8 text-[#eef3f6]">
              {coach.recommended_action}
            </p>
          </div>
        )}

        {coach?.encouragement && (
          <div className="mt-6 rounded-3xl border border-[#d8b56d]/20 bg-[#05070d]/70 p-6">
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#8d98a7]">
              Encouragement
            </p>

            <p className="text-lg leading-8 text-[#d8b56d]">
              {coach.encouragement}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-6">
      <p className="text-sm text-[#8d98a7]">{label}</p>
      <h3 className="mt-3 text-3xl capitalize text-[#eef3f6]">{value}</h3>
    </div>
  );
}