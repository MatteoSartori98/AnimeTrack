# AnimeTrack - Documentazione del Progetto

## Descrizione

AnimeTrack è un applicazione web sviluppata con React che permette agli utenti di navigare, cercare e interagire con una vasta collezione di anime. L'applicazione permette di autenticarsi, visualizzare nel dettaglio gli anime, chattare in tempo reale, scrivere recensioni e la possibilità di salvare gli anime preferiti per gli utenti autenticati.

## API

Il progetto utilizza l'API di Jikan (https://docs.api.jikan.moe/) per ottenere dati sugli anime e Supabase come BaaS per autenticazione, archiviazione del database e chat in tempo reale.

## Stile

L'applicazione è realizzata esclusivamente in CSS Modules puro per lo styling specifico dei componenti.

## Pagine

1. **Home Page** - Mostra anime in evidenza, anime popolari e le ultime uscite
2. **Pagina Dettaglio** - Visualizza informazioni complete su un anime specifico, inclusi descrizione, recensioni e screenshot
3. **Risultati di Ricerca** - Mostra anime filtrati in base ai criteri di ricerca dell'utente come genere e nome
4. **Pagine di Autenticazione** - Pagine per registrazione e accesso
5. **Pagina Profilo** - Visualizza le informazioni dell'utente e gli anime salvati tra i preferiti e le recensioni fatte

## User Interactions

### Utenti non autenticati:

1. Navigare tra tutti gli anime presenti nella piattaforma
2. Cercare anime per nome
3. Filtrare anime per vari criteri
4. Visualizzare informazioni dettagliate su anime specifici
5. Leggere recensioni di altri utenti
6. Registrarsi con email e password

### Utenti autenticati:

1. Creare e gestire una lista di anime preferiti
2. Inviare e gestire recensioni
3. Chattare con altri utenti nella chat in tempo reale
4. Visualizzare e aggiornare le informazioni del proprio profilo

## Context

L'applicazione utilizza diversi Context Provider React:

1. **Session Context** - Gestisce lo stato di autenticazione dell'utente
2. **Favourites Context** - Gestisce la lista degli anime preferiti dell'utente
3. **Reviews Context** - Gestisce i dati delle recensioni
4. **Avatar Context** - Gestisce le immagini del profilo utente

## Dipendenze

Lista delle dipendenze usate nel progetto:

- "@supabase/supabase-js"
- "@tanstack/react-query"
- "@vercel/analytics"
- "date-fns"
- "lucide-react"
- "react"
- "react-dom"
- "react-hot-toast"
- "react-loading"
- "react-router"
- "swiper"
- "uuid"

## Funzionalità principali

1. **Sistema di autenticazione** - Registrazione e Accesso
2. **Chat in tempo reale** - Funzionalità di chat in tempo reale
3. **Filtro anime** - Filtrare per genere e/o per nome
4. **Design responsive** - Si adatta a diverse dimensioni di schermo
5. **Recensioni utente** - Possibilità di leggere e scrivere recensioni degli anime
6. **Gestione preferiti** - Salvare anime preferiti

L'applicazione è costruita con pratiche React moderne, inclusi hooks, Context API e design a componenti, risultando in un codice pulito e manutenibile.

## Struttura di progetto

La struttura del progetto è organizzata con:

- Cartella **components** per elementi UI riutilizzabili (Navbar, Banner, Chat, Filter, ecc.)
- Cartella **pages** per le viste principali dell'applicazione
- Cartella **context** per la gestione dello stato
- Cartella **guards** per i componenti di protezione delle rotte
- Cartella **services** per l'integrazione delle API
- Cartella **utils** per funzioni di supporto

## Link del progetto

- Link: https://animetrack.vercel.app/
