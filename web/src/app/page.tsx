import Link from "next/link";
import { Zap, FileText, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/ui/hero-background";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              InvoiceKit
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" >
              <Link className="text-white hover-b" href="/login">Sign in</Link>
            </Button>
            <Button size="sm" >
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center relative overflow-hidden">
        <HeroBackground />
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-xs font-medium text-blue-300 mb-8">
            <Zap className="w-3 h-3" />
            Built for freelancers &amp; small businesses
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-5">
            Professional invoices,{" "}
            <span className="text-blue-400">in under a minute.</span>
          </h1>

          <p className="text-lg text-blue-100/70 max-w-xl mx-auto mb-10">
            Create, preview, and download PDF invoices instantly.
            No accounting complexity — just fast, clean invoices.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button size="lg">
              <Link href="/register">Create your first invoice</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-black hover:bg-white/10 hover:text-white" >
              <Link href="/dashboard">View dashboard</Link>
            </Button>
          </div>

          {/* Feature row */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
            {[
              { icon: FileText, title: "One-page workflow", body: "Create → Preview → Download. No multi-step wizards." },
              { icon: Clock, title: "Reusable clients", body: "Save clients once, autofill every invoice." },
              { icon: Download, title: "Professional PDF", body: "Clean, print-ready PDF output every time." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 text-left">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-500/20 mb-3">
                  <Icon className="w-4 h-4 text-blue-300" />
                </div>
                <div className="text-sm font-semibold text-white mb-1">{title}</div>
                <div className="text-xs text-blue-200/60 leading-relaxed">{body}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0F172A]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-blue-200/50">
          <span>© 2026 InvoiceKit</span>
          <span>Built for freelancers.</span>
        </div>
      </footer>
    </div>
  );
}
