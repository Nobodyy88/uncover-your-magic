import { useState } from "react";
import { Send, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// URL webhooka n8n - ustaw w pliku .env jako VITE_N8N_WEBHOOK_URL
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "";

const ContactForm = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    machine: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Sprawdź czy webhook URL jest skonfigurowany
      if (!N8N_WEBHOOK_URL) {
        console.error("N8N_WEBHOOK_URL nie jest skonfigurowany");
        throw new Error("Webhook URL not configured");
      }

      // Wyślij dane do webhooka n8n
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          language,
          timestamp: new Date().toISOString(),
          source: "wmtyres-website",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Sukces
      toast({
        title: t.contact.toast.title,
        description: t.contact.toast.description,
      });

      // Wyczyść formularz
      setFormData({ name: "", phone: "", email: "", machine: "", message: "" });

    } catch (error) {
      console.error("Błąd wysyłania formularza:", error);

      // Pokaż błąd użytkownikowi
      toast({
        title: t.contact.toast.errorTitle || "Błąd",
        description: t.contact.toast.errorDescription || "Nie udało się wysłać wiadomości. Spróbuj ponownie później.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Phone, ...t.contact.info.phone, href: "tel:+48123456789" },
    { icon: Mail, ...t.contact.info.email, href: "mailto:kontakt@wmtyres.pl" },
    { icon: MapPin, ...t.contact.info.address, href: "#" },
    { icon: Clock, ...t.contact.info.hours, href: "#" },
  ];

  return (
    <section id="kontakt" className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold uppercase tracking-wider text-sm">
            {t.contact.label}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-2 mb-4">
            {t.contact.title} <span className="text-gradient">{t.contact.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.contact.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl p-8 border border-border shadow-card">
              <h3 className="font-display text-2xl mb-6">{t.contact.info.title}</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a key={index} href={item.href} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                      <div className="text-foreground font-medium group-hover:text-primary transition-colors">
                        {item.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick CTA */}
            <div className="bg-gradient-primary rounded-2xl p-8 text-center">
              <h3 className="font-display text-2xl text-primary-foreground mb-2">
                {t.contact.urgent.title}
              </h3>
              <p className="text-primary-foreground/80 mb-4">{t.contact.urgent.description}</p>
              <Button
                variant="outline"
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-none"
                asChild
              >
                <a href="tel:+48123456789">
                  <Phone className="w-4 h-4 mr-2" />
                  {t.contact.info.phone.value}
                </a>
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border shadow-card">
              <h3 className="font-display text-2xl mb-6">{t.contact.form.title}</h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    {t.contact.form.name.label} <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.contact.form.name.placeholder}
                    required
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    {t.contact.form.phone.label} <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t.contact.form.phone.placeholder}
                    required
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {t.contact.form.email.label} <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.contact.form.email.placeholder}
                    required
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <label htmlFor="machine" className="block text-sm font-medium text-foreground mb-2">
                    {t.contact.form.machine.label}
                  </label>
                  <Input
                    id="machine"
                    name="machine"
                    value={formData.machine}
                    onChange={handleChange}
                    placeholder={t.contact.form.machine.placeholder}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  {t.contact.form.message.label} <span className="text-primary">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t.contact.form.message.placeholder}
                  rows={5}
                  required
                  className="bg-secondary border-border resize-none"
                />
              </div>

              <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  t.contact.form.submitting
                ) : (
                  <>
                    {t.contact.form.submit}
                    <Send className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
