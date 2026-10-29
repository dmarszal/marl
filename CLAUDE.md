# MARL – Park Handlowy Raciąż (marl.pl)

Statyczna strona parku handlowego: 6 stron HTML, Tailwind v4, odrobina JS. Bez frameworka i bez szablonów:
nagłówek i stopka są skopiowane w każdym pliku HTML, więc zmiana w nich = zmiana w 6 plikach.

## Pliki
- `index.html`, `sklepy.html`, `contact.html`, `topaz.html`, `rossmann.html`, `pepco.html`
  (strony sklepów mają identyczny układ – zmieniaj je razem)
- `src/styles.css` – **jedyne źródło stylów**: tokeny w `@theme`, komponenty przez `@apply`
- `assets/css/style.css` – **generowany, w `.gitignore`**. Po `git switch`/`clone` trzeba go zbudować
- `assets/js/main.js` – menu mobilne, zmniejszanie nagłówka po przewinięciu, slajdy hero,
  wjazd `.reveal`, rok w stopce
- `.github/workflows/pages.yml` – build i publikacja na GitHub Pages przy pushu do `main`

## Komendy
```bash
npm ci
npm run build    # src/styles.css -> assets/css/style.css
npm run dev      # to samo z --watch
python3 -m http.server 8765   # podgląd: http://localhost:8765/
```
Przeglądarka mocno cache'uje CSS/HTML – po zmianach Ctrl+Shift+R.
Rozszerzenie Claude in Chrome nie ma dostępu do `file://`, używaj serwera na localhost.

## Publikacja
Push do `main` → GitHub Actions buduje CSS i publikuje (Pages: Source = GitHub Actions).
Sprawdzenie: `https://api.github.com/repos/dmarszal/marl/actions/runs?per_page=3` (repo publiczne, bez tokena).
Push w tym repo idzie przez HTTPS z lokalnym credential helperem (skonfigurowany w `.git/config`,
nie globalnie). Nie dotykaj globalnej konfiguracji SSH/git użytkownika.

## Zasady projektu (decyzje właściciela z audytu UI, 2026-10)
- Kolory tylko z tokenów w `@theme` (domyślna paleta Tailwinda jest wyczyszczona):
  `brand` #0c686e (turkus z logo), `gold` #d7bf8e (tylko akcent, nie sygnalizuje stanu),
  4 szarości `ink` / `muted` / `line` / `surface`; `ink` to też jedyna ciemna powierzchnia (pasek info, stopka).
- Jeden główny przycisk (`.btn`) na sekcję; brak przycisków „drugorzędnych”.
- Nagłówek `sticky`, logo 75 px (po przewinięciu 44 px; mobile 45/32 px), logo i menu w jednym wierszu na telefonie.
  Okruszki tylko na stronach sklepów, wewnątrz nagłówka. Aktywne menu = podkreślenie + `aria-current="page"`.
- Hero: jedna nakładka `bg-black/55` wszędzie (kontrast tekstu ≥ 4,5:1 zmierzony na zdjęciach).
- Treść musi być widoczna bez JS: animacje tylko pod `.js` (klasa ustawiana inline w `<head>`)
  i `prefers-reduced-motion: no-preference`.
- Cień tylko na klikalnych kafelkach; fala pod hero i unoszenie kart zostają (świadoma decyzja).
- Dane: brak godzin „całego parku” (tylko godziny sklepów), brak numerów telefonu (wszystkie były placeholderami).
  „100 miejsc parkingowych” i „paczkomaty 24/7” – potwierdzone przez właściciela.
  Adres w linkach Google Maps: „Zawoda 34, 09-140 Raciąż”.
- Teksty marketingowe zostają bez zmian, chyba że właściciel poprosi.
- Odrzucone: przeprojektowanie w stylu taste-skill (duży nagłówek do lewej, lista sklepów zamiast kafelków,
  usunięcie wszystkich linii i cieni). Nie proponuj ponownie bez pytania.

## Pułapki
- Nie używaj klasy `container` – koliduje z utility Tailwinda `container` (max-width 1280 px) i rozjeżdża marginesy.
- Przy zmianie godzin sklepu popraw je w trzech miejscach: kafelek na `index.html`, tabela na stronie sklepu
  i `openingHoursSpecification` w JSON-LD tej strony.
- `.site-header > nav:not(.breadcrumbs)` – w nagłówku są dwa `<nav>` (menu i okruszki); nie upraszczaj selektora.
- Commity: krótkie, po angielsku, w trybie rozkazującym (jak w historii repo).
