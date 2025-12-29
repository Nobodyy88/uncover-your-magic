import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Realizations from "@/components/Realizations";
import Brands from "@/components/Brands";
import Partners from "@/components/Partners";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = () => {
  const { t, isLoading } = useLanguage();

  console.log('🏠 [Index] Rendering, isLoading:', isLoading);
  console.log('🏠 [Index] t.meta:', t?.meta);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl">Ładowanie...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <>
        <Helmet>
          <title>{t.meta.title}</title>
          <meta name="description" content={t.meta.description} />
          <meta name="keywords" content={t.meta.keywords} />
        </Helmet>

        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Hero />
            <Services />
            <Realizations />
            <Brands />
            <Partners />
            <ContactForm />
          </main>
          <Footer />
        </div>
      </>
    </ErrorBoundary>
  );
};

export default Index;
