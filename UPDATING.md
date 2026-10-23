# Updating the website

The website is data-driven. The main profile pages read from one source:

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

The Projects page sorts entries by year automatically. The homepage links projects through each research theme’s `projectIds` list.

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
- Technical capabilities: `skills` (retained in the data; hidden while `display.showSkills` is `false`)
- Awards: `achievements` (shown on the homepage, Talks & service page, and CV)
- Invited presentations: `talks`
- Peer review and professional service: `professionalService`
- Institution and supervisor links: `profile.institutionUrl` and `profile.supervisorUrl`

Update `meta.lastUpdated` whenever the content changes.

## Add an invited talk

Add an entry to `talks` with `title`, `type`, `date` (YYYY-MM-DD), `year`,
`event`, `conference`, `location`, `url`, and a short `description`.
Use the presentation title for `title` and the workshop name for `event`.
Optionally set `conferenceShort` to a brief label such as `IROS 2026`.
The same entry appears on the homepage, Talks & service page, and CV.

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
3. Render the notebook directly into a website page:

   `python3 scripts/render_learning_notebook.py assets/learning/<lesson-slug>/<notebook>.ipynb learning-<lesson-slug>.html --title "Lesson title" --asset-prefix assets/learning/<lesson-slug>`

4. Add the generated page URL to `sitemap.xml`.
5. Run `python3 scripts/validate_site.py` and preview both desktop and mobile layouts before publishing.

Only publish notebooks after checking outputs and metadata for private paths, credentials, unpublished results, or personal information.
