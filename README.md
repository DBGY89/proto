# AI Proto Lab

A portfolio of AI-built prototypes. Each one started as a "what if" — shipped fast, designed to be used.

## Run it

Open `index.html` in a browser, or use a local server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

Then open `http://localhost:8080`.

## Project structure

```
proto/
├── index.html              Landing page (hub for all projects)
├── landing.css
├── landing.js
├── projects/
│   ├── bubbles-extension/  Chrome extension: bubbles on any webpage
│   │   ├── manifest.json
│   │   ├── content.js
│   │   ├── content.css
│   │   ├── popup.html / popup.css / popup.js
│   │   ├── icons/
│   │   └── README.md
│   ├── nighty-night/       Bedtime story generator (coming soon)
│   │   ├── index.html
│   │   ├── style.css
│   │   └── README.md
│   └── salad-maker/        Ingredient-based recipe builder (coming soon)
│       ├── index.html
│       ├── style.css
│       └── README.md
└── README.md
```

## Adding a new project

1. Create a folder under `projects/` (e.g. `projects/my-idea/`).
2. Add at least `index.html` and `style.css`.
3. Write a `README.md` with: **Problem**, **Hypothesis**, **Users**, **Metrics**.
4. Add a card to the landing page grid in `index.html`:

```html
<a href="projects/my-idea/" class="card card--pink">
  <div class="card-border"></div>
  <div class="card-body">
    <h3 class="card-title">My Idea</h3>
    <p class="card-desc">One-line description.</p>
  </div>
</a>
```

Accent options: `card--pink` | `card--cyan` | `card--purple`

## Projects

| Project | Description | Status |
|---------|-------------|--------|
| [BUBBLES](projects/bubbles-extension/) | Chrome extension: pop bubbles on any page | Live |
| [BUBBLES](projects/bubbles-extension/) | Chrome extension: pop bubbles on any page | Live |
| [Nighty Night](projects/nighty-night/) | Bedtime story generator | Coming soon |
| [Salad Maker](projects/salad-maker/) | Pick ingredients, get a recipe | Coming soon |

## Deploy

This is a static site — deploy the entire repo to Vercel, Netlify, or GitHub Pages. Each project lives at `/projects/<name>/` under the same domain.

## License

Use as you like.
