import en from './en';
import ptBR from './pt-BR';
import es from './es';
import fr from './fr';
import de from './de';
import it from './it';
import zh from './zh';
import ja from './ja';
import ko from './ko';
import hi from './hi';
import type { Language } from '@/lib/i18n';

const translations: Record<Language, Record<string, string>> = {
  en,
  'pt-BR': ptBR,
  es,
  fr,
  de,
  it,
  zh,
  ja,
  ko,
  hi,
};

export default translations;
