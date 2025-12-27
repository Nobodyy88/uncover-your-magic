import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const FlagPL = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12" className="w-5 h-4 rounded-sm overflow-hidden shadow-sm">
    <rect width="16" height="6" fill="#fff"/>
    <rect y="6" width="16" height="6" fill="#dc143c"/>
  </svg>
);

const FlagEN = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-4 rounded-sm overflow-hidden shadow-sm">
    <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
    <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const FlagDE = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" className="w-5 h-4 rounded-sm overflow-hidden shadow-sm">
    <rect width="5" height="1" fill="#000"/>
    <rect y="1" width="5" height="1" fill="#D00"/>
    <rect y="2" width="5" height="1" fill="#FFCE00"/>
  </svg>
);

const languages = [
  { code: "pl" as const, label: "Polski", Flag: FlagPL },
  { code: "en" as const, label: "English", Flag: FlagEN },
  { code: "de" as const, label: "Deutsch", Flag: FlagDE },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 px-2 h-9 text-muted-foreground hover:text-foreground"
        >
          <currentLang.Flag />
          <span className="text-sm font-medium">{currentLang.code.toUpperCase()}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              language === lang.code ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <lang.Flag />
            <span className="text-sm">{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
