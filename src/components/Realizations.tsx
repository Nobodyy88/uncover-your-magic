import { Calendar, MapPin, Wrench } from "lucide-react";

const Realizations = () => {
  // Te dane można łatwo aktualizować - w przyszłości można połączyć z bazą danych
  const realizations = [
    {
      id: 1,
      title: "Wymiana opon w koparce CAT 320",
      date: "15 grudnia 2024",
      location: "Warszawa",
      description: "Kompleksowa wymiana 4 opon w koparce gąsienicowej. Klient zgłosił się z uszkodzonymi gąsienicami po intensywnej pracy na budowie.",
      image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&h=400&fit=crop",
      type: "Koparka",
    },
    {
      id: 2,
      title: "Serwis ładowarki Volvo L90",
      date: "12 grudnia 2024",
      location: "Kraków",
      description: "Wymiana przednich opon oraz naprawa tylnej lewej opony. Realizacja w terenie na placu budowy.",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
      type: "Ładowarka",
    },
    {
      id: 3,
      title: "Opony do wózka widłowego Toyota",
      date: "10 grudnia 2024",
      location: "Łódź",
      description: "Montaż nowych opon pełnych do wózka widłowego pracującego w magazynie.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
      type: "Wózek widłowy",
    },
    {
      id: 4,
      title: "Naprawa opony w walcu BOMAG",
      date: "8 grudnia 2024",
      location: "Poznań",
      description: "Wulkanizacja uszkodzonej opony walca drogowego. Szybka naprawa umożliwiła kontynuację prac.",
      image: "https://images.unsplash.com/photo-1621922688758-e2e441a80025?w=600&h=400&fit=crop",
      type: "Walec",
    },
    {
      id: 5,
      title: "Wymiana opon koparko-ładowarki JCB",
      date: "5 grudnia 2024",
      location: "Gdańsk",
      description: "Pełna wymiana kompletu opon w koparko-ładowarce. Dobór opon dostosowany do warunków pracy na mokrym terenie.",
      image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=400&fit=crop",
      type: "Koparko-ładowarka",
    },
    {
      id: 6,
      title: "Serwis floty budowlanej",
      date: "1 grudnia 2024",
      location: "Wrocław",
      description: "Kompleksowy przegląd i wymiana opon w 5 maszynach dla firmy budowlanej. Umowa serwisowa.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      type: "Flota",
    },
  ];

  return (
    <section id="realizacje" className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold uppercase tracking-wider text-sm">Portfolio</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-2 mb-4">
            OSTATNIE <span className="text-gradient">REALIZACJE</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Zobacz nasze najnowsze prace. Każdy projekt traktujemy z pełnym profesjonalizmem 
            i dbałością o szczegóły.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {realizations.map((item) => (
            <article
              key={item.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 shadow-card hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
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
