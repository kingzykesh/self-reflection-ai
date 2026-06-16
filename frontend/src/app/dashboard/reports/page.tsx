"use client";

import { api, setAuthToken } from "@/lib/api";

export default function ReportsPage() {
  async function downloadReport() {
    const token = localStorage.getItem("token");

    setAuthToken(token);

    try {
      const response = await api.get("/reflection-report", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        "self_reflection_report.pdf"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Unable to generate report.");
    }
  }

  return (
    <div className="fade-thought max-w-5xl">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#8d98a7]">
        Reports
      </p>

      <h1 className="max-w-4xl text-5xl leading-tight text-[#eef3f6]">
        Review your journey in a structured report.
      </h1>

      <p className="mt-6 max-w-3xl text-lg leading-8 text-[#a9b4c2]">
        Generate a downloadable report containing your
        reflections, emotional trends, relationship insights,
        detected patterns, and AI-generated observations.
      </p>

      <div className="mt-10 rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/70 p-8">
        <h2 className="text-2xl text-[#d8b56d]">
          Reflection Report
        </h2>

        <p className="mt-4 leading-8 text-[#a9b4c2]">
          Includes:
        </p>

        <ul className="mt-4 space-y-3 text-[#a9b4c2]">
          <li>• Reflection History</li>
          <li>• Emotion Summary</li>
          <li>• Relationship Insights</li>
          <li>• Pattern Analysis</li>
          <li>• AI Reflection Notes</li>
        </ul>

        <button
          onClick={downloadReport}
          className="mt-8 rounded-full bg-[#d8b56d] px-8 py-3 text-sm font-medium text-[#05070d]"
        >
          Download PDF Report
        </button>
      </div>
    </div>
  );
}