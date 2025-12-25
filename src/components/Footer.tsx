import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.webp";

const Footer = () => {
  const { t } = useLanguage();

  const navLinks = [
    { href: "#uslugi", label: t.header.nav.services },
    { href: "#realizacje", label: t.header.nav.realizations },
    { href: "#o-nas", label: t.header.nav.about },
    { href: "#kontakt", label: t.header.nav.contact },
  ];

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <img
                src={logo}
                alt="WM Tyres"
                className="h-14 w-auto"
              />
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
                  href={link.href}
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
