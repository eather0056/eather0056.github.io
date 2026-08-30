const contentRoot = document.querySelector("[data-content-root]");
const escapeHtml = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const externalLink = (url, label) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
const period = (item) => `${escapeHtml(item.start)}–${escapeHtml(item.end)}`;
const cleanTitle = (title) => title.replace(/^\[Task\]\s*/, "");

function projectCard(project) {
  const title = project.url ? externalLink(project.url, project.title) : escapeHtml(project.title);
  return `<article class="card project-card"><p class="card-label">${escapeHtml(project.year)}</p><h2>${title}</h2><p>${escapeHtml(project.description)}</p><ul class="tag-list">${project.technologies.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>`;
}

function timeline(items, type) {
  return `<div class="timeline">${items.map((item) => `<article class="timeline-item"><p class="timeline-date">${period(item)}</p><div><h3>${escapeHtml(type === "education" ? item.degree : item.role)}</h3><p class="timeline-org">${escapeHtml(type === "education" ? item.institution : item.organization)} · ${escapeHtml(item.location)}</p>${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ""}${item.detail ? `<p>${escapeHtml(item.detail)}</p>` : ""}</div></article>`).join("")}</div>`;
}

function renderHome(data) {
  contentRoot.innerHTML = `<section class="hero"><div class="container hero-grid"><div class="hero-copy"><p class="eyebrow">${escapeHtml(data.profile.affiliation)}</p><h1>${escapeHtml(data.profile.name)}</h1><p class="hero-role">${escapeHtml(data.profile.title)}</p><p class="lead">${escapeHtml(data.profile.tagline)}</p><div class="button-row"><a class="button" href="research.html">Explore my research <span aria-hidden="true">→</span></a><a class="button button-secondary" href="contact.html">Get in touch</a></div><div class="profile-links">${data.links.slice(0, 4).map((link) => externalLink(link.url, link.label)).join("")}</div></div><figure class="portrait-frame"><div class="portrait-accent" aria-hidden="true"></div><img class="profile-photo" src="assets/images/IMG_0773.png" alt="Portrait of Md Ether Deowan" width="1100" height="1308"><figcaption><strong>Field Robotics Lab</strong><span>NTNU · Trondheim, Norway</span></figcaption></figure></div></section><section class="impact-strip"><div class="container impact-grid"><div><strong>${data.publications.length}+</strong><span>Publications</span></div><div><strong>${data.projects.length}</strong><span>Selected projects</span></div><div><strong>3</strong><span>Research themes</span></div><div><strong>2025—</strong><span>PhD at NTNU</span></div></div></section><section class="section section-muted"><div class="container"><div class="section-intro"><div><p class="eyebrow">Current work</p><h2>Building autonomy for robots in the real world.</h2></div><p>My research connects perception, localisation, and control for underwater and field robots operating under uncertainty.</p></div><div class="card-grid section-compact">${data.researchThemes.map((theme, index) => `<article class="card theme-card"><span class="card-number">0${index + 1}</span><h3>${escapeHtml(theme.title)}</h3><p>${escapeHtml(theme.description)}</p></article>`).join("")}</div></div></section><section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">Selected work</p><h2>Recent projects</h2></div><a class="text-link" href="projects.html">View all projects <span aria-hidden="true">→</span></a></div><div class="card-grid">${data.projects.slice(0, 3).map(projectCard).join("")}</div></div></section><section class="section callout-section"><div class="container callout"><div><p class="eyebrow">Collaboration</p><h2>Interested in field robotics and autonomous systems?</h2></div><a class="button button-light" href="contact.html">Let’s connect <span aria-hidden="true">→</span></a></div></section>`;
}

function renderAbout(data) {
  contentRoot.innerHTML = `<section class="section"><div class="container"><div class="about-grid"><img class="about-photo" src="assets/images/IMG_0773.png" alt="Md Ether Deowan" width="1100" height="1308"><div><p class="eyebrow">About</p><h1>${escapeHtml(data.profile.name)}</h1>${data.profile.bio.map((text) => `<p class="bio-copy">${escapeHtml(text)}</p>`).join("")}</div></div><div class="content-width content-center"><dl class="facts"><div><dt>Position</dt><dd>${escapeHtml(data.profile.title)}</dd></div><div><dt>Affiliation</dt><dd>${escapeHtml(data.profile.affiliation)}</dd></div><div><dt>Supervisor</dt><dd>${escapeHtml(data.profile.supervisor)}</dd></div></dl><h2>Experience</h2>${timeline(data.experience, "experience")}<h2 class="content-section-title">Education</h2>${timeline(data.education, "education")}</div></div></section>`;
}

