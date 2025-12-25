import { Wrench, Truck, Settings, RefreshCw, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const icons = [Wrench, RefreshCw, Truck, Settings];

const Services = () => {
  const { t } = useLanguage();

  return (
    <section id="uslugi" className="py-24 bg-gradient-dark relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(25,95%,53%,0.05),transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold uppercase tracking-wider text-sm">
            {t.services.label}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-2 mb-4">
            {t.services.title} <span className="text-gradient">{t.services.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.services.description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.items.map((service, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className="group bg-gradient-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 shadow-card"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl mb-3 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
