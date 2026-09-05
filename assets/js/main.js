const navigation = [
  ["home", "Home", "index.html"],
  ["about", "About", "about.html"],
  ["research", "Research", "research.html"],
  ["publications", "Publications", "publications.html"],
  ["projects", "Projects", "projects.html"],
  ["learning", "Learning", "learning.html"],
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

const scrollProgress = document.createElement("div");
scrollProgress.className = "scroll-progress";
document.body.appendChild(scrollProgress);
let progressTicking = false;
window.addEventListener("scroll", () => {
  if (progressTicking) return;
  progressTicking = true;
  requestAnimationFrame(() => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    scrollProgress.style.width = `${scrollable > 0 ? Math.min(100, (doc.scrollTop / scrollable) * 100) : 0}%`;
    progressTicking = false;
  });
}, { passive: true });

function initScrollReveal(root = document) {
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const selector = ".card, .timeline-item, .theme-card, .publication-card, .metrics-grid article, .case-figure, .student-card, .learning-card-simple, .service-list article, .supervisor-grid article";
  const targets = [...root.querySelectorAll(selector)].filter((el) => !el.dataset.revealed);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  targets.forEach((el, index) => {
    el.dataset.revealed = "1";
    el.classList.add("reveal-init");
    el.style.transitionDelay = `${(index % 6) * 60}ms`;
    io.observe(el);
  });
}
window.initScrollReveal = initScrollReveal;
initScrollReveal();
