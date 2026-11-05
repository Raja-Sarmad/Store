"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import StoreShell from "@/components/StoreShell";
import PageHero from "@/components/PageHero";
import { forgotPassword, resetPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendCode() {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const result = await forgotPassword(email);
      setDevOtp(result.devOtp || "");
      setInfo("If an account exists with that email, a 6-digit code has been sent.");
      setStep("reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset code");
    } finally {
      setLoading(false);
    }
  }

  async function onSendCode(e: FormEvent) {
    e.preventDefault();
    await sendCode();
  }

  async function onReset(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      setInfo("Password updated. You can sign in now.");
      window.setTimeout(() => router.push("/login"), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <StoreShell>
      <PageHero
        eyebrow="Account recovery"
        title="Forgot password"
        description="Enter your email, verify the code we send, then choose a new password."
      />
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="sp-container">
          <div className="sp-panel mx-auto max-w-md p-6 sm:p-8">
            {step === "email" ? (
              <form onSubmit={onSendCode} className="space-y-3">
                <p className="text-sm text-[var(--sp-muted)]">
                  We&apos;ll email a 6-digit code so you can set a new password safely.
                </p>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="sp-input"
                  placeholder="Email"
                  type="email"
                  required
                />
                {error ? (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    {error}
                  </p>
                ) : null}
                <button disabled={loading} className="sp-btn h-12 w-full justify-center py-0 disabled:opacity-60">
                  {loading ? "Sending…" : "Send reset code"}
                </button>
              </form>
            ) : (
              <form onSubmit={onReset} className="space-y-3">
                <p className="text-sm text-[var(--sp-muted)]">
                  Code sent to <span className="font-medium text-[var(--sp-ink)]">{email}</span>. Enter it
                  below with your new password.
                </p>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className="sp-input"
                  placeholder="6-digit code"
                  required
                />
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="sp-input"
                  placeholder="New password"
                  type="password"
                  required
                  minLength={8}
                  pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
                  title="Use at least 8 characters, including one capital letter and one number."
                />
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="sp-input"
                  placeholder="Confirm new password"
                  type="password"
                  required
                  minLength={8}
                />
                <p className="-mt-1 text-xs text-[var(--sp-muted)]">
                  Use at least 8 characters, including one capital letter and one number.
                </p>
                {devOtp ? <p className="text-xs text-[var(--sp-muted)]">Dev OTP: {devOtp}</p> : null}
                {info ? <p className="text-xs text-emerald-700">{info}</p> : null}
                {error ? (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    {error}
                  </p>
                ) : null}
                <button
                  disabled={loading || otp.length !== 6}
                  className="sp-btn h-12 w-full justify-center py-0 disabled:opacity-60"
                >
                  {loading ? "Updating…" : "Set new password"}
                </button>
                <button
                  type="button"
                  onClick={() => void sendCode()}
                  disabled={loading}
                  className="sp-btn-outline h-11 w-full justify-center py-0 disabled:opacity-60"
                >
                  Resend code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                    setInfo("");
                    setDevOtp("");
                  }}
                  className="w-full text-center text-xs font-semibold text-[var(--sp-maroon)] underline underline-offset-4"
                >
                  Use a different email
                </button>
              </form>
            )}

            <p className="mt-6 text-sm text-[var(--sp-muted)]">
              Remembered it?{" "}
              <a href="/login" className="font-semibold text-[var(--sp-maroon)] underline underline-offset-4">
                Back to sign in
              </a>
            </p>
          </div>
        </div>
      </section>
    </StoreShell>
  );
}
