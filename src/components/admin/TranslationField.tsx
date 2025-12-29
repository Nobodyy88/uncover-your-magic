import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TranslationFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Komponent do edycji pojedynczego pola tłumaczenia
 * Automatycznie wybiera Input lub Textarea na podstawie długości tekstu
 */
export const TranslationField = ({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: TranslationFieldProps) => {
  // Używaj Textarea dla dłuższych tekstów (>100 znaków) lub wieloliniowych
  const isLongText = value.length > 100 || value.includes('\n');

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      {isLongText ? (
        <Textarea
          id={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className="font-mono text-sm"
        />
      ) : (
        <Input
          id={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  );
};
