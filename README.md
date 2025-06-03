# Webcrawler project
Autoři: Adam Řeřicha, Filip Vopálenský

## Architektura (velmi velmi zjednodušeně)
- Backend
  - Technologie - Java Spring Boot
  - REST přístup
  - API definováno ve [swagger.yaml](documentation/swagger.yaml)

- Databáze
  - PostgreSQL
  - 6 tabulek [zde](database/)

- Frontend
  - Technologie - React
  - Doptává se BE na REST endpointech

## Spuštění
- Pomocí `docker compose up` z `docker-compose.yaml`
- Databáze se sama postaví a vloží do sebe jeden testovací řádek
- BE závisí na databázi a spustí se až bude db zdravá
- Jako poslední se spouští FE, která závisí na BE

## GraphQL
- Přístup na `<backend-url>:<server-port>/graphiql`
- Default `http://localhost:8080/graphiql`