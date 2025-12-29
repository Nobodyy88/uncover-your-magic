import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  title?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}

/**
 * Komponent sekcji Hero dla dynamicznych podstron
 */
export const HeroSection = ({ title, description, image, ctaText, ctaLink }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[400px] flex items-center justify-center bg-gradient-to-br from-primary/10 to-background">
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {title && (
            <h1 className="font-display text-4xl md:text-6xl mb-6">{title}</h1>
          )}
          {description && (
            <p className="text-lg md:text-xl text-muted-foreground mb-8">{description}</p>
          )}
          {ctaText && ctaLink && (
            <Button size="lg" asChild>
              <a href={ctaLink}>{ctaText}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
