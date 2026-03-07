# Connie's Messages — Stock Checker App

## Files
- `index.html` — main app (all-in-one)
- `manifest.json` — PWA install config
- `sw.js` — service worker (offline support)
- `icon-192.png` / `icon-512.png` — app icons

## ⚠️ IMPORTANT: Keeping Firebase Config Private

The Firebase config is currently embedded in `index.html`. This is fine for private hosting, but **never push to a public GitHub repo**.

### Option A — Host on Netlify (Recommended, free)
1. Create account at netlify.com
2. Drag & drop the folder to deploy
3. Your app is live at a private URL
4. No GitHub needed

### Option B — If you use GitHub (private repo only)
1. Create a **PRIVATE** GitHub repository
2. The `.gitignore` already excludes `.env` files
3. **Never make the repo public** while firebaseConfig is in index.html

### Option C — Restrict your Firebase API Key (Best practice)
1. Go to console.cloud.google.com
2. APIs & Services → Credentials
3. Click your API key → Application restrictions
4. Set "HTTP referrers" to your domain only (e.g. `https://yoursite.netlify.app/*`)
5. This means the key only works from your site, not from anyone else's

## Installing on Phone

### iPhone (Safari only)
1. Open the app URL in Safari
2. Tap the Share button (box with arrow)
3. Scroll down → "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open in Chrome
2. Tap the three dots menu
3. "Add to Home Screen" (or Chrome may show a banner automatically)

## Features
- Daily stock check with carry-forward for unbought items
- Shopping list grouped by location
- History log of past days
- Offline support (data cached locally + synced to Firebase when online)
- Multi-device sync via Firebase Firestore
- Duplicate item detection
- Low stock / restock warnings
- Theme switcher (Settings tab)
