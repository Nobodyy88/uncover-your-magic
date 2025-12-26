import { useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const productItems = [
    { href: "/produkty/opony", label: t.header.nav.productItems.tires },
    { href: "/produkty/felgi", label: t.header.nav.productItems.rims },
    { href: "/produkty/regeneracja", label: t.header.nav.productItems.regeneration },
    { href: "/produkty/ride-on", label: t.header.nav.productItems.rideOn },
  ];

  const serviceItems = [
    { href: "/serwis/naprawy", label: t.header.nav.serviceItems.repairs },
    { href: "/serwis/umowa-serwisowa", label: t.header.nav.serviceItems.serviceContract },
    { href: "/serwis/montaz", label: t.header.nav.serviceItems.mounting },
  ];

  const navLinks = [
    { href: "/o-nas", label: t.header.nav.about, isSection: false },
    { href: "/siec-partnerow", label: t.header.nav.partnerNetwork, isSection: false },
    { href: "kontakt", label: t.header.nav.contact, isSection: true },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string, isSection: boolean) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setOpenDropdown(null);

    if (isSection) {
      if (location.pathname === "/") {
        const element = document.getElementById(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    } else {
      navigate(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDropdownItemClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setMobileOpenDropdown(null);
    navigate(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#/" onClick={handleLogoClick} className="flex items-center">
            <img
              src={logo}
              alt="WM Tyres"
              className="h-12 md:h-14 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {/* PRODUKTY Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("products")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-300 font-medium py-2">
                {t.header.nav.products}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === "products" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "products" && (
                <div className="absolute top-full left-0 mt-0 py-2 bg-card border border-border rounded-lg shadow-xl min-w-[200px] animate-fade-in">
                  {productItems.map((item) => (
                    <a
                      key={item.href}
                      href={`#${item.href}`}
                      onClick={(e) => handleDropdownItemClick(e, item.href)}
                      className="block px-4 py-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* SERWIS Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("service")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-300 font-medium py-2">
                {t.header.nav.service}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === "service" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "service" && (
                <div className="absolute top-full left-0 mt-0 py-2 bg-card border border-border rounded-lg shadow-xl min-w-[200px] animate-fade-in">
                  {serviceItems.map((item) => (
                    <a
                      key={item.href}
                      href={`#${item.href}`}
                      onClick={(e) => handleDropdownItemClick(e, item.href)}
                      className="block px-4 py-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Regular nav links */}
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.isSection ? `#${link.href}` : `#${link.href}`}
                onClick={(e) => handleNavClick(e, link.href, link.isSection)}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button + Language Switcher */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+48123456789" className="flex items-center gap-2 text-primary font-semibold">
              <Phone className="w-4 h-4" />
              {t.header.phone}
            </a>
            <LanguageSwitcher />
            <Button variant="hero" size="lg" asChild>
              <a
                href="#kontakt"
                onClick={(e) => handleNavClick(e, "kontakt", true)}
              >
                {t.header.cta}
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
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
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {/* PRODUKTY Mobile Dropdown */}
              <div>
                <button
                  onClick={() => setMobileOpenDropdown(mobileOpenDropdown === "products" ? null : "products")}
                  className="flex items-center justify-between w-full text-muted-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                >
                  {t.header.nav.products}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileOpenDropdown === "products" ? "rotate-180" : ""}`} />
                </button>
                {mobileOpenDropdown === "products" && (
                  <div className="pl-4 py-2 space-y-2">
                    {productItems.map((item) => (
                      <a
                        key={item.href}
                        href={`#${item.href}`}
                        onClick={(e) => handleDropdownItemClick(e, item.href)}
                        className="block text-muted-foreground hover:text-primary transition-colors py-1"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* SERWIS Mobile Dropdown */}
              <div>
                <button
                  onClick={() => setMobileOpenDropdown(mobileOpenDropdown === "service" ? null : "service")}
                  className="flex items-center justify-between w-full text-muted-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                >
                  {t.header.nav.service}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileOpenDropdown === "service" ? "rotate-180" : ""}`} />
                </button>
                {mobileOpenDropdown === "service" && (
                  <div className="pl-4 py-2 space-y-2">
                    {serviceItems.map((item) => (
                      <a
                        key={item.href}
                        href={`#${item.href}`}
                        onClick={(e) => handleDropdownItemClick(e, item.href)}
                        className="block text-muted-foreground hover:text-primary transition-colors py-1"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Regular nav links */}
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.isSection ? `#${link.href}` : `#${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href, link.isSection)}
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
                  <a
                    href="#kontakt"
                    onClick={(e) => handleNavClick(e, "kontakt", true)}
                  >
                    {t.header.cta}
                  </a>
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
