import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Realizations from "@/components/Realizations";
import About from "@/components/About";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>OponyPro - Profesjonalna wymiana opon maszyn budowlanych</title>
        <meta 
          name="description" 
          content="Specjalizujemy się w wymianie i naprawie opon do koparek, ładowarek, wózków widłowych. Serwis mobilny 24/7, 15 lat doświadczenia. Umów bezpłatną wycenę!" 
        />
        <meta name="keywords" content="wymiana opon, maszyny budowlane, opony do koparek, opony do ładowarek, serwis opon, wulkanizacja" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Services />
          <Realizations />
          <About />
          <ContactForm />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
