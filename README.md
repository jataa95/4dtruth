# 4dtruth

Portfolio website for **4dtruth**, the studio of Seun Okunola: a multidisciplinary artist, painter and colourist based in Lagos, Nigeria.

The layout and typography take their cue from [ouiwill.com](https://www.ouiwill.com/). It has a full-bleed video hero, a numbered "Selected Work" grid with mono tag pills, a statement slider, a minimal about section, and a large wordmark footer.

## Structure

```
index.html            page markup
styles.css            all styles
main.js               artwork data, grid, lightbox, slider, scroll effects
assets/works/         cleaned artwork images, cropped from the Instagram screenshots
assets/media/         studio video (web-compressed) and poster frame
assets/reference/     original screenshots and video, kept for reference
```

## Editing artworks

Every painting is listed in the `WORKS` array at the top of `main.js`, with its title, size, medium, series and statement. To add a work:
1. Drop a JPG into `assets/works/`.
2. Add an entry to `WORKS` with a matching `slug`.

## Run locally

It's a static site with no build step:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. It can be deployed as-is to GitHub Pages, Netlify or Vercel.
