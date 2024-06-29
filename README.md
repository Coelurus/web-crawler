# Epicc webcrawler
Autoři: Adam Řeřicha, Filip Vopálenský

## Architektura (velmi velmi zjednodušeně)
- Backend
  - Technologie - Java Spring Boot + spousta dependencies
  - REST přístup
    - `GET` požadavky na vypsání databáze
      - `/tag`
      - `/record`
    - `POST` požadavky na vložení nového prvku do databáze
      - `/tag`
      - `/record`
  - Dočasné statické formsy na tvoření `POST` požadavků a testování databáze
      - `form.html`
      - `tag.html`
- Databáze
  - PostgreSQL
  - Momentálně 2 tabulky
    - Websiterecords
        ```sql
        CREATE TABLE WebsiteRecords (
            id serial PRIMARY KEY,
            url varchar(255) NOT NULL,
            regex varchar(255),
            day smallint NOT NULL,
            hour smallint NOT NULL,
            minute smallint NOT NULL,
            label varchar(255) NOT NULL,
            active boolean NOT NULL
        );
        ```
    - Tags
        ```sql  
        CREATE TABLE Tags (
            id serial PRIMARY KEY,
            name varchar(255) NOT NULL,
            wr_id bigint NOT NULL
        );
        ```
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