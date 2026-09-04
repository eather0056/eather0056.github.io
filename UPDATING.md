# Updating the website

The website is data-driven. All seven pages read from one source:

[`assets/data/site.json`](assets/data/site.json)

You normally do not need to edit HTML. Update the appropriate JSON list and
push the change; GitHub Pages will rebuild the site and every affected page will
update automatically.

## Add a project

Add an entry at the beginning of the `projects` list:

```json
{
  "year": "2026",
  "title": "Project title",
  "description": "Two or three factual sentences about the problem and result.",
  "technologies": ["ROS 2", "Python"],
  "url": "https://github.com/eather0056/repository"
}
```

The Projects page sorts entries by year automatically. The homepage displays
the first three entries as selected recent work.

## Add a publication

Add an entry to `publications`:

```json
{
  "year": 2026,
  "title": "Publication title",
  "doi": "https://doi.org/..."
}
```

The Publications page groups entries by year automatically. The `doi` field is
optional.

## Update biography, employment, or education

- Biography and contact: `profile`
- External profiles: `links`
- Research areas: `researchThemes`
- Employment: `experience`
- Degrees: `education`
- Technical capabilities: `skills`
- Awards: `achievements`

Update `meta.lastUpdated` whenever the content changes.

## Validate before publishing

```bash
python3 scripts/validate_site.py
python3 -m http.server 8000
```

Visit `http://localhost:8000`. A GitHub Action also validates every push and
pull request.

## Documents and images

- Add `assets/documents/cv.pdf` only after removing private phone numbers,
  addresses, and references' contact details. Then enable its link in
  `assets/js/content.js`.
- Put public images in `assets/images/` and reference them with relative paths.
- Do not publish home addresses, private phone numbers, references' contact
  details, unpublished results, or confidential project information.


## Add a learning resource

1. Place reviewed public assets in `assets/learning/<lesson-slug>/`. Never link directly to working files under `assets/documents/`.
2. Add one entry to the `learning` array in `assets/data/site.json`.
3. Create the lesson page, using `learning-kalman-filter.html` as the structural template.
4. Add the page URL to `sitemap.xml`.
5. Run `python3 scripts/validate_site.py` and preview both desktop and mobile layouts before publishing.

Only publish notebooks after checking outputs and metadata for private paths, credentials, unpublished results, or personal information.
