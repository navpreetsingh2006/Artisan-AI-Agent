import Image from "next/image";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center gap-12 py-12 px-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-10 transition-all hover:shadow-primary/5">
        <div className="flex flex-col items-center gap-10 text-center w-full">
          <Image
            className="dark:invert motion-safe:animate-pulse"
            src="/next.svg"
            alt="Next.js logo"
            width={140}
            height={28}
            priority
          />

          <div className="space-y-6 max-w-2xl px-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
              Crafting Digital <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Excellence</span>.
            </h1>
            <p className="text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
              Experience the power of <span className="text-zinc-900 dark:text-zinc-100 font-bold decoration-primary/30 decoration-4 underline-offset-4 underline">Artisan AI</span>.
              Our premium interface, built with shadcn/ui, is ready for your next big idea.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 pt-4 w-full justify-center">
            <a
              className="group flex h-14 items-center justify-center gap-3 rounded-2xl bg-zinc-900 px-8 text-lg font-bold text-white transition-all hover:bg-zinc-800 hover:shadow-xl hover:scale-[1.02] active:scale-98 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              Start Building
            </a>
            <a
              className="flex h-14 items-center justify-center rounded-2xl border-2 border-zinc-200 px-8 text-lg font-bold text-zinc-900 transition-all hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900/50"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Docs
            </a>
          </div>
        </div>
      </main>

      {/* Floating Chatbot Widget */}
      <Chatbot />
    </div>
  );
}
