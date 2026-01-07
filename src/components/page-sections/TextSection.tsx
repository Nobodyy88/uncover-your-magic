import DOMPurify from 'dompurify';

interface TextSectionProps {
  content: string;
  className?: string;
}

/**
 * Komponent sekcji tekstowej dla dynamicznych podstron
 * Używa DOMPurify do sanityzacji HTML i ochrony przed XSS
 */
export const TextSection = ({ content, className = '' }: TextSectionProps) => {
  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });

  return (
    <section className={`py-16 bg-background ${className}`}>
      <div className="container mx-auto px-4">
        <div
          className="prose prose-slate max-w-4xl mx-auto"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </section>
  );
};
