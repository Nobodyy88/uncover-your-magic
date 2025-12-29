import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus, Trash2 } from 'lucide-react';

interface ArrayItem {
  id: string;
  array_index: number;
  value_pl: string;
  value_en: string;
  value_de: string;
  key: string;
}

interface ArrayEditorProps {
  items: ArrayItem[];
  onChange: (items: ArrayItem[]) => void;
  language: 'pl' | 'en' | 'de';
  disabled?: boolean;
}

/**
 * Komponent do edycji elementów tablicy
 * Obsługuje dodawanie, usuwanie i edycję elementów
 */
export const ArrayEditor = ({ items, onChange, language, disabled = false }: ArrayEditorProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const valueKey = `value_${language}` as keyof ArrayItem;

  const handleAddItem = () => {
    const maxIndex = items.length > 0 ? Math.max(...items.map(item => item.array_index)) : -1;
    const newItem: ArrayItem = {
      id: `new-${Date.now()}`,
      array_index: maxIndex + 1,
      value_pl: '',
      value_en: '',
      value_de: '',
      key: items[0]?.key || '',
    };
    onChange([...items, newItem]);
    setOpenItems([...openItems, newItem.id]);
  };

  const handleRemoveItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
    setOpenItems(openItems.filter(itemId => itemId !== id));
  };

  const handleUpdateItem = (id: string, value: string) => {
    onChange(
      items.map(item =>
        item.id === id ? { ...item, [valueKey]: value } : item
      )
    );
  };

  const sortedItems = [...items].sort((a, b) => a.array_index - b.array_index);

  // Sprawdź czy wartości są długie (obiekty z wieloma polami)
  const isComplexItem = sortedItems.length > 0 &&
    (sortedItems[0][valueKey] as string).length > 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Elementy tablicy ({items.length})</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddItem}
          disabled={disabled}
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj element
        </Button>
      </div>

      {sortedItems.length === 0 ? (
        <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
          Brak elementów. Kliknij "Dodaj element" aby utworzyć pierwszy.
        </div>
      ) : (
        <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
          {sortedItems.map((item, index) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-medium">Element {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item.id);
                    }}
                    disabled={disabled}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {isComplexItem ? (
                    <Textarea
                      value={item[valueKey] as string}
                      onChange={(e) => handleUpdateItem(item.id, e.target.value)}
                      disabled={disabled}
                      rows={6}
                      className="font-mono text-sm"
                      placeholder="Wprowadź wartość..."
                    />
                  ) : (
                    <Input
                      value={item[valueKey] as string}
                      onChange={(e) => handleUpdateItem(item.id, e.target.value)}
                      disabled={disabled}
                      placeholder="Wprowadź wartość..."
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
