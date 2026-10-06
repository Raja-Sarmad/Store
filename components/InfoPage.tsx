import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export type InfoSection = { title: string; text: string; bullets?: string[] };

export default function InfoPage({ eyebrow, title, description, sections }: {
  eyebrow: string;
  title: string;
  description: string;
  sections: InfoSection[];
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <section className="bg-white px-6 py-14 text-black sm:px-12 sm:py-20">
        <div className="mx-auto max-w-4xl divide-y divide-zinc-200 border-y border-zinc-200">
          {sections.map((section, index) => <article key={section.title} className="grid gap-4 py-7 sm:grid-cols-[64px_1fr] sm:gap-8 sm:py-9">
            <span className="font-mono text-xs tracking-widest text-zinc-400">0{index + 1}</span>
            <div><h2 className="text-lg font-black uppercase tracking-wide">{section.title}</h2><p className="mt-3 text-sm leading-7 text-zinc-600">{section.text}</p>
              {section.bullets && <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
            </div>
          </article>)}
        </div>
        <p className="mx-auto mt-8 max-w-4xl text-xs leading-5 text-zinc-500">Need a hand? <a href="/contact-us" className="font-bold text-black underline underline-offset-4">Contact our team</a> or message us on WhatsApp using the button on this page.</p>
      </section>
      <Footer />
    </main>
  );
}
