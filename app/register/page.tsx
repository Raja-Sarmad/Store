"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { register, sendEmailOtp } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password, otp);
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next?.startsWith("/") && !next.startsWith("//") ? next : "/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function requestOtp() {
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    setError("");
    setOtpLoading(true);
    try {
      const result = await sendEmailOtp(email);
      setDevOtp(result.devOtp || "");
      setOtpSent(result.sent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP");
    } finally {
      setOtpLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <PageHero eyebrow="Join the community" title="Create account" description="Set up your account to keep orders and everyday essentials in one place." />
      <section className="px-6 py-16 sm:px-12 sm:py-20">
        <div className="mx-auto max-w-md border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-white" placeholder="Full name" required minLength={2} />
            <input value={email} onChange={(e) => { setEmail(e.target.value); setOtpSent(false); setDevOtp(""); }} autoComplete="email" className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-white" placeholder="Email" type="email" required />
            <input value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-white" placeholder="Password" type="password" required minLength={8} pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}" title="Use at least 8 characters, including one capital letter and one number." />
            <p className="-mt-2 text-xs text-zinc-500">Use at least 8 characters, including one capital letter and one number.</p>
            <div className="flex gap-2">
              <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} className="min-w-0 flex-1 bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-white" placeholder="6-digit email code" required />
              <button type="button" onClick={requestOtp} disabled={otpLoading || !email.trim()} className="border border-zinc-700 px-4 text-xs font-black uppercase tracking-widest hover:border-white disabled:opacity-50">
                {otpLoading ? "Sending…" : otpSent ? "Resend code" : "Send code"}
              </button>
            </div>
            {otpSent && <p className="text-xs text-emerald-400">Code sent. Check your inbox and enter it above.</p>}
            {devOtp && <p className="text-xs text-zinc-400">Dev OTP: {devOtp}</p>}
            {error && <p className="border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}
            <button disabled={loading || !otpSent || otp.length !== 6} className="w-full bg-white px-8 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-zinc-200 disabled:opacity-60">
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
          <p className="mt-5 text-sm text-zinc-400">Already a member? <a href="/login" onClick={(event) => { const next = new URLSearchParams(window.location.search).get("next"); if (next) { event.preventDefault(); router.push(`/login?next=${encodeURIComponent(next)}`); } }} className="font-bold text-white underline underline-offset-4">Sign in</a></p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
