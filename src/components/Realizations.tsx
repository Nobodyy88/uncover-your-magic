import { Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const images = [
  "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1621922688758-e2e441a80025?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
];

const Realizations = () => {
  const { t } = useLanguage();

  return (
    <section id="realizacje" className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold uppercase tracking-wider text-sm">
            {t.realizations.label}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-2 mb-4">
            {t.realizations.title} <span className="text-gradient">{t.realizations.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.realizations.description}
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.realizations.items.map((item, index) => (
            <article
              key={index}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 shadow-card hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-card">
                <img
                  src={images[index]}
                  alt={item.title}
                  loading="lazy"
                  className="block w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 transform-gpu will-change-transform"
                  style={{ backfaceVisibility: "hidden" }}
                />
                <div className="absolute -inset-px bg-gradient-to-t from-card to-transparent pointer-events-none" />
                <span className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  {item.type}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {item.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {item.location}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Realizations;