function renderResearch(data) {
  contentRoot.innerHTML = `<section class="section"><div class="container"><p class="eyebrow">Research</p><h1>Research themes</h1><p class="lead content-width">${escapeHtml(data.profile.tagline)}</p><div class="card-grid section-compact">${data.researchThemes.map((theme) => `<article class="card"><h2>${escapeHtml(theme.title)}</h2><p>${escapeHtml(theme.description)}</p></article>`).join("")}</div><div class="research-statement content-width"><h2>Current direction</h2><p>${escapeHtml(data.profile.bio[0])}</p><p>Current work emphasizes robust field deployment, evidence-driven evaluation, and methods that connect perception directly to localisation and closed-loop control.</p></div></div></section>`;
}

function renderProjects(data) {
  const sorted = [...data.projects].sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year));
  contentRoot.innerHTML = `<section class="section"><div class="container"><p class="eyebrow">Projects</p><h1>Research and engineering projects</h1><p class="lead content-width">Selected work in underwater robotics, autonomous systems, perception, control, and industrial automation, ordered by year.</p><div class="project-list section-compact">${sorted.map(projectCard).join("")}</div></div></section>`;
}

function renderPublications(data) {
  const groups = data.publications.reduce((all, item) => ((all[item.year] ||= []).push(item), all), {});
  const scholar = data.links.find((link) => link.label === "Google Scholar");
  contentRoot.innerHTML = `<section class="section"><div class="container content-width"><p class="eyebrow">Publications</p><h1>Publications</h1><p>For complete citation and impact information, see ${externalLink(scholar.url, "Google Scholar")}.</p><div class="publication-groups">${Object.keys(groups).sort((a, b) => Number(b) - Number(a)).map((year) => `<section><h2>${year}</h2><ol class="publication-list">${groups[year].map((publication) => `<li>${publication.doi ? externalLink(publication.doi, publication.title) : escapeHtml(publication.title)}</li>`).join("")}</ol></section>`).join("")}</div></div></section>`;
}

function renderCv(data) {
  contentRoot.innerHTML = `<section class="section"><div class="container content-width"><p class="eyebrow">Curriculum vitae</p><h1>Experience and education</h1><p class="data-note">A privacy-reviewed downloadable PDF will be added later.</p><h2>Experience</h2>${timeline(data.experience, "experience")}<h2 class="content-section-title">Education</h2>${timeline(data.education, "education")}<h2 class="content-section-title">Skills</h2><div class="skills-grid">${data.skills.map((group) => `<section><h3>${escapeHtml(group.group)}</h3><ul>${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`).join("")}</div><h2 class="content-section-title">Selected achievements</h2><ul>${data.achievements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><p class="data-note">Website data updated ${escapeHtml(data.meta.lastUpdated)}.</p></div></section>`;
}

function renderContact(data) {
  contentRoot.innerHTML = `<section class="section"><div class="container content-width"><p class="eyebrow">Contact</p><h1>Get in touch</h1><p class="lead">For research, collaboration, and academic enquiries.</p><dl class="facts"><div><dt>Email</dt><dd><a href="mailto:${escapeHtml(data.profile.email)}">${escapeHtml(data.profile.email)}</a></dd></div><div><dt>Affiliation</dt><dd>${escapeHtml(data.profile.department)}, ${escapeHtml(data.profile.affiliation)}</dd></div><div><dt>Location</dt><dd>${escapeHtml(data.profile.location)}</dd></div></dl><div class="profile-links profile-links-large">${data.links.map((link) => externalLink(link.url, link.label)).join("")}</div></div></section>`;
}

const renderers = { home: renderHome, about: renderAbout, research: renderResearch, publications: renderPublications, projects: renderProjects, cv: renderCv, contact: renderContact };
if (contentRoot) fetch("assets/data/site.json").then((response) => { if (!response.ok) throw new Error(`Could not load site data (${response.status})`); return response.json(); }).then((data) => renderers[document.body.dataset.page]?.(data)).catch((error) => { contentRoot.innerHTML = `<section class="section"><div class="container"><h1>Content unavailable</h1><p>${escapeHtml(error.message)}</p></div></section>`; });
