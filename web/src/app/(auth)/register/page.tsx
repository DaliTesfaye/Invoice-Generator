"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Loader2, Mail, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/errors";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-zinc-100 selection:bg-blue-500/30">

      {/* Panneau Gauche - Identité & Avantages */}
      <div className="relative hidden w-1/2 lg:flex flex-col justify-between p-12 overflow-hidden bg-zinc-950 border-r border-white/5">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/20">
            <Zap className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight">InvoiceKit</span>
        </div>

        <div className="relative z-10 max-w-lg mt-auto">
          <div className="space-y-6">
            <h2 className="text-2xl font-medium leading-snug text-zinc-200">
              Start creating professional invoices in minutes.
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Unlimited client invoice management</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Instant PDF export and tracking</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Built specifically for freelancers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panneau Droit - Formulaire */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 xl:p-24">
        <div className="w-full max-w-[440px] space-y-8">

          <div className="flex flex-col space-y-3">
            <Link href="/" className="lg:hidden flex items-center gap-2 mb-4 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 shadow-md">
                <Zap className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-bold tracking-tight">InvoiceKit</span>
            </Link>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Create an account
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              Get started with your free account today.
            </p>
          </div>

          {success ? (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-sm">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Account created!</h3>
                <p className="text-sm text-zinc-400">
                  Your account is ready. You can now sign in to access your dashboard.
                </p>
              </div>
              <Button
                className="w-full h-12 text-base font-medium rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 transition-all shadow-lg shadow-white/5"
                onClick={() => router.push("/login")}
              >
                Go to Sign in
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-zinc-300">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-zinc-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 6 characters"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 rounded-xl bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-300">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat your password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-12 rounded-xl bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 transition-all shadow-lg shadow-white/5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          )}

          {!success && (
            <div className="text-center pt-2">
              <p className="text-sm text-zinc-400">
                Already have an account?{" "}
                <Link href="/login" className="text-white hover:text-blue-400 font-medium transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-blue-400/50">
                  Sign in
                </Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}