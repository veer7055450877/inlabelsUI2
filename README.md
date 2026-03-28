# InLabels Uninstall Feedback Page

A Svelte + Vite project with **6 distinct uninstall feedback page variants** that are randomly served on load — built for A/B testing which emotional tone retains the most feedback submissions.

---

## Project Structure

```
uninstall-feedback/
├── index.html
├── package.json
├── vite.config.js
├── svelte.config.js
└── src/
    ├── main.js                 ← App entry point
    ├── App.svelte              ← Root: picks random variant, sends /save-email
    ├── styles/
    │   └── global.css          ← Resets, keyframes, shared atoms
    ├── lib/
    │   ├── data.js             ← All reasons, reactions, meme texts
    │   └── api.js              ← Fetch wrappers for /save-email & /update-feedback
    └── variants/
        ├── Emotional.svelte    ← 💔 Soft pastel glassmorphism, heartfelt tone
        ├── Funny.svelte        ← 😅 Neo-brutalist yellow/orange, roast tone
        ├── Professional.svelte ← 📊 Split card, blue SaaS dashboard feel
        ├── Retention.svelte    ← 🚀 Dark purple, feature pitch + two-step flow
        ├── Minimal.svelte      ← ⚡ Pure white, emoji scale, zero friction
        └── Meme.svelte         ← 💀 Dark terminal, dynamic meme card
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
#    Add ?email=test@example.com to simulate URL params
#    Add ?v=1.2.3 to pass extensionVersion
```

---

## URL Parameters

| Param   | Description                          | Example                     |
|---------|--------------------------------------|-----------------------------|
| `email` | User email — used as unique key in Google Sheets | `?email=user@example.com` |
| `v`     | Extension version for analytics      | `?v=2.1.0`                  |

---

## Backend API

Two endpoints are called automatically:

### `POST /save-email`
Called **on page load** — creates/records a row in Google Sheets.

```json
{
  "email": "user@example.com",
  "variant": "funny",
  "userAgent": "Mozilla/5.0 ...",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "extensionVersion": "2.1.0",
  "screenWidth": 1440,
  "language": "en-US"
}
```

### `POST /update-feedback`
Called **on form submit** — updates the same row using email as the unique key.

```json
{
  "email": "user@example.com",
  "reason": "bugs",
  "otherText": "",
  "emojiRating": 1,
  "variant": "funny",
  "userAgent": "...",
  "timestamp": "..."
}
```

---

## The 6 Variants

| # | File | Theme | Palette | Font |
|---|------|-------|---------|------|
| 0 | `Emotional.svelte` | 💔 "Wait... leaving already?" | Pink/Purple glassmorphism | Nunito |
| 1 | `Funny.svelte` | 😅 "Did we spam you like your ex?" | Yellow/Orange neo-brutalism | Syne |
| 2 | `Professional.svelte` | 📊 "We're sorry to see you go" | White + Blue split card | DM Sans |
| 3 | `Retention.svelte` | 🚀 "Wait! Before you go..." | Dark purple, two-step | Syne |
| 4 | `Minimal.svelte` | ⚡ "Quick 5-sec feedback" | Pure white, emoji scale | DM Sans |
| 5 | `Meme.svelte` | 💀 "You uninstalling us?" | Dark terminal + meme card | Space Mono |

---

## A/B Analytics

The `variant` key in every API payload lets you track:
- Which variant has the highest **submission rate**
- Which variant gets **most "other" text** (richest feedback)
- Which variant has the fastest **time-to-submit**

All variants log: `userAgent`, `timestamp`, `extensionVersion`, `screenWidth`, `language`.

---

## Build for Production

```bash
npm run build
# Output in /dist — static files ready to deploy anywhere
```
