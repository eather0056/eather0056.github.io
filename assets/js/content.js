const contentRoot = document.querySelector("[data-content-root]");
const escapeHtml = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const externalLink = (url, label) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
const period = (item) => `${escapeHtml(item.start)}–${escapeHtml(item.end)}`;
const cleanTitle = (title) => title.replace(/^\[Task\]\s*/, "");

const themeIcons = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 13 13l-4.5 2.5L11 11z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><path d="M8.5 8.5a5 5 0 0 1 7 0M5.8 5.8a9 9 0 0 1 12.4 0M8.5 15.5a5 5 0 0 0 7 0M5.8 18.2a9 9 0 0 0 12.4 0"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7.7 7.3 10.5 16M16.3 7.3 13.5 16M8 6h8"/></svg>',
];
const themeCard = (theme, index) => `<article class="card theme-card"><div class="theme-head"><span class="theme-icon" aria-hidden="true">${themeIcons[index % themeIcons.length]}</span><span class="card-number">0${index + 1}</span></div><h3>${escapeHtml(theme.title)}</h3><p>${escapeHtml(theme.description)}</p></article>`;

const supervisorLink = (profile) => externalLink(profile.supervisorUrl, profile.supervisor);
const institutionLink = (profile) => externalLink(profile.institutionUrl, profile.institution);
const affiliationLink = (profile) => `${externalLink(profile.affiliationUrl, profile.affiliation)}<br>${institutionLink(profile)}`;
function biography(profile, className = "") {
  return profile.bio.map((text) => {
    const linked = escapeHtml(text)
      .replace(escapeHtml(profile.institution), institutionLink(profile))
      .replace(escapeHtml(profile.supervisor), supervisorLink(profile))
      .replace("Field Robotics Lab", externalLink(profile.affiliationUrl, "Field Robotics Lab"));
    return `<p${className ? ` class="${className}"` : ""}>${linked}</p>`;
  }).join("");
}
const serviceList = (data) => `<div class="service-list">${data.professionalService.map((item) => `<article><span>${escapeHtml(item.year)}</span><p><strong>${escapeHtml(item.role)}</strong>, ${escapeHtml(item.organization)}</p></article>`).join("")}</div>`;
const achievementList = (data) => `<ul class="achievement-list">${data.achievements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
function talkCard(talk) {
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${talk.date}T12:00:00Z`));
  return `<article class="talk-card"><div class="talk-meta"><span>${escapeHtml(talk.type)} · ${escapeHtml(talk.conferenceShort || talk.year)}</span><time datetime="${escapeHtml(talk.date)}">${date}</time></div><h3>${escapeHtml(talk.title)}</h3><p class="talk-event">${externalLink(talk.url, talk.event)}</p><p>${escapeHtml(talk.description)}</p><p class="talk-location">${escapeHtml(talk.conference)}<br>${escapeHtml(talk.location)}</p><a class="text-link" href="${escapeHtml(talk.url)}" target="_blank" rel="noreferrer">Workshop website <span aria-hidden="true">↗</span></a></article>`;
}

function projectCard(project) {
  const isExternal = project.url?.startsWith("http");
  const title = project.url ? (isExternal ? externalLink(project.url, project.title) : `<a href="${escapeHtml(project.url)}">${escapeHtml(project.title)}</a>`) : escapeHtml(project.title);
  const media = project.image ? `<a class="project-media" href="${escapeHtml(project.url || "#")}" aria-label="View ${escapeHtml(project.title)}"><img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt || "")}" loading="lazy"></a>` : "";
  return `<article class="card project-card ${project.featured ? "project-card-featured" : ""}">${media}<div class="project-card-body"><p class="card-label">${escapeHtml(project.venue ? `${project.venue} · ${project.year}` : project.year)}</p><h2>${title}</h2><p>${escapeHtml(project.description)}</p><ul class="tag-list">${project.technologies.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>${!isExternal && project.url ? `<a class="project-read-more" href="${escapeHtml(project.url)}">Read technical case study <span aria-hidden="true">→</span></a>` : ""}</div></article>`;
}

