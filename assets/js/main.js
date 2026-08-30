const navigation = [
  ["home", "Home", "index.html"],
  ["about", "About", "about.html"],
  ["research", "Research", "research.html"],
  ["publications", "Publications", "publications.html"],
  ["projects", "Projects", "projects.html"],
  ["cv", "CV", "cv.html"],
  ["contact", "Contact", "contact.html"],
];

const currentPage = document.body.dataset.page;
const header = document.querySelector("#site-header");
const footer = document.querySelector("#site-footer");

if (header) {
  const links = navigation.map(([key, label, url]) => {
    const current = key === currentPage ? ' aria-current="page"' : "";
    return `<li><a href="${url}"${current}>${label}</a></li>`;
  }).join("");

  header.innerHTML = `
    <nav class="site-nav" aria-label="Primary navigation">
      <div class="container nav-inner">
        <a class="brand" href="index.html"><span class="brand-mark">ED</span><span>Md Ether Deowan<small>Field Robotics · NTNU</small></span></a>
        <ul class="nav-links">${links}</ul>
      </div>
    </nav>`;
}

if (footer) {
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container footer-inner">
      <span>&copy; ${new Date().getFullYear()} Md Ether Deowan</span>
      <span>PhD Candidate · Field Robotics Lab, NTNU</span>
    </div>`;
}
