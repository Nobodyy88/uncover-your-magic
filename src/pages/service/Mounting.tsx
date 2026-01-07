import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DynamicPageRenderer } from "@/components/DynamicPageRenderer";
import { useLanguage } from "@/contexts/LanguageContext";

const Mounting = () => {
  const { t, language } = useLanguage();

  const { data: pageContent, isLoading } = useQuery({
    queryKey: ['page-content', 'mounting', language],
    queryFn: async () => {
      const { data } = await supabase
        .from('page_contents')
        .select('*')
        .eq('page_slug', 'mounting')
        .eq('is_published', true)
        .maybeSingle();

      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {isLoading ? (
        <section className="pt-32 pb-16 min-h-[400px] flex items-center justify-center">
          <div className="text-muted-foreground">Ładowanie...</div>
        </section>
      ) : pageContent ? (
        <div className="pt-32">
          <DynamicPageRenderer
            content={pageContent[`content_${language}`] as { sections?: Array<{ type: 'hero' | 'features' | 'text'; title?: string; description?: string; image?: string; ctaText?: string; ctaLink?: string; items?: Array<{ title: string; description: string }>; content?: string; className?: string }> } | null}
            title={pageContent[`title_${language}`] || undefined}
            subtitle={pageContent[`subtitle_${language}`] || undefined}
          />
        </div>
      ) : (
        <section className="pt-32 pb-16 bg-gradient-dark relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(25,95%,53%,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(35,100%,50%,0.1),transparent_50%)]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-2">
                {t.header.nav.serviceItems.mounting.toUpperCase()}
              </h1>
              <p className="text-primary font-semibold uppercase tracking-wider text-lg">
                {t.header.nav.service}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <p className="text-muted-foreground text-lg leading-relaxed text-center">
                {t.pages.comingSoon}
              </p>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Mounting;
