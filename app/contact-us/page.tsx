import StoreShell from "@/components/StoreShell";
import PageHero from "@/components/PageHero";
import { WHATSAPP_DISPLAY, whatsappHref } from "@/lib/whatsapp";

export default function ContactUsPage() {
  return (
    <StoreShell>
      <PageHero
        eyebrow="Customer care"
        title="Contact us"
        description="Questions about orders, sizing, or the next drop? Our team is here to help."
      />
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="sp-container">
          <div className="mx-auto mb-6 max-w-3xl rounded-[1.25rem] border border-[#ead9cb] bg-[#fff8f0]/80 px-5 py-5 sm:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sp-muted)]">
              WhatsApp
            </p>
            <p className="mt-2 text-sm text-[var(--sp-muted)]">
              Message us anytime — we reply on WhatsApp.
            </p>
            <a
              href={whatsappHref("Hi, I need help with a Sab Pehno order.")}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#1ebe57]"
            >
              Chat on WhatsApp · {WHATSAPP_DISPLAY}
            </a>
          </div>
          <form className="sp-panel mx-auto max-w-3xl space-y-3 p-6 sm:p-8">
            <input className="sp-input" placeholder="Name" />
            <input className="sp-input" placeholder="Email" type="email" />
            <textarea
              className="min-h-36 w-full rounded-[1.25rem] border border-[#e6d8cc] bg-[#fbf6f0] px-4 py-3 text-sm outline-none focus:border-[var(--sp-gold)] focus:bg-white"
              placeholder="Message"
            />
            <button type="button" className="sp-btn">
              Send
            </button>
          </form>
        </div>
      </section>
    </StoreShell>
  );
}
