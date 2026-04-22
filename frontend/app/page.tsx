import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <section className="flex w-full max-w-sm flex-col gap-4 text-center">
          <h1 className="text-3xl font-semibold">Welcome to OITOON</h1>
          <p className="text-sm text-gray-400">Share and discover amazing stories</p>
        </section>
      </main>
    </div>
  );
}
