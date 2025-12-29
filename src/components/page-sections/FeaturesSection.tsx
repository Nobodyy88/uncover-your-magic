import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

interface FeaturesSectionProps {
  title?: string;
  items: FeatureItem[];
}

/**
 * Komponent sekcji Features dla dynamicznych podstron
 */
export const FeaturesSection = ({ title, items }: FeaturesSectionProps) => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="font-display text-3xl md:text-4xl text-center mb-12">{title}</h2>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
