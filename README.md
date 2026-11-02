# Wist Labs

The website for Wist Labs — an independent studio making apps and games.

## Preview

No build step or dependencies. Open `index.html` directly, or serve the folder locally:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Files

- `index.html` — the homepage
- `contact.html` — contact page
- `styles.css` — design system, layout, and animation
- `script.js` — navigation, scroll reveals, pointer glow, copy-email button
- `404.html` — custom not-found page
- `favicon.svg` — brand mark
- `assets/fonts/` — self-hosted Space Grotesk and IBM Plex Mono, with their OFL licences

## Content notes

The site intentionally shows no products, screenshots, release dates, stats, social links, or location. The homepage is kept deliberately short: hero and a factual Studio section. The contact page is minimal, with only the email and a copy button.

When real apps or games are ready, add them to the site and update the "Releases" fact in the Studio section. Keep the existing honesty rule: don't advertise anything that isn't real.

The footer says "No cookies. No trackers." That is true today because the site has no analytics, cookies, forms, or third-party requests. If you add any of those later, update that line.

## Deploy

Upload the folder as-is to any static host (GitHub Pages, Netlify, Cloudflare Pages, Vercel). `404.html` is picked up automatically by GitHub Pages, Netlify, and Cloudflare Pages.
