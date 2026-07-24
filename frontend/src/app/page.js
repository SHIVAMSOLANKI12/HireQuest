export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-slate-950 text-slate-100">
      <div className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400">
          <span>🎮 Sprint 1 Setup Complete</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Game-Based Hiring Assessment Platform
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          Next-generation skill evaluations powered by interactive assessments, real-time analytics, and scalable full-stack architecture.
        </p>
      </div>
    </main>
  );
}
