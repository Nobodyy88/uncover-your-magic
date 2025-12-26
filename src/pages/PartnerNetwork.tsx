import { Handshake, ShoppingCart, CalendarX, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const PartnerNetwork = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("kontakt");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const features = [
    {
      icon: Handshake,
      title: t.partnerNetwork.features.materials.title,
      description: t.partnerNetwork.features.materials.description,
    },
    {
      icon: ShoppingCart,
      title: t.partnerNetwork.features.assortment.title,
      description: t.partnerNetwork.features.assortment.description,
    },
    {
      icon: CalendarX,
      title: t.partnerNetwork.features.downtime.title,
      description: t.partnerNetwork.features.downtime.description,
    },
    {
      icon: Clock,
      title: t.partnerNetwork.features.service.title,
      description: t.partnerNetwork.features.service.description,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main content */}
      <section className="pt-32 pb-16 bg-gradient-dark relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(25,95%,53%,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(35,100%,50%,0.1),transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-2">
              {t.partnerNetwork.title}
            </h1>
            <p className="text-primary font-semibold uppercase tracking-wider text-lg">
              {t.partnerNetwork.titleHighlight}
            </p>
          </div>

          {/* Two column layout - Text left, Features right */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left column - Description text */}
            <div className="order-2 lg:order-1">
              <h2 className="font-display text-2xl md:text-3xl mb-6 text-left leading-tight">
                {t.partnerNetwork.headline}
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed text-left">
                <p>{t.partnerNetwork.description}</p>
              </div>
            </div>

            {/* Right column - Feature cards */}
            <div className="order-1 lg:order-2">
              <h2 className="font-display text-3xl md:text-4xl mb-8 text-center lg:text-left">
                {t.partnerNetwork.featuresTitle} <span className="text-gradient">{t.partnerNetwork.featuresTitleHighlight}</span>
              </h2>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <article
                    key={index}
                    className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 shadow-card hover:shadow-[0_0_20px_hsl(25_95%_53%_/_0.15)]"
                  >
                    <div className="flex items-start gap-4 p-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-secondary/50 flex items-center justify-center border border-primary/20">
                        <feature.icon className="w-7 h-7 text-primary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg text-foreground mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-4">
            {t.partnerNetwork.cta.title} <span className="text-gradient">{t.partnerNetwork.cta.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            {t.partnerNetwork.cta.description}
          </p>
          <button
            onClick={handleContactClick}
            className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors"
          >
            {t.partnerNetwork.cta.button}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnerNetwork;
