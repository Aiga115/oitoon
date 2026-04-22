import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">Welcome</h1>
        <Link href="/login" className="rounded border px-4 py-2 text-center">
          Login
        </Link>
        <Link href="/register" className="rounded border px-4 py-2 text-center">
          Register
        </Link>
      </section>
    </main>
  );
}
