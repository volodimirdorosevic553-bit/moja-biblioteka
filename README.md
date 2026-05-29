# Moja Biblioteka

Prosta aplikacja webowa przygotowana jako projekt semestralny z przedmiotu „Wprowadzenie do technologii internetowych”.

**Autor:** Volodymyr Doroshevych  
**Numer indeksu:** 77442

Aplikacja pozwala na:

- dodawanie książek,
- wyświetlanie listy książek,
- wyświetlanie szczegółów książki,
- edytowanie książek,
- usuwanie książek,
- wyszukiwanie po tytule lub autorze,
- zapisywanie danych w Firebase Realtime Database.

## Technologie

- HTML
- CSS
- JavaScript
- Firebase Realtime Database
- GitHub Pages

## Struktura plików

- `index.html` — struktura strony, formularz, lista książek i okno szczegółów.
- `style.css` — wygląd aplikacji.
- `script.js` — logika aplikacji i połączenie z Firebase.
- `README.md` — opis projektu.

## Jak uruchomić lokalnie

1. Pobierz albo sklonuj repozytorium.
2. Otwórz plik `index.html` w przeglądarce.
3. Jeżeli Firebase jest poprawnie skonfigurowany, aplikacja będzie zapisywać dane w bazie online.

## Jak skonfigurować Firebase

1. Wejdź na stronę Firebase Console.
2. Utwórz nowy projekt, np. `moja-biblioteka`.
3. Dodaj aplikację webową.
4. Skopiuj konfigurację Firebase.
5. Otwórz plik `script.js`.
6. Zamień przykładowe wartości w `firebaseConfig` na swoje dane.

Przykład miejsca do uzupełnienia:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

## Firebase Realtime Database

Po utworzeniu projektu trzeba włączyć Realtime Database.

Na czas projektu studenckiego można ustawić uproszczone reguły testowe:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Uwaga: takie reguły są dobre tylko do prostego projektu szkolnego/testowego. W prawdziwej aplikacji trzeba dodać logowanie i zabezpieczenia.

## Jak wdrożyć na GitHub Pages

1. Wrzuć pliki projektu do repozytorium na GitHubie.
2. Wejdź w `Settings` repozytorium.
3. Wybierz `Pages`.
4. W sekcji `Build and deployment` wybierz gałąź `main` i folder `/root`.
5. Zapisz ustawienia.
6. Po chwili GitHub pokaże link do działającej strony.

## Co można powiedzieć przy prezentacji

To jest prosta aplikacja webowa do zarządzania listą książek. Użytkownik może dodać książkę przez formularz, a dane trafiają do Firebase Realtime Database. Aplikacja pobiera książki z bazy i pokazuje je w formie kart. Każda karta ma przyciski do pokazania szczegółów, edycji i usuwania. Dzięki Firebase dane nie znikają po odświeżeniu strony, bo są zapisane w bazie online.
