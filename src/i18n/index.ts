import ptBR from './pt-BR';
import en from './en';
import es from './es';
import fr from './fr';
import de from './de';
import it from './it';
import ru from './ru';
import zh from './zh';
import ja from './ja';
import ko from './ko';
import ar from './ar';
import hi from './hi';
import type { Language } from '@/lib/i18n';

const translations: Record<Language, Record<string, string>> = {
  'pt-BR': ptBR,
  en,
  es,
  fr,
  de,
  it,
  ru,
  zh,
  ja,
  ko,
  ar,
  hi,
};

export default translations;
