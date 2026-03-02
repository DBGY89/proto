# AI Proto Lab

A portfolio landing page for AI-built prototypes. Vanilla HTML, CSS, and JavaScript—no build step, no frameworks.

## What’s in here

- **Landing page** — Hero, project cards, footer
- **Snake game** — Appears on the page; play or lose
- **Cherry blossom particles** — Animated background

## Run it

Open `index.html` in a browser, or use a local server:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Then open `http://localhost:8080`.

## Project structure

```
proto/
├── index.html    # Main landing page
├── landing.css   # Styles
├── landing.js    # Particles, cards, snake game
└── README.md
```

## Adding a new project

1. Open `index.html` and find the `.grid` section.
2. Copy the card template (see the HTML comment above the grid).
3. Insert a new card:

```html
<a href="https://your-deployed-url.com" target="_blank" rel="noopener" class="card card--pink">
  <div class="card-border"></div>
  <div class="card-body">
    <h3 class="card-title">Project Name</h3>
    <p class="card-desc">One-line description.</p>
  </div>
</a>
```

4. Change `href` to your deployed URL.
5. Pick an accent: `card--pink`, `card--cyan`, or `card--purple`.

Projects live in their own repos and deploy separately; the landing page only links to them.

## Snake game

- **Starts** after ~30 seconds, or when you scroll past the projects section.
- **Controls**: Arrow keys or WASD; swipe on mobile.
- **Score**: +1 for each piece of food you eat.
- **On game over**: Click “Bring the snake back” to play again.

## Accessibility

- Respects `prefers-reduced-motion`
- Focus styles on cards
- Semantic HTML and ARIA where needed

## License

Use as you like.
