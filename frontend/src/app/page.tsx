import Link from "next/link";

export default function Home() {
  return (
    <main className="breathing-bg min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <Link href="/" className="text-xl tracking-wide text-[#d8b56d]">
          Self Reflection AI
        </Link>

        <div className="flex items-center gap-5 text-sm text-[#8d98a7]">
          <Link href="/login" className="hover:text-[#d8b56d] transition">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-[#d8b56d]/40 px-5 py-2 text-[#d8b56d] hover:bg-[#d8b56d]/10 transition"
          >
            Begin
          </Link>
        </div>
      </nav>

      <section className="mx-auto flex min-h-[78vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="fade-thought mb-5 text-sm uppercase tracking-[0.35em] text-[#8d98a7]">
          A quiet space for honest reflection
        </p>

        <h1 className="fade-thought max-w-4xl text-5xl leading-tight text-[#eef3f6] md:text-7xl">
          Understand what your words are trying to tell you.
        </h1>

        <p className="fade-thought mt-8 max-w-2xl text-lg leading-8 text-[#a9b4c2]">
          An AI-based self-reflection and relationship insight system that helps
          you identify emotions, recurring patterns, and deeper relational
          signals from your own written reflections.
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
        className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3"
      >
        {[
          {
            title: "Write honestly",
            text: "Enter a reflection, complaint, relationship concern, or emotional experience in your own words.",
          },
          {
            title: "Detect patterns",
            text: "The system identifies emotion, sentiment, recurring relationship patterns, and hidden emotional triggers.",
          },
          {
            title: "Receive insight",
            text: "Get calm, non-diagnostic insights and reflection questions that support better self-awareness.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-[#c8d6df]/10 bg-[#08111f]/60 p-7 backdrop-blur"
          >
            <h3 className="mb-4 text-2xl text-[#d8b56d]">{item.title}</h3>
            <p className="leading-7 text-[#a9b4c2]">{item.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}