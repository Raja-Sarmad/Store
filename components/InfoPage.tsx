import StoreShell from "@/components/StoreShell";
import PageHero from "@/components/PageHero";
import { WHATSAPP_DISPLAY, whatsappHref } from "@/lib/whatsapp";

export type InfoSection = { title: string; text: string; bullets?: string[] };

export default function InfoPage({
  eyebrow,
  title,
  description,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: InfoSection[];
}) {
  return (
    <StoreShell>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="sp-container">
          <div className="sp-panel mx-auto max-w-4xl divide-y divide-[#ead9cb]/90 overflow-hidden p-0">
            {sections.map((section, index) => (
              <article key={section.title} className="grid gap-3 px-5 py-6 sm:grid-cols-[64px_1fr] sm:gap-8 sm:px-8 sm:py-8">
                <span className="font-serif text-sm tracking-widest text-[var(--sp-gold)]">
                  0{index + 1}
                </span>
                <div>
                  <h2 className="font-serif text-xl font-medium text-[var(--sp-maroon-deep)] sm:text-2xl">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--sp-muted)]">{section.text}</p>
                  {section.bullets ? (
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--sp-muted)]">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-4xl text-xs leading-5 text-[var(--sp-muted)]">
            Need a hand?{" "}
            <a href="/contact-us" className="font-semibold text-[var(--sp-maroon)] underline underline-offset-4">
              Contact our team
            </a>{" "}
            or message us on WhatsApp at{" "}
            <a
              href={whatsappHref("Hi, I need help with a Sab Pehno order.")}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[var(--sp-maroon)] underline underline-offset-4"
            >
              {WHATSAPP_DISPLAY}
            </a>
            .
          </p>
        </div>
      </section>
    </StoreShell>
  );
}
