const scrollProgress = document.querySelector("#scrollProgress");
const backToTop = document.querySelector(".back-to-top");

document.documentElement.classList.add("js-enabled");

document.querySelectorAll("[data-letter-reveal]").forEach((target) => {
  const text = target.textContent.trim();
  target.setAttribute("aria-label", text);
  target.innerHTML = [...text]
    .map((letter, index) => {
      const character = letter === " " ? "&nbsp;" : letter;
      return `<span class="hero-letter" style="--i: ${index}" aria-hidden="true">${character}</span>`;
    })
    .join("");
});

document.querySelectorAll("[data-artifact]").forEach((slot, index) => {
  const urlInput = slot.querySelector('input[type="url"]');
  const fileInput = slot.querySelector('input[type="file"]');
  const fileName = slot.querySelector(".file-name");
  const key = `portfolio.project.${index + 1}`;
  const stored = JSON.parse(localStorage.getItem(key) || "{}");

  if (stored.url) {
    urlInput.value = stored.url;
  }

  if (stored.fileName) {
    fileName.textContent = stored.fileName;
    slot.classList.add("has-file");
  }

  urlInput.addEventListener("input", () => {
    localStorage.setItem(
      key,
      JSON.stringify({
        ...stored,
        url: urlInput.value.trim(),
        fileName: fileName.textContent,
      })
    );
  });

  fileInput.addEventListener("change", () => {
    const selected = fileInput.files?.[0]?.name || "Chưa có file";
    fileName.textContent = selected;
    slot.classList.toggle("has-file", selected !== "Chưa có file");
    localStorage.setItem(
      key,
      JSON.stringify({
        url: urlInput.value.trim(),
        fileName: selected,
      })
    );
  });
});

const revealTargets = [
  ...document.querySelectorAll(
    ".section-heading, .about-grid, .wide-split, .project-card, .summary-grid article"
  ),
];

revealTargets.forEach((target, index) => {
  target.classList.add("reveal");
  target.style.setProperty("--delay", `${Math.min(index % 6, 4) * 70}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealTargets.forEach((target) => revealObserver.observe(target));

const footer = document.querySelector(".site-footer");

if (footer) {
  const showFooterThanks = () => footer.classList.add("is-visible");
  const footerRect = footer.getBoundingClientRect();

  if (footerRect.top < window.innerHeight && footerRect.bottom > 0) {
    showFooterThanks();
  }

  const footerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        showFooterThanks();
        footerObserver.unobserve(footer);
      });
    },
    { threshold: 0.08 }
  );

  footerObserver.observe(footer);
}

const updateScrollEffects = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollProgress.style.width = `${Math.min(percent, 100)}%`;
  backToTop.classList.toggle("is-visible", window.scrollY > 520);
};

updateScrollEffects();
window.addEventListener("scroll", updateScrollEffects, { passive: true });

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const tiltX = ((x - 50) / 50) * 3;
    const tiltY = ((50 - y) / 50) * 3;

    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
    card.style.setProperty("--tilt-x", `${tiltX}deg`);
    card.style.setProperty("--tilt-y", `${tiltY}deg`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
});

const navLinks = [...document.querySelectorAll(".nav-links a")];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: "-42% 0px -48% 0px",
    threshold: 0.01,
  }
);

navSections.forEach((section) => navObserver.observe(section));
