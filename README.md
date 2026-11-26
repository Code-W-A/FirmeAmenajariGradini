This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Seed Județe + Localități (Sanity)

Scriptul `seed-locations-sanity` populează automat în Sanity:
- toate județele (inclusiv `Bucuresti` ca județ),
- toate municipiile și orașele pe județ,
- pentru București, localități doar `Sectorul 1..6`.

Rulare:

```bash
# simulare (fără scriere)
npm run seed:locations

# aplicare efectivă în Sanity
npm run seed:locations:write
```

Prerechizite:
- variabilele Sanity configurate în `.env.local` sau `.env`,
- token de scriere în `SANITY_API_WRITE_TOKEN` (fallback: `SANITY_API_READ_TOKEN`, dacă are drept de write).

## UX coordonate în Sanity Studio

În editorul de firmă (`company`), câmpul `coordinates` are autocomplete Google Places:
- introdu adresa și selectează sugestia,
- coordonatele se completează automat (`lat`/`lng`).
Notă: câmpul `coordinates` este ascuns, iar autocomplete este pe câmpul `address`.

Chei acceptate pentru Studio:
- `SANITY_STUDIO_GOOGLE_MAPS_API_KEY` (recomandat pentru Studio),
- fallback: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
