import { Phone, Mail, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { href: "uslugi", label: t.header.nav.services, isSection: true },
    { href: "realizacje", label: t.header.nav.realizations, isSection: true },
    { href: "/o-nas", label: t.header.nav.about, isSection: false },
    { href: "/siec-partnerow", label: t.header.nav.partnerNetwork, isSection: false },
    { href: "kontakt", label: t.header.nav.contact, isSection: true },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string, isSection: boolean) => {
    e.preventDefault();

    if (isSection) {
      // Link do sekcji na stronie głównej
      if (location.pathname === "/") {
        // Jesteśmy na głównej - scrolluj do sekcji
        const element = document.getElementById(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Nie jesteśmy na głównej - przejdź na główną i potem scrolluj
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    } else {
      // Link do podstrony
      navigate(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <a href="#/" onClick={handleLogoClick}>
                <img
                  src={logo}
                  alt="WM Tyres"
                  className="h-14 w-auto"
                />
              </a>
            </div>
            <p className="text-muted-foreground max-w-md">{t.footer.description}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-4">{t.footer.quickLinks}</h4>
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.isSection ? `#${link.href}` : `#${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href, link.isSection)}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg mb-4">{t.footer.contactTitle}</h4>
            <div className="space-y-3">
              <a
                href="tel:+48123456789"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                {t.header.phone}
              </a>
              <a
                href="mailto:kontakt@wmtyres.pl"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                kontakt@wmtyres.pl
              </a>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {t.contact.info.address.value}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
