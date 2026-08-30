# eather0056.github.io

Source for the academic website of Md Ether Deowan.

## Structure

- `index.html` — homepage
- `about.html` — biography and background
- `research.html` — research statement and themes
- `publications.html` — papers and scholarly outputs
- `projects.html` — research and engineering projects
- `cv.html` — curriculum vitae
- `contact.html` — institutional contact and profiles
- `assets/css/` — shared visual styling
- `assets/js/` — shared navigation and footer
- `assets/images/` — profile, project, and research images
- `assets/documents/` — public CV and publication documents

Website content is stored in one structured source:
`assets/data/site.json`. See [UPDATING.md](UPDATING.md) for short examples.

Updating that file automatically updates the homepage, biography, research,
projects, publications, CV, and contact pages. A GitHub Action validates every
change before publication.

## Local preview

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
