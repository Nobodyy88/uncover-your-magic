import { Users, Award, Truck, Clock } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, value: "500+", label: "Zadowolonych klientów" },
    { icon: Award, value: "15", label: "Lat doświadczenia" },
    { icon: Truck, value: "2000+", label: "Wykonanych usług" },
    { icon: Clock, value: "24/7", label: "Dostępność serwisu" },
  ];

  return (
    <section id="o-nas" className="py-24 bg-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(25,95%,53%,0.1),transparent_60%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">O nas</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-2 mb-6">
              PROFESJONALIŚCI <br /><span className="text-gradient">W BRANŻY OPON</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Od ponad 15 lat specjalizujemy się w obsłudze opon do maszyn budowlanych. 
                Nasza wiedza i doświadczenie pozwalają nam realizować nawet najtrudniejsze zlecenia.
              </p>
              <p>
                Współpracujemy z największymi firmami budowlanymi w regionie, zapewniając 
                kompleksową obsługę ich floty maszynowej. Oferujemy serwis mobilny - dojeżdżamy 
                bezpośrednio na plac budowy.
              </p>
              <p>
                Stawiamy na jakość i terminowość. Każde zlecenie traktujemy indywidualnie, 
                dobierając optymalne rozwiązania dla naszych klientów.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mt-10">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-display text-3xl text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop"
                    alt="Maszyna budowlana"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img
                    src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&h=400&fit=crop"
                    alt="Koparka"
                    className="w-full h-56 object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
                    alt="Plac budowy"
                    className="w-full h-56 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img
                    src="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop"
                    alt="Maszyny budowlane"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-primary rounded-2xl -z-10 opacity-50" />
            <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-primary/30 rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
