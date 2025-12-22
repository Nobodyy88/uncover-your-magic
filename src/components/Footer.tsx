import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo-wmtyres.webp";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={logo} 
                alt="WM Tyres - Profesjonalna wymiana opon" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-muted-foreground max-w-md">
              Profesjonalna wymiana i naprawa opon do maszyn budowlanych. 
              15 lat doświadczenia, serwis mobilny 24/7.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-4">Szybkie linki</h4>
            <nav className="space-y-2">
              <a href="#uslugi" className="block text-muted-foreground hover:text-primary transition-colors">
                Usługi
              </a>
              <a href="#realizacje" className="block text-muted-foreground hover:text-primary transition-colors">
                Realizacje
              </a>
              <a href="#o-nas" className="block text-muted-foreground hover:text-primary transition-colors">
                O nas
              </a>
              <a href="#kontakt" className="block text-muted-foreground hover:text-primary transition-colors">
                Kontakt
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg mb-4">Kontakt</h4>
            <div className="space-y-3">
              <a href="tel:+48123456789" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                +48 123 456 789
              </a>
              <a href="mailto:kontakt@wmtyres.pl" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                kontakt@wmtyres.pl
              </a>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                ul. Przemysłowa 15, Warszawa
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} WM Tyres. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
