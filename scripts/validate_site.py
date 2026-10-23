#!/usr/bin/env python3
import json
from datetime import date
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

require(data, ["meta", "profile", "links", "researchThemes", "learning", "experience", "education", "projects", "publications", "skills", "professionalService", "talks", "achievements", "researchHighlights"], "site.json")
require(data["profile"], ["name", "title", "affiliation", "email", "tagline", "bio", "headline", "institution", "institutionUrl", "supervisor", "supervisorUrl"], "profile")

for index, project in enumerate(data["projects"]):
    require(project, ["year", "title", "description", "technologies"], f"projects[{index}]")

for index, publication in enumerate(data["publications"]):
    require(publication, ["year", "title"], f"publications[{index}]")

for index, service in enumerate(data["professionalService"]):
    require(service, ["role", "organization", "year"], f"professionalService[{index}]")

for index, talk in enumerate(data["talks"]):
    require(talk, ["title", "type", "date", "year", "event", "conference", "location", "url", "description"], f"talks[{index}]")
    talk_date = date.fromisoformat(talk["date"])
    if str(talk_date.year) != str(talk["year"]):
        raise ValueError(f"talks[{index}].year does not match its date")

if not isinstance(data.get("display", {}).get("showSkills"), bool):
    raise ValueError("display.showSkills must be true or false")

for index, theme in enumerate(data["researchThemes"]):
    for project_id in theme.get("projectIds", []):
        expected_url = "project-bluerov2-retrieval.html" if project_id == "bluerov2-retrieval" else f"project.html?id={project_id}"
        if not any(project.get("url") == expected_url for project in data["projects"]):
            raise ValueError(f"researchThemes[{index}] links to unknown project {project_id}")

for index, highlight in enumerate(data["researchHighlights"]):
    require(highlight, ["title", "venue", "role", "summary", "evidence", "url"], f"researchHighlights[{index}]")
    if not any(project.get("url") == highlight["url"] for project in data["projects"]):
        raise ValueError(f"researchHighlights[{index}] links to an unknown project")

for index, direction in enumerate(data["researchProgram"]["directions"]):
    require(direction, ["title", "description"], f"researchProgram.directions[{index}]")

for index, lesson in enumerate(data["learning"]):
    require(lesson, ["slug", "title", "description", "level", "duration", "topics", "image", "url", "notebook"], f"learning[{index}]")
    for field in ("image", "url", "notebook"):
        target = ROOT / lesson[field]
        if not target.is_file():
            raise ValueError(f"learning[{index}].{field} does not exist: {lesson[field]}")

for project_id, project in project_details.items():
    require(project, ["year", "kicker", "title", "summary", "facts", "overview", "stages", "limitations", "links"], f"project-details[{project_id}]")
    if "metrics" not in project or not isinstance(project["metrics"], list):
        raise ValueError(f"project-details[{project_id}] requires a metrics list")

print(
    f"Validated {len(data['projects'])} projects, "
    f"{len(data['publications'])} publications, "
    f"{len(data['experience'])} experience entries, "
    f"{len(data['learning'])} learning resource(s), "
    f"{len(project_details)} technical case studies, and {len(data['talks'])} invited talk(s)."
)
