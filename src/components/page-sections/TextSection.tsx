interface TextSectionProps {
  content: string;
  className?: string;
}

/**
 * Komponent sekcji tekstowej dla dynamicznych podstron
 */
export const TextSection = ({ content, className = '' }: TextSectionProps) => {
  return (
    <section className={`py-16 bg-background ${className}`}>
      <div className="container mx-auto px-4">
        <div
          className="prose prose-slate max-w-4xl mx-auto"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
};
