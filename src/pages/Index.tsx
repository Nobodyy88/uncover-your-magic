import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Realizations from "@/components/Realizations";
import About from "@/components/About";
import Partners from "@/components/Partners";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  const { t } = useLanguage();

  return (
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
          <About />
          <Partners />
          <ContactForm />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
