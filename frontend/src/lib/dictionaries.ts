import en from '../dictionaries/en.json';
import hi from '../dictionaries/hi.json';
import mr from '../dictionaries/mr.json';
import ta from '../dictionaries/ta.json';
import te from '../dictionaries/te.json';
import _or from '../dictionaries/or.json'; // 'or' is a reserved keyword in some contexts, using _or

const dictionaries: Record<string, any> = {
  en,
  hi,
  mr,
  ta,
  te,
  or: _or
};

export const getDictionary = (locale: string) => {
  return dictionaries[locale] || dictionaries['en'];
};
