import { ArrowRight, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const features = [
    { icon: Shield, text: "Gwarancja jakości" },
    { icon: Clock, text: "Szybka realizacja" },
    { icon: Award, text: "15 lat doświadczenia" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(25,95%,53%,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(35,100%,50%,0.1),transparent_50%)]" />
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 opacity-0 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Profesjonalna wymiana opon</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none mb-6 opacity-0 animate-fade-up animation-delay-100">
            WYMIANA OPON
            <br />
            <span className="text-gradient">MASZYN BUDOWLANYCH</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-up animation-delay-200">
            Specjalizujemy się w profesjonalnej wymianie i naprawie opon do koparek, 
            ładowarek, wózków widłowych i innych maszyn budowlanych.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 opacity-0 animate-fade-up animation-delay-300">
            <Button variant="hero" size="xl" asChild>
              <a href="#kontakt">
                Umów bezpłatną wycenę
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#realizacje">Zobacz nasze realizacje</a>
            </Button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-8 opacity-0 animate-fade-up animation-delay-400">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animation-delay-500">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
