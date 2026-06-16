import Link from "next/link";

const features = [
  "Emotion Detection",
  "Relationship Insight",
  "Reflection Coach",
  "Pattern Recognition",
  "Progress Timeline",
  "PDF Reflection Report",
];

export default function Home() {
  return (
    <main className="breathing-bg min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <Link href="/" className="text-xl tracking-wide text-[#d8b56d]">
          Self Reflection AI
        </Link>

        <div className="flex items-center gap-5 text-sm text-[#8d98a7]">
          <Link href="/login" className="transition hover:text-[#d8b56d]">
            Sign in
          </Link>

          <Link
            href="/register"
            className="rounded-full border border-[#d8b56d]/40 px-5 py-2 text-[#d8b56d] transition hover:bg-[#d8b56d]/10"
          >
            Begin
          </Link>
        </div>
      </nav>

      <section className="mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="fade-thought mb-5 text-sm uppercase tracking-[0.35em] text-[#8d98a7]">
          AI-based self reflection system
        </p>

        <h1 className="fade-thought max-w-5xl text-5xl leading-tight text-[#eef3f6] md:text-7xl">
          Understand your emotions. Recognize your patterns. Grow through
          reflection.
        </h1>

        <p className="fade-thought mt-8 max-w-3xl text-lg leading-8 text-[#a9b4c2]">
          A quiet, intelligent reflection space that uses Natural Language
          Processing to analyze written thoughts, detect emotional patterns, and
          provide relationship insights without judgment.
        </p>

        <div className="fade-thought mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-full bg-[#d8b56d] px-8 py-3 text-sm font-medium text-[#05070d] shadow-[0_0_40px_rgba(216,181,109,0.18)] transition hover:scale-[1.02]"
          >
            Start reflecting
          </Link>

          <Link
            href="#how-it-works"
            className="rounded-full border border-[#c8d6df]/20 px-8 py-3 text-sm text-[#c8d6df] transition hover:border-[#d8b56d]/50 hover:text-[#d8b56d]"
          >
            See how it works
          </Link>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#8d98a7]">
          How it works
        </p>

        <h2 className="max-w-3xl text-4xl leading-tight text-[#eef3f6] md:text-5xl">
          From honest writing to meaningful insight.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Reflect", "Write your thoughts, concerns, or relationship experiences in your own words."],
            ["Analyze", "The NLP engine detects emotions, sentiment, and recurring linguistic signals."],
            ["Understand", "The system generates patterns, insights, and coach questions."],
            ["Grow", "Track your emotional journey through analytics, timelines, and reports."],
          ].map(([title, text]) => (
            <div
              key={title}
              className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/60 p-7 backdrop-blur"
            >
              <h3 className="mb-4 text-2xl text-[#d8b56d]">{title}</h3>
              <p className="leading-7 text-[#a9b4c2]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#8d98a7]">
          Core features
        </p>

        <h2 className="max-w-3xl text-4xl leading-tight text-[#eef3f6] md:text-5xl">
          Built to support inward awareness, not replace human judgment.
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="rounded-3xl border border-[#c8d6df]/10 bg-[#05070d]/60 p-6 text-xl text-[#c8d6df]"
            >
              {feature}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-[2rem] border border-[#d8b56d]/20 bg-[#08111f]/70 p-8 md:p-12">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#8d98a7]">
            Research value
          </p>

          <h2 className="max-w-4xl text-4xl leading-tight text-[#eef3f6] md:text-5xl">
            Designed as an NLP and machine learning system for emotional and
            relationship insight detection.
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-[#a9b4c2]">
            The system combines a trained emotion classification model,
            sentiment analysis, pattern detection, relationship insight
            generation, reflection coaching, emotional trend analytics, and PDF
            reporting into one integrated self-reflection platform.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="text-4xl leading-tight text-[#eef3f6] md:text-5xl">
          Begin with one honest sentence.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#a9b4c2]">
          Your emotional journey becomes clearer when your reflections are
          gently observed over time.
        </p>

        <Link
          href="/register"
          className="mt-10 inline-block rounded-full bg-[#d8b56d] px-9 py-4 text-sm font-medium text-[#05070d]"
        >
          Create your reflection space
        </Link>
      </section>
    </main>
  );
}