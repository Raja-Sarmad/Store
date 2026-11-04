"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import StoreShell from "@/components/StoreShell";
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
    <StoreShell>
      <PageHero
        eyebrow="Join the community"
        title="Create account"
        description="Set up your account to keep orders and everyday essentials in one place."
      />
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="sp-container">
          <div className="sp-panel mx-auto max-w-md p-6 sm:p-8">
            <form onSubmit={onSubmit} className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="sp-input"
                placeholder="Full name"
                required
                minLength={2}
              />
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setOtpSent(false);
                  setDevOtp("");
                }}
                autoComplete="email"
                className="sp-input"
                placeholder="Email"
                type="email"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="sp-input"
                placeholder="Password"
                type="password"
                required
                minLength={8}
                pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
                title="Use at least 8 characters, including one capital letter and one number."
              />
              <p className="-mt-1 text-xs text-[var(--sp-muted)]">
                Use at least 8 characters, including one capital letter and one number.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className="sp-input min-w-0 flex-1"
                  placeholder="6-digit email code"
                  required
                />
                <button
                  type="button"
                  onClick={requestOtp}
                  disabled={otpLoading || !email.trim()}
                  className="sp-btn-outline h-11 shrink-0 justify-center px-4 py-0 disabled:opacity-50"
                >
                  {otpLoading ? "Sending…" : otpSent ? "Resend" : "Send code"}
                </button>
              </div>
              {otpSent ? (
                <p className="text-xs text-emerald-700">Code sent. Check your inbox and enter it above.</p>
              ) : null}
              {devOtp ? <p className="text-xs text-[var(--sp-muted)]">Dev OTP: {devOtp}</p> : null}
              {error ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {error}
                </p>
              ) : null}
              <button
                disabled={loading || !otpSent || otp.length !== 6}
                className="sp-btn h-12 w-full justify-center py-0 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>
            <p className="mt-5 text-sm text-[var(--sp-muted)]">
              Already a member?{" "}
              <a
                href="/login"
                onClick={(event) => {
                  const next = new URLSearchParams(window.location.search).get("next");
                  if (next) {
                    event.preventDefault();
                    router.push(`/login?next=${encodeURIComponent(next)}`);
                  }
                }}
                className="font-semibold text-[var(--sp-maroon)] underline underline-offset-4"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </section>
    </StoreShell>
  );
}
