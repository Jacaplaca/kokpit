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
    REGISTER_USED: "Podany email jest już wykorzystany"
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
    REGISTER_USED: "Email is used"
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
