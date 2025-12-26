import { Gauge, Clock, Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Tires = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Gauge,
      title: t.pages.tires.features.pressure.title,
      description: t.pages.tires.features.pressure.description,
    },
    {
      icon: Clock,
      title: t.pages.tires.features.service.title,
      description: t.pages.tires.features.service.description,
    },
    {
      icon: Globe,
      title: t.pages.tires.features.partnerships.title,
      description: t.pages.tires.features.partnerships.description,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-16 bg-gradient-dark relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(25,95%,53%,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(35,100%,50%,0.1),transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-2">
              {t.pages.tires.title}
            </h1>
            <p className="text-primary font-semibold uppercase tracking-wider text-lg">
              {t.pages.tires.subtitle}
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-8">
            {features.map((feature, index) => (
              <article
                key={index}
                className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 shadow-card hover:shadow-[0_0_20px_hsl(25_95%_53%_/_0.15)]"
              >
                <div className="flex flex-col md:flex-row items-start gap-6 p-6 md:p-8">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <feature.icon className="w-10 h-10 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-display text-2xl md:text-3xl text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tires;
