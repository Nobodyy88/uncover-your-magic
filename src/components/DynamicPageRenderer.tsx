import { HeroSection } from '@/components/page-sections/HeroSection';
import { FeaturesSection } from '@/components/page-sections/FeaturesSection';
import { TextSection } from '@/components/page-sections/TextSection';

interface PageSection {
  type: 'hero' | 'features' | 'text';
  title?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  items?: Array<{ title: string; description: string }>;
  content?: string;
  className?: string;
}

interface DynamicPageRendererProps {
  content: {
    sections?: PageSection[];
  } | null;
  title?: string;
  subtitle?: string;
}

/**
 * Renderer dynamicznych treści podstron
 *
 * Renderuje sekcje na podstawie typu z JSONB content
 */
export const DynamicPageRenderer = ({ content, title, subtitle }: DynamicPageRendererProps) => {
  if (!content?.sections || content.sections.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">{title || 'Strona w budowie'}</h1>
          {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      {content.sections.map((section, index) => {
        switch (section.type) {
          case 'hero':
            return (
              <HeroSection
                key={index}
                title={section.title || title}
                description={section.description || subtitle}
                image={section.image}
                ctaText={section.ctaText}
                ctaLink={section.ctaLink}
              />
            );

          case 'features':
            return (
              <FeaturesSection
                key={index}
                title={section.title}
                items={section.items || []}
              />
            );

          case 'text':
            return (
              <TextSection
                key={index}
                content={section.content || ''}
                className={section.className}
              />
            );

          default:
            console.warn(`Unknown section type: ${section.type}`);
            return null;
        }
      })}
    </>
  );
};
