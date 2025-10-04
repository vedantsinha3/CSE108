# Lab 4 — React + Material UI Calculator

This app recreates the Lab 3 calculator using React and Material UI.

Requirements satisfied:
- React with function components, props, and `useState`
- Material UI components (`Button`, `TextField`)
- Same functionality as Lab 3: clear, add/subtract/multiply/divide, repeated equals, operator highlight, keyboard support
- Centered layout and CSS styling

## Getting Started

1. Install dependencies
```bash
npm install
```
2. Run the dev server
```bash
npm run dev
```
3. Open the URL shown in the terminal (usually `http://localhost:5173`).

## Project Structure
- `index.html` — Vite entry
- `src/main.jsx` — React bootstrap
- `src/App.jsx` — Calculator implementation
- `src/styles.css` — Page and grid styling

## Notes
- Keyboard: digits `0-9`, `.`, `+`, `-`, `*`, `/`, `Enter/=`, `Esc`
- Operator highlight turns on when selected and clears on number/equals/clear

