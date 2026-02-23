import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold">Form Builder Starter</h1>
      <p className="mt-2 text-slate-600">
        Next.js + Zustand + DnD Kit — no backend, local save/export/preview.
      </p>

      <div className="mt-6">
        <Link
          href="/builder"
          className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
        >
          Open Builder →
        </Link>
      </div>
    </main>
  );
}