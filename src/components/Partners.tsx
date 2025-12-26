import { useLanguage } from "@/contexts/LanguageContext";
import euFlag from "@/assets/eu-flag.webp";

const Partners = () => {
  const { t } = useLanguage();

  return (
    <section id="partnerzy" className="py-24 bg-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(25,95%,53%,0.08),transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - EU Flag */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <img
              src={euFlag}
              alt="European Union"
              className="w-64 sm:w-80 lg:w-96 h-auto rounded-lg"
            />
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              {t.partners.label}
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-2 mb-6">
              {t.partners.title} <span className="text-gradient">{t.partners.titleHighlight}</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t.partners.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
