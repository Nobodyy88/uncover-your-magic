import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Rims = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-16 bg-gradient-dark relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(25,95%,53%,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(35,100%,50%,0.1),transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-2">
              {t.header.nav.productItems.rims.toUpperCase()}
            </h1>
            <p className="text-primary font-semibold uppercase tracking-wider text-lg">
              {t.header.nav.products}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="text-muted-foreground text-lg leading-relaxed text-center">
              {t.pages.comingSoon}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Rims;
