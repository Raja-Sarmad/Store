const VALUES = [
  {
    title: "Premium Quality Guaranteed",
    icon: (
      <>
        <circle cx="12" cy="8" r="4.2" strokeWidth={1.5} />
        <path strokeWidth={1.5} d="M8.2 11.2 7 20l5-2.4L17 20l-1.2-8.8" />
        <path strokeWidth={1.5} d="M10.2 7.6h3.6" />
      </>
    ),
  },
  {
    title: "Branded Wear at Best Prices",
    icon: (
      <>
        <path
          strokeWidth={1.5}
          d="M20.5 12.3 12.3 20.5a1.8 1.8 0 0 1-2.5 0L3.5 14.2a1.8 1.8 0 0 1 0-2.5L11.7 3.5a1.8 1.8 0 0 1 1.3-.5H19a1.8 1.8 0 0 1 1.8 1.8v5.9c0 .5-.2 1-.5 1.3Z"
        />
        <circle cx="15.4" cy="8.4" r="1.1" strokeWidth={1.5} />
      </>
    ),
  },
  {
    title: "Fast & Reliable Delivery",
    icon: (
      <>
        <path strokeWidth={1.5} d="M3 7.5h10.5V17H3V7.5Z" />
        <path strokeWidth={1.5} d="M13.5 10.5H17l3 3.2V17h-6.5v-6.5Z" />
        <circle cx="7.2" cy="19" r="1.5" strokeWidth={1.5} />
        <circle cx="16.8" cy="19" r="1.5" strokeWidth={1.5} />
      </>
    ),
  },
  {
    title: "Dedicated Support Always",
    icon: (
      <>
        <path strokeWidth={1.5} d="M5 12a7 7 0 0 1 14 0v2.8a2.6 2.6 0 0 1-2.6 2.6H15v-4.8h3.4" />
        <path strokeWidth={1.5} d="M5 14.8H8.4v4.8H7A2.2 2.2 0 0 1 4.8 17.4v-2.6Z" />
        <path strokeWidth={1.5} d="M12 19.4h1.6a2 2 0 0 0 2-2" />
      </>
    ),
  },
];

export default function HomeValues() {
  return (
    <section className="relative z-40 -mt-10 px-4 sm:-mt-12 sm:px-6">
      <div className="sp-container rounded-[2rem] border border-white bg-[#fffdfb] px-4 py-3.5 shadow-[0_18px_40px_rgba(80,30,40,0.12)] sm:px-7 lg:rounded-full">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {VALUES.map((item, index) => (
            <div
              key={item.title}
              className={`flex items-center gap-3 px-2 py-1.5 lg:px-4 ${
                index > 0 ? "lg:border-l lg:border-[#e8d7c8]" : ""
              }`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#e4d0be] bg-white text-[#5c1a30]">
                <svg
                  className="h-[22px] w-[22px]"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  {item.icon}
                </svg>
              </span>
              <p className="max-w-[9.8rem] text-[13px] font-semibold leading-snug text-[#2c211c]">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
