import { Wrench, Truck, Settings, RefreshCw, CheckCircle } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Wrench,
      title: "Wymiana opon",
      description: "Profesjonalna wymiana opon w maszynach budowlanych każdego typu.",
      features: ["Koparki", "Ładowarki", "Wózki widłowe", "Walce drogowe"],
    },
    {
      icon: RefreshCw,
      title: "Naprawa opon",
      description: "Naprawiamy uszkodzone opony, przedłużając ich żywotność.",
      features: ["Wulkanizacja", "Łatanie", "Regeneracja", "Wymiana wentyli"],
    },
    {
      icon: Truck,
      title: "Serwis mobilny",
      description: "Dojeżdżamy na miejsce pracy Twojej maszyny.",
      features: ["Dojazd gratis", "Całodobowo", "Cały region", "Szybka reakcja"],
    },
    {
      icon: Settings,
      title: "Doradztwo",
      description: "Pomagamy wybrać odpowiednie opony do Twoich maszyn.",
      features: ["Dobór opon", "Optymalizacja", "Konsultacje", "Oferty hurtowe"],
    },
  ];

  return (
    <section id="uslugi" className="py-24 bg-gradient-dark relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(25,95%,53%,0.05),transparent_70%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold uppercase tracking-wider text-sm">Co oferujemy</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-2 mb-4">
            NASZE <span className="text-gradient">USŁUGI</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kompleksowa obsługa opon do maszyn budowlanych. Od wymiany po doradztwo - 
            wszystko w jednym miejscu.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-gradient-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 shadow-card"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <service.icon className="w-7 h-7 text-primary" />
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
