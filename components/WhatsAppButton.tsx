export default function WhatsAppButton() {
  const message = encodeURIComponent("Hi, I need help with an Overdose order.");
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const href = number ? `https://wa.me/${number}?text=${message}` : `https://wa.me/?text=${message}`;
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp" className="fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]">
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true"><path d="M16.02 3a12.8 12.8 0 0 0-10.9 19.52L3.4 29l6.64-1.68A12.9 12.9 0 1 0 16.02 3Zm0 23.4c-1.93 0-3.82-.52-5.47-1.5l-.39-.23-3.95 1 1.02-3.85-.25-.4A10.44 10.44 0 1 1 16.02 26.4Zm5.73-7.82c-.31-.16-1.86-.92-2.15-1.02-.29-.1-.5-.16-.7.16-.21.31-.81 1.02-.99 1.23-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.52-.93-.83-1.56-1.86-1.74-2.17-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.2.05-.39-.03-.55-.08-.15-.7-1.7-.96-2.33-.25-.61-.51-.53-.7-.54l-.6-.01c-.21 0-.55.08-.84.39-.28.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.15.21 2.22 3.38 5.37 4.74.75.32 1.34.51 1.8.65.76.24 1.45.2 2 .12.61-.09 1.86-.76 2.12-1.5.26-.75.26-1.39.18-1.52-.08-.14-.29-.22-.6-.37Z" /></svg>
    </a>
  );
}
