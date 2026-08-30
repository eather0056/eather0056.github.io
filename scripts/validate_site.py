#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "assets" / "data" / "site.json"


def require(mapping, keys, location):
    for key in keys:
        if key not in mapping or mapping[key] in (None, "", []):
            raise ValueError(f"{location} is missing required field: {key}")


with DATA_FILE.open(encoding="utf-8") as stream:
    data = json.load(stream)

require(data, ["meta", "profile", "links", "researchThemes", "experience", "education", "projects", "publications", "skills"], "site.json")
require(data["profile"], ["name", "title", "affiliation", "email", "tagline", "bio"], "profile")

for index, project in enumerate(data["projects"]):
    require(project, ["year", "title", "description", "technologies"], f"projects[{index}]")

for index, publication in enumerate(data["publications"]):
    require(publication, ["year", "title"], f"publications[{index}]")

print(
    f"Validated {len(data['projects'])} projects, "
    f"{len(data['publications'])} publications, and "
    f"{len(data['experience'])} experience entries."
)
