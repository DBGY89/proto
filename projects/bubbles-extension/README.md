# Bubbles Extension

A Chrome extension that lets you pop soap bubbles on any webpage you're browsing.

## Problem

Browser extensions that are fun and shareable create viral distribution loops. A "show me your tools" conversation on LinkedIn is a natural entry point to the portfolio.

## Hypothesis

Turning a web game into a Chrome extension that works on any page creates a stronger "wow, try this" moment than linking to a standalone site. The shareability of "install this and play on any page" is higher.

## Users

Anyone who wants a 45-second break. Colleagues who share fun tools over Slack/Teams.

## How it works

**Play on the web:** Open this project’s page (e.g. `/projects/bubbles-extension/`). You can play immediately; no install needed. On the same page you’ll see how to install the Chrome extension so you can play on any site and keep it on your computer.

**With the extension:**
1. Install the extension (load unpacked from `chrome://extensions`).
2. Navigate to any webpage.
3. Click the Bubbles icon in the toolbar.
4. Click **Play** in the popup.
5. Soap bubbles float up over the page — pop them!
6. Special iridescent bubbles give +3 points and explode into glitter.
7. Frenzy mode at 15s: triple bubble rate for 10 seconds.
8. Game ends at 45s — see your score.

## Install (developer mode)

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode** (toggle in the top-right).
3. Click **Load unpacked**.
4. Select the `projects/bubbles-extension/` folder.
5. The bubble icon appears in the toolbar.

## Stack

Manifest V3, vanilla JS, Shadow DOM for style isolation. No dependencies.

## Metrics to watch

- **Install rate**: % of portfolio visitors who install the extension
- **Sessions per user**: how often they play after installing
- **Share rate**: users who send the extension to someone else
