# 4dtruth

Portfolio website for **4dtruth**, the studio of Seun Okunola: a multidisciplinary artist, painter and colourist based in Lagos, Nigeria.

The design and motion are modelled on [ouiwill.com](https://www.ouiwill.com/):
- **Loader:** a 3D ring of paintings spins, then the hero opens out of a small centre frame.
- **Hero:** the headline wipes in line by line, and a corner tile cycles through paintings.
- **Scroll:** the hero is pinned while the corner tile grows into a full-width reel.
- **Header:** white with a difference blend so it stays visible over any colour, and it hides on scroll down.
- **Hovers:** a band sweeps down through link text.
- **Text:** lines wipe in on entry, and the About text fills from grey to black as you scroll.
- **Work cards:** images reveal with a clip and drift slightly as you scroll (parallax).
- **Statements:** a dark, full-screen slider with tabs and progress bars.
- **More Work:** a marquee whose speed reacts to scrolling.
- **Smooth scrolling:** via [Lenis](https://github.com/darkroomengineering/lenis) (MIT), stored in `assets/vendor/`.

All of it is plain HTML, CSS and JavaScript, with no build step.

## Structure

```
index.html            page markup
styles.css            all styles
main.js               artwork data and every interaction / animation
assets/works/         cleaned artwork images, cropped from the Instagram screenshots
assets/media/         studio video (web-compressed) and poster frame
assets/reference/     original screenshots and video, kept for reference
assets/vendor/        Lenis smooth-scroll library
```

## Editing artworks

Every painting is listed in the `WORKS` array at the top of `main.js`, with its title, size, medium, series and statement. `SELECTED` sets which works appear in the Selected Work grid; mark an entry `wide` to make it a full-width row. To add a work:
1. Drop a JPG into `assets/works/`.
2. Add an entry to `WORKS` with a matching `slug`.

## Run locally

It's a static site with no build step:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. It can be deployed as-is to GitHub Pages, Netlify or Vercel.
