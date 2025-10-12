# CSE 106 – Lab 5: Grades Web App

This is a minimal HTML/CSS/JS frontend that consumes the provided REST API at `https://amhep.pythonanywhere.com`.

## Run locally

Open `index.html` in your browser. No build tools required.

If your browser blocks cross-origin requests from local files, serve the folder:

- macOS: `python3 -m http.server 5500`
- Then open `http://localhost:5500` and navigate to `Lab 5/`

## Features

- View all students and grades
- Look up a single student's grade by name
- Create a new student and grade
- Update an existing student's grade
- Delete a student

All responses are rendered into tables. No raw JSON is shown.

## API Notes

- Names are case sensitive
- Spaces in URLs are handled automatically, but `%20` is the encoding
- `POST` and `PUT` requests include header `Content-Type: application/json`

## Files

- `index.html` – UI and layout
- `styles.css` – Styling with dark theme
- `app.js` – API calls and DOM logic


