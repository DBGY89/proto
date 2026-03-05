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
│   ├── bubbles/            Pop soap bubbles web game
│   │   ├── index.html
│   │   ├── style.css
│   │   └── app.js
│   ├── nighty-night/       Bedtime story generator (coming soon)
│   │   ├── index.html
│   │   └── style.css
│   └── salad-bar/          Visual salad bar — plate + hand follows cursor
│       ├── index.html
│       └── style.css
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
| [BUBBLES](projects/bubbles/) | Mini game: pop soap bubbles; special ones burst into glitter | Live |
| [Nighty Night](projects/nighty-night/) | Bedtime story generator | Coming soon |
| [Salad Bar](projects/salad-bar/) | Build your salad on a visual bar, hand follows cursor | Live |

## Deploy on GitHub Pages

1. Create a new repository on GitHub (e.g. `ai-proto-lab` or `proto`).
2. Push your code:
   ```bash
   cd /path/to/proto
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git push -u origin main
   ```
3. On GitHub: **Settings** → **Pages** → under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch **main**, folder **/ (root)**, then **Save**.
5. After a minute or two, the site will be at `https://TU-USUARIO.github.io/TU-REPO/`.

The `.nojekyll` file in the root tells GitHub Pages to serve the files as-is (no Jekyll), so all links and assets work correctly.

## Deploy elsewhere

This is a static site — you can also deploy to Vercel, Netlify, or any host. Each project lives at `/projects/<name>/` under the same domain.

## License

Use as you like.
