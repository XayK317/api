# Character Lookup

A React kiosk for browsing the [Rick and Morty API](https://rickandmortyapi.com/).

## Run locally

Use Node.js 20.19 or later in the 20.x series, or Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Search by name, filter by status, use the page buttons to browse, and select a character to see their details. If a request fails, use **Try again**.

## Build and deploy

Run `npm run build` to create the production site in `dist`. To deploy on Netlify, import the project and use `npm run build` as the build command and `dist` as the publish directory. The API does not require an API key.
