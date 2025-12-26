import { User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

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
              {t.about.title}
            </h1>
            <p className="text-primary font-semibold uppercase tracking-wider text-lg">
              {t.about.titleHighlight}
            </p>
          </div>

          {/* Two column layout - Text left, Team right */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left column - About text */}
            <div className="order-2 lg:order-1">
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed text-left">
                {t.about.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Right column - Team */}
            <div className="order-1 lg:order-2">
              <h2 className="font-display text-3xl md:text-4xl mb-8 text-center lg:text-left">
                {t.team.title} <span className="text-gradient">{t.team.titleHighlight}</span>
              </h2>

              <div className="space-y-6">
                {t.team.members.map((member, index) => (
                  <article
                    key={index}
                    className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 shadow-card hover:shadow-[0_0_20px_hsl(25_95%_53%_/_0.15)]"
                  >
                    <div className="flex items-start gap-4 p-4">
                      {/* Photo placeholder */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center border border-primary/20">
                        <User className="w-10 h-10 text-primary/40" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-xl text-foreground">
                          {member.name}
                        </h3>
                        <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-2">
                          {member.role}
                        </p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {member.description}
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

      {/* Stats section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.about.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl md:text-5xl text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
