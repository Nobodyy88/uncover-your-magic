import { ArrowRight, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.webp";

const Hero = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Shield, text: t.hero.features.quality },
    { icon: Clock, text: t.hero.features.fast },
    { icon: Award, text: t.hero.features.experience },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16">
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
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">{t.hero.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-4">
              <span className="text-foreground">{t.hero.headline1}</span>
              <br />
              <span className="text-gradient">{t.hero.headline2}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium mb-8">
              {t.hero.headline3}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button variant="hero" size="xl" asChild>
                <a href="#kontakt">
                  {t.hero.ctaPrimary}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="#realizacje">{t.hero.ctaSecondary}</a>
              </Button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Logo (hidden on mobile) */}
          <div className="hidden lg:flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75" />
              {/* Logo with fade effect */}
              <div
                className="relative"
                style={{
                  maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
                  WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
                }}
              >
                <img
                  src={logo}
                  alt="WM Tyres"
                  className="w-96 xl:w-[500px] h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
