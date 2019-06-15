const strings = {
  pl: {
    LOGIN_BUTTON: "Zaloguj się",
    LOGIN_EMAIL: "Adres email",
    LOGIN_PASS: "Hasło",
    LOGIN_WRONG_PASS: "Nieprawidłowe hasło",
    LOGIN_WRONG_EMAIL: "Nieprawidłowy email",
    LOGIN_EMAIL_FIELD_LABEL: "Adres email podany przy rejestracji",
    LOGIN_EMAIL_GIVE_CORRECT: "Podaj prawidłowy adres email",
    LOGIN_ERROR: "Niepoprawny email lub hasło.",
    LOGIN_RESET: "Błędne hasło, czy chcesz je zresetować?",
    LOGIN_RESET_YES: "Tak",
    LOGIN_RESET_NO: "Nie",
    TOP_NAV_LOGIN: "Logowanie",
    TOP_NAV_LOGOUT: "Wyloguj się",
    NAME: "Imię",
    SURNAME: "Nazwisko",
    ROLE: "Rola",
    USERS_EDITING: "Edycja użytkowników i uprawnienia",
    ADD: "Dodaj",
    SORT: "Sortuj",
    CHOOSE: "wybrano",
    SUM: "Suma",
    REMOVE: "Usuń",
    EDIT: "Edytuj",
    SEARCH: "Szukaj",
    PAGINATION_NEXT: "Następna",
    PAGINATION_PREV: "Poprzednia",
    PAGINATION_LABEL: "Elementów na stronie",
    USER_ADD_LABEL: "Dodaj użytkownika",
    CONFIRM_PASS: "Potwierdź hasło",
    CANCEL: "Anuluj",
    ITEM: "Towar/Usługa",
    UNIT: "Jednostka",
    REGISTER_USED: "Podany email jest już wykorzystany",
    REGISTER_PASS_5: "Hasło powinno mieć conajmniej 6 znaków",
    REGISTER_PASS_DIFF: "Hasła nie mogą się różnić",
    REGISTER_TOOSHORT: "Hasło powinno mieć conajmniej 6 znaków. Brakuje:",
    REGISTER_LONGERBETTER:
      "Im dłuższe i bardziej skomplikowane hasło tym lepiej",
    REGISTER_IDENTICAL: "Hasła są identyczne",
    USER_ADD_CONFIRM_BUTTON: "Załóż konto pracownika",
    USER_ADD_CONFIRM_BUTTON_DEMO: "DEMO - brak możliwości zakładania kont",
    PRODUCTS_TABLE_TITLE: "Produkty/usługi w systemach premiowych",

    CHANNELS_NOCONFIG: "Brak konfiguracji",
    CHANNELS_TABLE_TITLE: "Kanały/systemy premiowe",
    CHANNELS_IN_ALL: " we wszystkich systemach",

    CHANNELS_FORM_INPUT_NAME: "Nazwa kanału/systemu prowizyjnego",
    IN: "w",
    CONFIG_TABLE_LABEL: "Lista produktów/usług",
    CONFIG_FORM_LABEL: "Edytuj prowizje dla",
    SINCE: "Od",
    TO: "Do",
    TYPE: "Typ",
    BONUS: "Prowizja",
    ITEMNAME: "Nazwa",
    CONFIGURATION: "Konfiguracja",

    CONFIG_MISSING_ITEMS:
      "Brak usług/towarów przypisanych do systemu prowizyjnego.",
    CONFIG_MISSING_INSTRUCTION:
      "Aby dodać elementy premiowane do poszczegółnych systemów udaj się w zakładkę 'Produkty' i tam przy produkcie kliknij na wybrany system.",
    TYPE_MARGIN: "% marży",
    TYPE_FLAT_RATE: "stawka"
  },
  en: {
    LOGIN_BUTTON: "Login",
    LOGIN_EMAIL: "Email",
    LOGIN_PASS: "Password",
    LOGIN_WRONG_PASS: "Incorrect Password",
    LOGIN_WRONG_EMAIL: "User not found",
    LOGIN_EMAIL_FIELD_LABEL: "Email",
    LOGIN_EMAIL_GIVE_CORRECT: "Type correct email address",
    LOGIN_ERROR: "Incorrect credentials",
    LOGIN_RESET: "Incorrect password. Do you want to reset your password?",
    LOGIN_RESET_YES: "Yes",
    LOGIN_RESET_NO: "No",
    TOP_NAV_LOGIN: "Login",
    TOP_NAV_LOGOUT: "Logout",
    NAME: "Name",
    SURNAME: "Surname",
    ROLE: "Role",
    USERS_EDITING: "Editing users and credentials",
    ADD: "Add",
    SORT: "Sort",
    CHOOSE: "marked",
    SUM: "Sum",
    REMOVE: "Remove",
    EDIT: "Edit",
    SEARCH: "Search",
    PAGINATION_NEXT: "Next page",
    PAGINATION_PREV: "Previous",
    PAGINATION_LABEL: "Elements on page",
    USER_ADD_LABEL: "Add user",
    CONFIRM_PASS: "Confirm password",
    CANCEL: "Cancel",
    ITEM: "Item",
    UNIT: "Unit",
    REGISTER_USED: "Email is used",
    REGISTER_PASS_5: "Password should have at least 6 characters",
    REGISTER_PASS_DIFF: "Passwords shouldn't be different",
    REGISTER_TOOSHORT: "Should have at least 6 characters. Missing:",
    REGISTER_LONGERBETTER: "The longer password, the better",
    REGISTER_IDENTICAL: "Passwords are identical",
    USER_ADD_CONFIRM_BUTTON: "Create an account",
    USER_ADD_CONFIRM_BUTTON_DEMO: "DEMO - creating account disabled",
    PRODUCTS_TABLE_TITLE: "Items in bonus systems",

    CHANNELS_NOCONFIG: "No configuration",
    CHANNELS_TABLE_TITLE: "Bonus systems",
    CHANNELS_IN_ALL: " in all systems",

    CHANNELS_FORM_INPUT_NAME: "Bonus system name",
    IN: "in",
    CONFIG_TABLE_LABEL: "List of items",
    CONFIG_FORM_LABEL: "Edit bonuses for",
    SINCE: "Since",
    TO: "To",
    TYPE: "Type",
    BONUS: "Bonus",
    ITEMNAME: "Name",
    CONFIGURATION: "Configuration",
    CONFIG_MISSING_ITEMS: "No assigned items for bonus system.",
    CONFIG_MISSING_INSTRUCTION:
      "In order to add items to bonus system go to 'Items' and pick desired systems for specyfic item.",
    TYPE_MARGIN: "% of margin",
    TYPE_FLAT_RATE: "flat rate"
  }
};

export const getString = (stringId, language) => {
  if (!language) {
    console.warn("getString, language is undefined");
    return "";
  }
  if (!strings[language][stringId]) {
    const alternativeLanguage = language === "pl" ? "en" : "pl";
    if (!strings[alternativeLanguage][stringId]) {
      console.warn(
        "getString, string not found in any language. ID: ",
        stringId
      );
      return "";
    }
    console.warn(`getString, string not found in ${language}. ID: `, stringId);
    return strings[alternativeLanguage][stringId];
  }
  return strings[language][stringId];
};
