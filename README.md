# Web Radio

A lightweight, single-page internet radio player. Pick a station from the presets and it starts streaming right away. It is built with plain HTML, CSS and JavaScript (no frameworks, no build step) and can be installed as a PWA.

Live demo: https://bogdanandrei90.github.io/webradio/radio.html

## Features

- **One-tap presets**: a curated list of stations; each card shows a `Ready` / `Live` status pill.
- **Now Playing card**: appears when a station is selected, showing the station name, live status (Buffering, Live stream active, Paused) and country/genre chips.
- **Playback controls**: Play/Pause and Refresh buttons (Refresh reconnects a stalled stream).
- **Volume control**: slider with a percentage readout (default 68%).
- **Dark / light theme**: toggle in the top-right corner, dark by default.
- **Responsive layout**: two-column player on desktop, stacked layout on tablets and phones.
- **Installable PWA**: web app manifest, iOS home-screen meta tags and a service worker that caches the app shell for offline loading.

## Stations

| Station | Country | Genre |
|---|---|---|
| MegaStar FM | Spain | Pop |
| Stella FM | Italy | Pop |
| Dance FM | Romania | Electronic |
| Off Radio | Greece | Lounge |
| Capital FM | UK | Chart |
| Vanilla Smooth Radio | Greece | Smooth |
| Vanilla Deep Radio | Greece | Deep House |
| ManCode Radio | Greece | Variety |
| Europa FM | Romania | Mainstream |
| MC2 | Italy | Variety |
| Antenne Bayern | Germany | Variety |

## Project structure

```
webradio/
├── radio.html      # The app: markup, styles and player logic
├── sw.js           # Service worker (app-shell caching, streams bypass the cache)
├── manifest.json   # PWA manifest
└── favicon.svg     # App icon
```

## Running locally

Serve the folder with any static web server, for example:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/radio.html.

Opening the file directly (`file://`) also works, but the service worker is skipped in that case.

## Adding a station

1. Add a preset button to the `#presetList` in `radio.html`:

   ```html
   <button class="preset" type="button" data-station="My Station" data-url="https://example.com/stream.mp3">
     <span class="preset-main">
       <span class="preset-icon">&#9835;</span>
       <span class="preset-copy">
         <span class="preset-name">My Station</span>
         <span class="preset-sub">Short description</span>
       </span>
     </span>
     <span class="pill">Ready</span>
   </button>
   ```

2. Optionally add the country and genre chips in the `stationMeta` object in the script:

   ```js
   'My Station': { country: 'Italy', flag: '<flag emoji>', genre: 'Pop' },
   ```

### Stream requirements

- **Use an `https://` stream URL.** The app is served over HTTPS (GitHub Pages), so browsers block or force-upgrade `http://` streams, which then fail to play.
- MP3 and AAC streams play in all modern browsers. HLS (`.m3u8`) streams play natively in Safari (macOS and iOS); other browsers need a library such as hls.js.
- **To find a station's stream URL**, open its web player with the browser dev tools open, then check the Network tab (filter by Media) or run this in the Console:

  ```js
  [...document.querySelectorAll('audio,video')].map(e => e.currentSrc || e.src)
  ```

## Deployment

The app is hosted on GitHub Pages from the `main` branch. After changing `radio.html` or `sw.js`, bump `CACHE_NAME` in `sw.js` (for example `radio-v2` to `radio-v3`) so installed copies pick up the new version, then hard-reload the page.
