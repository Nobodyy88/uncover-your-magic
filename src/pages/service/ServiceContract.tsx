import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ServiceContract = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-center text-black">
            {t.pages.serviceContract.title}
          </h1>
        </div>
      </section>

      {/* Section 1 - Individual contracts */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <img
                src="/images/service-contract-1.jpg"
                alt="Opony na regale"
                className="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80";
                }}
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl mb-6 text-primary">
                {t.pages.serviceContract.sections.individual.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t.pages.serviceContract.sections.individual.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Predictable costs */}
      <section className="py-16 bg-gradient-dark relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(25,95%,53%,0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl mb-6 text-primary">
                {t.pages.serviceContract.sections.predictable.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t.pages.serviceContract.sections.predictable.description}
              </p>
            </div>
            <div>
              <img
                src="/images/service-contract-2.jpg"
                alt="Opony przemysłowe"
                className="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Priority service */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <img
                src="/images/service-contract-3.jpg"
                alt="Maszyny budowlane"
                className="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80";
                }}
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl mb-6 text-primary">
                {t.pages.serviceContract.sections.priority.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t.pages.serviceContract.sections.priority.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - One partner */}
      <section className="py-16 bg-gradient-dark relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(35,100%,50%,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl mb-6 text-primary">
                {t.pages.serviceContract.sections.partner.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t.pages.serviceContract.sections.partner.description}
              </p>
            </div>
            <div className="flex justify-center items-center">
              <img
                src="/images/wm-tyres-logo-large.png"
                alt="WM Tyres Logo"
                className="max-w-[300px] h-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="text-center">
                      <span class="font-display text-6xl md:text-8xl text-primary">WM</span>
                      <span class="font-display text-4xl md:text-6xl text-white block">TYRES</span>
                    </div>
                  `;
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              {t.pages.serviceContract.cta.title}
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-6" />
            <p className="text-muted-foreground text-lg mb-8">
              {t.pages.serviceContract.cta.description}
            </p>
            <Link to="/#kontakt">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-semibold px-8">
                {t.pages.serviceContract.cta.button}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceContract;
