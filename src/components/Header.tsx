import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.webp";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: "#uslugi", label: t.header.nav.services },
    { href: "#realizacje", label: t.header.nav.realizations },
    { href: "#o-nas", label: t.header.nav.about },
    { href: "#kontakt", label: t.header.nav.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img
              src={logo}
              alt="WM Tyres"
              className="h-12 md:h-14 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button + Language Switcher */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+48123456789" className="flex items-center gap-2 text-primary font-semibold">
              <Phone className="w-4 h-4" />
              {t.header.phone}
            </a>
            <LanguageSwitcher />
            <Button variant="hero" size="lg" asChild>
              <a href="#kontakt">{t.header.cta}</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-foreground"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-border">
                <a href="tel:+48123456789" className="flex items-center gap-2 text-primary font-semibold mb-4">
                  <Phone className="w-4 h-4" />
                  {t.header.phone}
                </a>
                <Button variant="hero" size="lg" className="w-full" asChild>
                  <a href="#kontakt">{t.header.cta}</a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
