"use client";

import { useState } from "react";
import { api, setAuthToken } from "@/lib/api";

export default function NewReflectionPage() {
  const [reflectionText, setReflectionText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function submitReflection(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const token = localStorage.getItem("token");
    setAuthToken(token);

    try {
      const res = await api.post("/reflections", {
        reflection_text: reflectionText,
      });

      setResult(res.data.data);
      setReflectionText("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-thought max-w-5xl">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#8d98a7]">
        New reflection
      </p>

      <h1 className="max-w-3xl text-5xl leading-tight text-[#eef3f6]">
        Write what you have not been able to say clearly.
      </h1>

      <form onSubmit={submitReflection} className="mt-10">
        <textarea
          required
          minLength={10}
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="Start with: I feel..."
          className="min-h-[260px] w-full rounded-3xl border border-[#c8d6df]/10 bg-[#05070d]/70 p-6 text-lg leading-8 text-[#eef3f6] outline-none placeholder:text-[#667080] focus:border-[#d8b56d]/50"
        />

        <button
          disabled={loading}
          className="mt-6 rounded-full bg-[#d8b56d] px-8 py-3 text-sm text-[#05070d]"
        >
          {loading ? "Listening inward..." : "Analyze reflection"}
        </button>
      </form>

      {result && (
        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-6">
            <p className="text-sm text-[#8d98a7]">Detected emotion</p>
            <h2 className="mt-3 text-4xl capitalize text-[#d8b56d]">
              {result.emotion_analysis.emotion}
            </h2>
            <p className="mt-3 text-[#a9b4c2]">
              Confidence: {result.emotion_analysis.confidence_score}%
            </p>
          </div>

          <div className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-6">
            <p className="text-sm text-[#8d98a7]">Sentiment</p>
            <h2 className="mt-3 text-4xl capitalize text-[#eef3f6]">
              {result.emotion_analysis.sentiment}
            </h2>
          </div>

          <div className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-6 md:col-span-2">
            <p className="text-sm text-[#8d98a7]">Pattern detected</p>
            <h2 className="mt-3 text-3xl capitalize text-[#d8b56d]">
              {result.insight.pattern_detected}
            </h2>
            <p className="mt-5 leading-8 text-[#a9b4c2]">
              {result.insight.generated_insight}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}