# Webcrawler project
Autoři: Adam Řeřicha, Filip Vopálenský

## Architektura (velmi velmi zjednodušeně)
- Backend
  - Technologie - Java Spring Boot
  - REST přístup
  - API definováno ve [swagger.yaml](documentation/swagger.yaml)
    - Možno zobrazit [zde](https://editor.swagger.io/) nebo ve VSCode, atd...

- Databáze
  - PostgreSQL
  - 6 tabulek [zde](database/)

- Frontend
  - Technologie - React ??
  - Zatím neexistuje

## Spuštění
- Databáze se sama postaví a vloží do sebe asi jeden testovací řádek pomocí `docker compose up` z `docker-compose.yaml`
- Backend jsem ještě nestihl přidat do dockeru (mám málo paměti na C: disku idk proč). Plus si myslím, že to bude pomalé na testování. Tzn. momentálně spouštím backend prostě z InteliJ Idea.
  - Fun fact - má to hot reload (nebo něco takového), takže není nutné pořád vypínat a zapínat projekt při úpravě

## Poznámka pod čarou
- Pardon je to momentálně dost bordel
- Nejsou tam ještě komentáře (dodám)
- Idk jestli to někde nepadá , je to dost clunky
- Kdyžtak piš, snad poradím