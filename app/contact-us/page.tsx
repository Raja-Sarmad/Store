import StoreShell from "@/components/StoreShell";
import PageHero from "@/components/PageHero";

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
