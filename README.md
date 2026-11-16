# 4dtruth

Website for **4dtruth**, the studio of Seun Okunola: a multidisciplinary artist, painter and colourist based in Lagos, Nigeria.

Live at https://4dtruth.vercel.app. Plain HTML, CSS and JavaScript with no build step.

## Pages

| Page | File | What's on it |
|---|---|---|
| Home (landing) | `index.html` | Hero that opens out of the wordmark preloader; video hero with call-to-action buttons; corner tile that grows into a full reel on scroll; stats; about teaser; selected work; series accordion; artist statements slider; commission process; More Work marquee |
| Work | `work.html` | Every painting, filtered by theme (`?theme=ojude` etc.); grid and list views (list has a cursor-following preview) |
| Artwork | `piece.html?w=<slug>` | One painting on a gallery wall, its details, WhatsApp enquiry, previous/next, a full-width "Next work" panel, related works |
| About | `about.html` | Statement, studio film that opens on scroll, stats, disciplines, practice, themes |
| Contact | `contact.html` | Contact methods, live Lagos clock, and an enquiry form that opens WhatsApp with the message pre-filled (`?w=<slug>` preselects a painting) |

## Shared design and motion

The navbar, mobile menu, footer and page transitions are added to every page by `assets/js/core.js`. The motion is modelled on [ouiwill.com](https://www.ouiwill.com/):
- **Navbar:** no background, just the logo and menu. It uses a difference blend so it stays readable over any colour, and hides on scroll down.
- **Preloader (first visit per session):** a giant wordmark with paintings flickering inside the letters, a live counter and progress line.
- **Page transitions:** a dark panel wipes over the page on leaving and wipes away on arrival.
- **Text:** lines wipe in as they enter the screen, and some text fills from grey to ink as you scroll.
- **Hovers:** a band sweeps down through link text.
- **Images:** cards reveal with a clip and drift slightly as you scroll (parallax). Numbers count up.
- **Background:** a painter's-canvas weave behind every page, plus an animated film-grain overlay.
- **Footer:** a big commission call to action, menu and contact links, a live Lagos clock, and a giant wordmark filled with moving paint that changes on hover.
- **Smooth scrolling:** via [Lenis](https://github.com/darkroomengineering/lenis) (MIT), stored in `assets/vendor/`.

## Structure

```
index.html, work.html, piece.html, about.html, contact.html
styles.css              all styles
assets/js/data.js       artworks, themes and contact details  <- edit content here
assets/js/core.js       shared nav/footer/transitions/motion
assets/js/<page>.js     page-specific behaviour
assets/works/           artwork images: cropped from the Instagram screenshots and
                        AI-upscaled (Real-ESRGAN x4), 1600px; thumbs/ holds 800px copies
assets/media/           studio video + poster
assets/texture/         canvas weave + film grain
assets/reference/       original screenshots and video
assets/vendor/          Lenis
```

## Adding a painting

1. Add a JPG to `assets/works/`.
2. Add an entry to `WORKS` in `assets/js/data.js` with the same `slug`, plus a `theme` (one of the `THEMES` ids).

It then appears automatically on the Work page, in the marquee and in the contact form, and gets its own artwork page.

## Run locally

```bash
python3 -m http.server 8000
```
