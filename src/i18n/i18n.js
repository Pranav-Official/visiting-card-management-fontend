import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import 'intl-pluralrules';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "Contacts": "Contacts",
      "Profile":"Profile",
      "Search" : "Search Contacts"
    }
  },
  ja: {
    translation: {
      "Contacts": "コンタック",
      "Profile":"プロフィール",
      "Search":"連絡先の検索"
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;