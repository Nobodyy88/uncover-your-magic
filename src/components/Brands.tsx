import { useLanguage } from "@/contexts/LanguageContext";

const brands = [
  { name: "MICHELIN", style: "font-bold tracking-wider" },
  { name: "ALLIANCE", style: "font-bold tracking-wide" },
  { name: "BRIDGESTONE", style: "font-bold tracking-wider" },
  { name: "GALAXY", style: "font-bold tracking-widest" },
];

const Brands = () => {
  const { t } = useLanguage();

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <div className="text-center">
          <span className="text-primary font-semibold uppercase tracking-wider text-sm">
            {t.brands.label}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-2">
            {t.brands.title} <span className="text-gradient">{t.brands.titleHighlight}</span>
          </h2>
        </div>
      </div>

      {/* Marquee container */}
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling brands */}
        <div className="flex animate-marquee">
          {duplicatedBrands.map((brand, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-8 md:mx-12 flex items-center justify-center"
            >
              <span
                className={`text-2xl md:text-3xl lg:text-4xl text-muted-foreground/60 hover:text-primary transition-colors duration-300 cursor-default select-none ${brand.style}`}
              >
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add marquee animation to global styles */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Brands;
