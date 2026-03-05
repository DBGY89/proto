# CrossFit Fuel

A web tool that generates personalized daily menus for CrossFit athletes based on **training day** vs **rest day**, with bold, energetic explanations of what each food does for your body.

Part of [AI Proto Lab](../../index.html).

## Features

- **Day type selector** — CrossFit Day or Rest Day (one click)
- **Full daily menu** — Breakfast, lunch, dinner, snack with dish names, ingredients, and macros
- **Food impact copy** — Expandable “What this does to you” for each meal (bold, non-clinical)
- **Optional personalization** — Weight, height, goal (performance / fat loss / muscle gain) for caloric target
- **Dietary filters** — Vegan, gluten-free, dairy-free toggles
- **Shopping list** — Auto-generated from the menu, grouped by category, checkbox list
- **Shareable card** — Download a 9:16 image (Stories-style) with day type, meals, and macros

## How to run

1. Open from the lab index or run a local server from the repo root:
   ```bash
   python3 -m http.server 8080
   ```
2. Go to `http://localhost:8080/projects/crossfit-fuel/`.
3. Choose **CrossFit Day** or **Rest Day**, optionally set filters and “Personalize my plan”, then **Generate my menu**.

## API key (optional)

Without an API key, the app uses **demo menus** so you can try the flow.

To use **live AI-generated menus**:

1. Get an [Anthropic API key](https://console.anthropic.com/).
2. Click the ⚙️ (settings) in the top bar and paste your key. It is stored only in your browser (localStorage).
3. Generate again — the app will call Claude to create a fresh menu.

Model: `claude-sonnet-4-20250514` (set in code; you can change it if needed).

## Tech

- Vanilla HTML, CSS, JS (no framework).
- Anthropic Messages API for menu generation when a key is set.
- Caloric estimate: Mifflin–St Jeor–style BMR + activity multiplier; minimum 1,400 kcal.
- Shareable card: canvas-drawn PNG, 360×640 (9:16).

## Privacy & disclaimers

- No accounts; profile data stays in the session and is only sent in the API request when you have a key.
- The tool is for **nutritional inspiration**, not medical or clinical advice. A disclaimer is shown near the personalization inputs.
- Allergen disclaimer is shown on every menu: “Always verify ingredients for your specific dietary needs and allergies.”
