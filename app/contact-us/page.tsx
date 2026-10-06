import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar />
      <PageHero eyebrow="Customer care" title="Contact us" description="Questions about orders, sizing, or the next drop? Our team is here to help." />
      <section className="px-6 py-16 sm:px-12 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <form className="space-y-4 border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
            <input className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-white" placeholder="Name" />
            <input className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-white" placeholder="Email" type="email" />
            <textarea className="min-h-36 w-full bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-white" placeholder="Message" />
            <button className="bg-white px-8 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-zinc-200">
              Send
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
