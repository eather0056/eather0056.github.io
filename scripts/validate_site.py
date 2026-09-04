#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "assets" / "data" / "site.json"
PROJECT_DETAILS_FILE = ROOT / "assets" / "data" / "project-details.json"


def require(mapping, keys, location):
    for key in keys:
        if key not in mapping or mapping[key] in (None, "", []):
            raise ValueError(f"{location} is missing required field: {key}")


with DATA_FILE.open(encoding="utf-8") as stream:
    data = json.load(stream)

with PROJECT_DETAILS_FILE.open(encoding="utf-8") as stream:
    project_details = json.load(stream)

require(data, ["meta", "profile", "links", "researchThemes", "experience", "education", "projects", "publications", "skills"], "site.json")
require(data["profile"], ["name", "title", "affiliation", "email", "tagline", "bio"], "profile")

for index, project in enumerate(data["projects"]):
    require(project, ["year", "title", "description", "technologies"], f"projects[{index}]")

for index, publication in enumerate(data["publications"]):
    require(publication, ["year", "title"], f"publications[{index}]")

for project_id, project in project_details.items():
    require(project, ["year", "kicker", "title", "summary", "facts", "overview", "stages", "limitations", "links"], f"project-details[{project_id}]")
    if "metrics" not in project or not isinstance(project["metrics"], list):
        raise ValueError(f"project-details[{project_id}] requires a metrics list")

print(
    f"Validated {len(data['projects'])} projects, "
    f"{len(data['publications'])} publications, and "
    f"{len(data['experience'])} experience entries, and "
    f"{len(project_details)} technical case studies."
)
