# Portal LT1 Frontend

Aplicatie React + Vite pentru administrarea documentelor interne (Assignment 1).

## Ce include

- Landing page (`/`) cu hero vizual si branding din assets
- Login (`/login`) si Register (`/register`) cu tranzitii functionale
- Documents master-detail (`/documente`) cu cautare, filtru, toggle de vizualizare si chart sumar
- Detalii document (`/documente/:id`)
- Formular creare (`/documente/adauga`) cu validare
- Formular editare (`/documente/:id/edit`) cu validare
- Cookie banner pentru preferinte si monitorizarea ultimei pagini accesate
- Ruta fallback pentru pagini inexistente

## Rulare locala

```powershell
npm install
npm run dev
```

## Teste

```powershell
npm run test
npm run test:e2e
```