function timeline(items, type) {
  return `<div class="timeline">${items.map((item) => `<article class="timeline-item"><p class="timeline-date">${period(item)}</p><div><h3>${escapeHtml(type === "education" ? item.degree : item.role)}</h3><p class="timeline-org">${type === "education" ? escapeHtml(item.institution) : item.organizationUrl ? externalLink(item.organizationUrl, item.organization) : escapeHtml(item.organization)} · ${escapeHtml(item.location)}</p>${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ""}${item.detail ? `<p>${escapeHtml(item.detail)}</p>` : ""}</div></article>`).join("")}</div>`;
}

function profileSidebar(data) {
  const icons = {
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    scholar: '<path d="m2 9 10-6 10 6-10 6zM6 12v6c4 3 8 3 12 0v-6M22 9v9"/>',
    link: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2"/>',
  };
  const icon = (key) => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icons[key]}</svg>`;
  return `<aside class="academic-sidebar" aria-label="Profile"><img class="sidebar-photo" src="assets/images/IMG_0773.png" alt="Portrait of ${escapeHtml(data.profile.name)}" width="1100" height="1308"><h2 class="sidebar-name">${escapeHtml(data.profile.name)}</h2><p class="sidebar-role">${escapeHtml(data.profile.title)}</p><p class="sidebar-affiliation">${affiliationLink(data.profile)}</p><p class="sidebar-location">${escapeHtml(data.profile.location)}</p><ul class="sidebar-links"><li>${icon('email')}<a href="mailto:${escapeHtml(data.profile.email)}">${escapeHtml(data.profile.email)}</a></li>${data.links.filter((link) => link.label !== 'Legacy portfolio').map((link) => `<li>${icon(link.label === 'Google Scholar' ? 'scholar' : link.label === 'NTNU profile' ? 'profile' : 'link')}${externalLink(link.url, link.label)}</li>`).join('')}<li>${icon('profile')}<a href="cv.html">Curriculum vitae</a></li></ul><p class="sidebar-advisor"><span>Supervised by</span>${supervisorLink(data.profile)}</p></aside>`;
}

function researchHighlights(data) {
  return `<div class="research-highlights">${data.researchHighlights.map((item) => `<article class="research-highlight"><p class="highlight-venue">${escapeHtml(item.venue)} <span>· ${escapeHtml(item.role)}</span></p><h3><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.summary)}</p><p class="highlight-evidence">${escapeHtml(item.evidence)}</p><a class="text-link" href="${escapeHtml(item.url)}">Paper, evaluation &amp; demonstration →</a></article>`).join("")}</div>`;
}

function renderHome(data) {
  const projectFor = (id) => id === "bluerov2-retrieval"
    ? data.projects.find((project) => project.url === "project-bluerov2-retrieval.html")
    : data.projects.find((project) => project.url === `project.html?id=${id}`);
  const themes = data.researchThemes.map((theme) => `<article class="research-box"><h3>${escapeHtml(theme.title)}</h3><p>${escapeHtml(theme.description)}</p><details><summary>Projects &amp; technical contributions</summary><ul>${(theme.projectIds || []).map(projectFor).filter(Boolean).map((project) => `<li><a href="${escapeHtml(project.url)}">${escapeHtml(project.title)}</a></li>`).join("")}<li><a href="research.html">Research programme and collaboration</a></li></ul></details></article>`).join("");
  const recent = [...data.publications].sort((a, b) => Number(b.year) - Number(a.year)).slice(0, 3);
  contentRoot.innerHTML = `
    <section class="home-about">
      <p class="eyebrow">Robot learning · World models · Field autonomy</p>
      <h1 class="profile-headline">${escapeHtml(data.profile.headline)}</h1>
      ${biography(data.profile)}
      <div class="profile-actions"><a href="research.html">Research programme →</a><a href="publications.html">Publications →</a><a href="contact.html">Research enquiries →</a></div>
    </section>
    <section><h2 class="academic-section-title">Selected research contributions</h2>${researchHighlights(data)}</section>
    <section><h2 class="academic-section-title">Invited talks</h2>${data.talks.slice(0, 1).map(talkCard).join("")}<p class="section-followup"><a class="text-link" href="talks.html">Talks, service &amp; achievements →</a></p></section>
    <section><h2 class="academic-section-title">Research &amp; technical contributions</h2><div class="research-boxes">${themes}</div></section>
    <section><h2 class="academic-section-title">Recent publications</h2><ul class="academic-updates">${recent.map((paper) => `<li><span class="update-year">${escapeHtml(paper.year)}</span><div><a href="${escapeHtml(paper.links?.[0]?.url || 'publications.html')}">${escapeHtml(paper.title)}</a><p>${escapeHtml(paper.venue || paper.status || '')}</p></div></li>`).join('')}</ul><a class="text-link" href="publications.html">All publications <span aria-hidden="true">→</span></a></section>
    <section><h2 class="academic-section-title">Peer review &amp; professional service</h2>${serviceList(data)}<p class="section-followup"><a href="learning.html">Learning notes and robotics notebooks →</a></p></section>
    <section><h2 class="academic-section-title">Selected achievements</h2>${achievementList(data)}</section>`;
}

function renderTalks(data) {
  contentRoot.innerHTML = `<section><p class="eyebrow">Academic activity</p><h1>Talks, service &amp; achievements</h1><p class="lead">Invited presentations, peer review, and academic recognition.</p><nav class="page-jump-links" aria-label="On this page"><a href="#invited-talks">Invited talks</a><a href="#service">Peer review &amp; service</a><a href="#achievements">Achievements</a></nav></section><section id="invited-talks"><h2 class="academic-section-title">Invited talks</h2>${data.talks.map(talkCard).join("")}</section><section id="service"><h2 class="academic-section-title">Peer review &amp; professional service</h2>${serviceList(data)}</section><section id="achievements"><h2 class="academic-section-title">Awards &amp; achievements</h2>${achievementList(data)}</section>`;
}

function renderAbout(data) {
  contentRoot.innerHTML = `<section class="section"><div class="container"><div class="about-grid"><img class="about-photo" src="assets/images/IMG_0773.png" alt="Md Ether Deowan" width="1100" height="1308"><div><p class="eyebrow">About</p><h1>${escapeHtml(data.profile.name)}</h1>${biography(data.profile, "bio-copy")}</div></div><div class="content-width content-center"><dl class="facts"><div><dt>Position</dt><dd>${escapeHtml(data.profile.title)}</dd></div><div><dt>Affiliation</dt><dd>${affiliationLink(data.profile)}</dd></div><div><dt>Supervisor</dt><dd>${supervisorLink(data.profile)}</dd></div></dl><h2>Research focus</h2><p>${escapeHtml(data.researchProgram.summary)}</p><h2 class="content-section-title">Selected research contributions</h2>${researchHighlights(data)}<h2 class="content-section-title">Experience</h2>${timeline(data.experience, "experience")}<h2 class="content-section-title">Education</h2>${timeline(data.education, "education")}</div></div></section>`;
}

function renderResearch(data) {
  const program = data.researchProgram;
  const supervisors = program.supervision.map((person) => {
    const affiliation = person.affiliationUrl
      ? externalLink(person.affiliationUrl, person.affiliation)
      : escapeHtml(person.affiliation);
    return `<article><p class="card-label">${escapeHtml(person.role)}</p><h3>${externalLink(person.url, person.name)}</h3><p>${affiliation}</p></article>`;
  }).join("");
  const students = program.students.map((student) => `<article class="student-card"><div class="student-meta"><span>${escapeHtml(student.area)}</span><span>${escapeHtml(student.period)}</span></div><h3>${escapeHtml(student.name)}</h3><p>${escapeHtml(student.project)}</p></article>`).join("");
  contentRoot.innerHTML = `<section class="research-hero"><div class="container research-hero-simple"><p class="eyebrow">PhD research · Field Robotics Lab</p><h1>${escapeHtml(program.title)}</h1><p class="lead">${escapeHtml(program.summary)}</p><div class="button-row"><a class="button" href="publications.html">View publications <span aria-hidden="true">→</span></a><a class="button button-secondary" href="projects.html">Explore public projects <span aria-hidden="true">→</span></a></div></div></section><section class="section"><div class="container research-context"><div><p class="eyebrow">Research challenge</p><h2>From uncertain perception to reliable action.</h2></div><p>${escapeHtml(program.context)}</p></div></section><section class="section section-muted"><div class="container"><div class="section-intro"><div><p class="eyebrow">Research focus</p><h2>Core technical themes</h2></div><p>Broad areas guiding my published research and ongoing experimental work.</p></div><div class="card-grid section-compact">${data.researchThemes.map(themeCard).join("")}</div></div></section><section class="section"><div class="container"><p class="eyebrow">Published research</p><h2>From methods to evaluated systems</h2>${researchHighlights(data)}</div></section><section class="section"><div class="container"><p class="eyebrow">Research direction</p><h2>Prediction, risk, and simulation-to-field robustness</h2><p class="research-direction-intro">The next stage of my research builds on published navigation and perception systems.</p><div class="research-boxes">${program.directions.map((item) => `<article class="research-box"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join("")}</div><p class="data-note">${escapeHtml(program.evaluation)}</p></div></section><section class="section"><div class="container"><div class="section-intro"><div><p class="eyebrow">Research environment</p><h2>Supervision and collaboration</h2></div><p>The research is conducted at NTNU’s Field Robotics Lab in collaboration with academic supervisors and student researchers.</p></div><div class="supervisor-grid">${supervisors}</div><div class="student-heading"><p class="eyebrow">Master’s supervision</p><h2>Student research topics</h2><p class="content-width">Master’s research connected to sonar perception and learning-based underwater control.</p></div><div class="student-grid">${students}</div></div></section><section class="section callout-section"><div class="container callout"><div><p class="eyebrow">Public research</p><h2>See the evidence behind the research themes.</h2></div><div class="button-row"><a class="button button-light" href="publications.html">Publications</a><a class="button button-light" href="projects.html">Technical projects</a></div></div></section>`;
}

function renderProjects(data) {
  const sortByYear = (items) => [...items].sort((a, b) => (Number.parseInt(b.year) || 0) - (Number.parseInt(a.year) || 0));
  const selected = sortByYear(data.projects.filter((project) => !project.archive));
  const archive = sortByYear(data.projects.filter((project) => project.archive));
  contentRoot.innerHTML = `<section class="section"><div class="container"><p class="eyebrow">Projects</p><h1>Research and engineering projects</h1><p class="lead content-width">Selected work in underwater robotics, autonomous systems, perception, control, and industrial automation, ordered by year.</p><div class="project-list section-compact">${selected.map(projectCard).join("")}</div><section class="project-archive"><div class="section-heading"><div><p class="eyebrow">Project archive</p><h2>Earlier engineering work</h2><p class="archive-intro">Industrial automation, embedded systems, IoT, energy, biomedical sensing, and software projects documented on the original portfolio.</p></div><span class="archive-count">${archive.length} projects</span></div><div class="archive-grid">${archive.map(projectCard).join("")}</div></section></div></section>`;
}

function publicationCard(publication) {
  const links = (publication.links || []).map((link) => externalLink(link.url, link.label)).join("");
  const doi = publication.doi ? `<span class="publication-doi">DOI: ${escapeHtml(publication.doi)}</span>` : "";
    return `<article class="publication-card"><div class="publication-meta"><span>${escapeHtml(publication.status || "Publication")}</span>${doi}</div><h3>${escapeHtml(publication.title)}</h3><p class="publication-authors">${escapeHtml(publication.authors || "")}</p><p class="publication-venue">${escapeHtml(publication.venue || "")}</p>${publication.description ? `<p class="publication-description">${escapeHtml(publication.description)}</p>` : ""}${links ? `<div class="publication-links">${links}</div>` : ""}</article>`;
}

function renderPublications(data) {
  const groups = data.publications.reduce((all, item) => ((all[item.year] ||= []).push(item), all), {});
  const scholar = data.links.find((link) => link.label === "Google Scholar");
  contentRoot.innerHTML = `<section class="section"><div class="container"><div class="publication-header"><div><p class="eyebrow">Publications</p><h1>Research output</h1><p class="lead">Conference papers and workshop contributions in robot learning, underwater autonomy, perception, control, and sensing.</p></div><div class="scholar-card"><strong>${data.publications.length}</strong><span>listed works</span>${externalLink(scholar.url, "View Google Scholar →")}</div></div><div class="publication-groups">${Object.keys(groups).sort((a, b) => Number(b) - Number(a)).map((year) => `<section><h2>${year}</h2><div class="publication-list">${groups[year].map(publicationCard).join("")}</div></section>`).join("")}</div><p class="data-note">Full texts and available publisher records are linked above. Google Scholar provides citation counts.</p></div></section>`;
}

function renderLearning(data) {
  const lessons = data.learning.map((lesson) => `<article class="learning-card-simple"><div class="learning-meta"><span>${escapeHtml(lesson.level)}</span><span>${escapeHtml(lesson.duration)}</span></div><p class="card-label">${escapeHtml(lesson.subtitle)}</p><h2><a href="${escapeHtml(lesson.url)}">${escapeHtml(lesson.title)}</a></h2><p>${escapeHtml(lesson.description)}</p><ul class="tag-list">${lesson.topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join("")}</ul><a class="text-link learning-read" href="${escapeHtml(lesson.url)}">Read the notebook on this website <span aria-hidden="true">→</span></a></article>`).join("");
  contentRoot.innerHTML = `<section class="section"><div class="container content-width"><p class="eyebrow">Learning</p><h1>Learning notes and notebooks</h1><p class="lead">Executable robotics notes presented directly on this website.</p><div class="learning-list">${lessons}</div></div></section>`;
}

function renderCv(data) {
  const skills = data.display?.showSkills === true ? `<h2 class="content-section-title">Skills</h2><div class="skills-grid">${data.skills.map((group) => `<section><h3>${escapeHtml(group.group)}</h3><ul>${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`).join("")}</div>` : "";
  contentRoot.innerHTML = `<section class="section"><div class="container content-width"><p class="eyebrow">Curriculum vitae</p><h1>Experience, education &amp; academic activity</h1><p class="lead">${escapeHtml(data.profile.tagline)}</p><h2>Research focus</h2><p>${escapeHtml(data.researchProgram.summary)}</p><h2 class="content-section-title">Selected research contributions</h2>${researchHighlights(data)}<h2 class="content-section-title">Experience</h2>${timeline(data.experience, "experience")}<h2 class="content-section-title">Education</h2>${timeline(data.education, "education")}<h2 class="content-section-title">Invited talks</h2>${data.talks.map(talkCard).join("")}<h2 class="content-section-title">Peer review &amp; professional service</h2>${serviceList(data)}<h2 class="content-section-title">Selected achievements</h2>${achievementList(data)}${skills}<p class="data-note">Updated ${escapeHtml(data.meta.cvUpdated)}.</p></div></section>`;
}

function renderContact(data) {
  contentRoot.innerHTML = `<section class="section"><div class="container content-width"><p class="eyebrow">Contact</p><h1>Get in touch</h1><p class="lead">For research, collaboration, and academic enquiries.</p><dl class="facts"><div><dt>Email</dt><dd><a href="mailto:${escapeHtml(data.profile.email)}">${escapeHtml(data.profile.email)}</a></dd></div><div><dt>Affiliation</dt><dd>${escapeHtml(data.profile.department)}<br>${affiliationLink(data.profile)}</dd></div><div><dt>Location</dt><dd>${escapeHtml(data.profile.location)}</dd></div></dl><div class="profile-links profile-links-large">${data.links.map((link) => externalLink(link.url, link.label)).join("")}</div></div></section>`;
}

const renderers = { home: renderHome, talks: renderTalks, about: renderAbout, research: renderResearch, publications: renderPublications, projects: renderProjects, learning: renderLearning, cv: renderCv, contact: renderContact };
if (contentRoot) fetch("assets/data/site.json").then((response) => { if (!response.ok) throw new Error(`Could not load site data (${response.status})`); return response.json(); }).then((data) => { renderers[document.body.dataset.page]?.(data);
  const pageContent = document.createElement("div");
  pageContent.className = "academic-content";
  while (contentRoot.firstChild) pageContent.appendChild(contentRoot.firstChild);
  contentRoot.classList.add("academic-layout", "container");
  contentRoot.innerHTML = profileSidebar(data);
  contentRoot.appendChild(pageContent);
  window.initScrollReveal?.(contentRoot); }).catch((error) => { contentRoot.innerHTML = `<section class="section"><div class="container"><h1>Content unavailable</h1><p>${escapeHtml(error.message)}</p></div></section>`; });
