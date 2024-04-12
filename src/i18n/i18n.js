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
      "Search" : "Search Contacts",
      "Logout":"Logout",
      "Change Password":"Change Password",
      "View Shared Contacts":"View Shared Contacts",
      "Total Contacts":"Total Contacts",
      "Add Phone Number":"Add Phone Number",
      "Add Job Title":"Add Job Title",
      "Add Company Name":"Add Company Name",
      "Fullname":"Fullname",
      "Enter Full Name":"Enter Full Name",
      "Email":"Email",
      "Enter Email":"Enter Email",
      "Password":"Password",
      "Enter Password":"Enter Password",
      "Confirm Password":"Confirm Password",
      "Sign Up":"Sign Up",
      "Already have an account?":"Already have an account?",
      "Don't have an account?":"Don't have an account?",
      "Login":"Login"
    }
  },
  ja: {
    translation: {
      "Contacts": "コンタック",
      "Profile":"プロフィール",
      "Search":"連絡先の検索",
      "Logout":"ログアウト",
      "Change Password":"パスワードを変更する",
      "View Shared Contacts":"共有連絡先を表示する",
      "Total Contacts":"連絡先の総数",
      "Add Phone Number":"電話番号を追加",
      "Add Job Title":"役職を追加",
      "Add Company Name":"会社名を追加",
      "Fullname":"フルネーム",
      "Enter Full Name":"フルネームを入力",
      "Email":"電子メール",
      "Enter Email":"メールアドレスを入力して",
      "Password":"パスワード",
      "Enter Password":"パスワードを入力する",
      "Confirm Password":"パスワードを認証する",
      "Sign Up":"サインアップ",
      "Already have an account?":"すでにアカウントをお持ちですか？",
      "Don't have an account?":"アカウントをお持ちでない場合は、",
      "Login":"ログイン"


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