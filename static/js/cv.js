// Fetch profile data
fetch("/api/profile/")
  .then((response) => response.json())
  .then((data) => {
    const profile = data[0];
    document.getElementById("name").textContent = profile.full_name;
    document.getElementById("profile-image").src = profile.profile_image;
    document.getElementById("job-title").textContent = profile.job_title;
    const bioText = profile.bio
      .split("\n")
      .map((paragraph) => `<p class="mb-4">${paragraph}</p>`)
      .join("");
    document.getElementById("bio").innerHTML = bioText;
    document.getElementById("github-link").href = profile.github_url;
    document.getElementById("linkedin-link").href = profile.linkedin_url;
    document.getElementById("email-link").href = "mailto:" + profile.email;
    document.getElementById("footer-github").href = profile.github_url;
    document.getElementById("footer-linkedin").href = profile.linkedin_url;
    document.getElementById("footer-email").href = "mailto:" + profile.email;
  });

// Fetch skills data
fetch("/api/skills/")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("skills-container");

    const grouped = {};
    data.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });

    Object.keys(grouped).forEach((category) => {
      const skills = grouped[category];
      container.innerHTML += `
        <div>
          <h4 class="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">${category}</h4>
          <div class="flex flex-wrap gap-2">
            ${skills
              .map(
                (skill) => `
              <span class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm shadow-sm">
                ${skill.name}
                <span class="text-slate-400 dark:text-slate-500 text-xs ml-1">${skill.proficiency}</span>
              </span>
            `,
              )
              .join("")}
          </div>
        </div>
      `;
    });
  });

// Work Experience Year Selector
fetch("/api/work-experience/")
  .then((response) => response.json())
  .then((jobs) => {
    const currentYear = new Date().getFullYear();
    const earliestYear = Math.min(
      ...jobs.map((j) => new Date(j.start_date).getFullYear()),
    );
    const years = [
      ...new Set(jobs.map((j) => new Date(j.start_date).getFullYear())),
    ].sort((a, b) => a - b);

    let activeYearIndex = years.length - 1;

    function getJobsForYear(year) {
      return jobs.filter((job) => {
        const startYear = new Date(job.start_date).getFullYear();
        const endYear = job.is_current
          ? currentYear
          : new Date(job.end_date).getFullYear();
        return year >= startYear && year <= endYear;
      });
    }

    // Build desktop year track
    const track = document.getElementById("year-track");
    const progress = document.getElementById("track-progress");

    years.forEach((year, index) => {
      const item = document.createElement("div");
      item.className = "year-item";
      item.dataset.year = year;
      const labelClass =
        index % 2 === 0 ? "year-label-above" : "year-label-below";
      const dotColor =
        "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800";
      item.innerHTML = `
        <span class="${labelClass} text-slate-400 dark:text-slate-500">${year}</span>
        <div class="year-dot ${dotColor}"></div>
      `;
      item.addEventListener("click", () => {
        activeYearIndex = years.indexOf(year);
        updateAll();
      });
      track.appendChild(item);
    });

    function updateProgress() {
      const percentage =
        years.length <= 1 ? 0 : (activeYearIndex / (years.length - 1)) * 100;
      progress.style.width = `calc(${percentage}%)`;
    }

    function updateMobileNav() {
      const year = years[activeYearIndex];
      document.getElementById("mobile-year-number").textContent = year;
      document.getElementById("mobile-year-counter").textContent =
        `${activeYearIndex + 1} of ${years.length}`;
      document.getElementById("prev-btn").disabled = activeYearIndex === 0;
      document.getElementById("next-btn").disabled =
        activeYearIndex === years.length - 1;
    }

    window.navigateYear = function (direction) {
      const newIndex = activeYearIndex + direction;
      if (newIndex < 0 || newIndex >= years.length) return;
      activeYearIndex = newIndex;
      updateAll();
    };

    function updateAll() {
      const year = years[activeYearIndex];
      track.querySelectorAll(".year-item").forEach((item) => {
        const isActive = parseInt(item.dataset.year) === year;
        const dot = item.querySelector(".year-dot");
        const label = item.querySelector(
          ".year-label-above, .year-label-below",
        );
        dot.style.background = isActive ? "#3B82F6" : "";
        dot.style.borderColor = isActive ? "#3B82F6" : "";
        dot.style.transform = isActive ? "scale(1.3)" : "";
        dot.style.boxShadow = isActive ? "0 0 0 4px rgba(59,130,246,0.2)" : "";
        if (label) label.style.color = isActive ? "#3B82F6" : "";
      });
      updateProgress();
      updateMobileNav();
      renderCards();
    }

    function renderCards() {
      const area = document.getElementById("experience-card-area");
      const matchingJobs = getJobsForYear(years[activeYearIndex]);

      const existing = area.querySelector(".cards-wrapper");
      if (existing) {
        existing.classList.add("exit");
        setTimeout(() => existing.remove(), 300);
      }

      if (matchingJobs.length === 0) {
        setTimeout(() => {
          area.innerHTML = `
            <div class="text-center py-16 text-slate-400 dark:text-slate-500 text-sm">
              No roles recorded for ${years[activeYearIndex]}
            </div>
          `;
        }, 200);
        return;
      }

      setTimeout(() => {
        const wrapper = document.createElement("div");
        wrapper.className = "cards-wrapper flex flex-col gap-4";

        matchingJobs.forEach((job) => {
          const startYear = new Date(job.start_date).getFullYear();
          const endLabel = job.is_current
            ? "Present"
            : new Date(job.end_date).getFullYear();
          const card = document.createElement("div");
          card.className =
            "w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg transition-all duration-300";
          card.innerHTML = `
            <div class="text-xs font-bold tracking-widest text-blue-500 uppercase mb-2">💼 Work</div>
            <div class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">${job.job_title}</div>
            <div class="text-sm text-slate-500 dark:text-slate-400 mb-3">${job.company}</div>
            <div class="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full mb-4">
              <span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              ${startYear} — ${endLabel}
            </div>
            <div class="text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 pt-4 leading-relaxed">
              ${marked.parse(job.description || "")}
            </div>
          `;
          wrapper.appendChild(card);
        });

        area.innerHTML = "";
        area.appendChild(wrapper);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => wrapper.classList.add("active")),
        );
      }, 150);
    }

    updateAll();
  });

// Fetch education data
fetch("/api/education/")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("education-container");
    data.forEach((edu) => {
      container.innerHTML += `
        <div class="mb-6 pl-4 border-l-2 border-blue-500">
          <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-100">${edu.degree}</h4>
          <p class="text-sm text-slate-500 dark:text-slate-400">${edu.institution} • ${edu.start_date} - ${edu.is_current ? "Present" : edu.end_date}</p>
          <p class="text-base text-slate-700 dark:text-slate-300 mt-2">${marked.parse(edu.description || "")}</p>
        </div>
      `;
    });
  });

// Fetch projects data
fetch("/api/projects/")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("projects-container");
    data.forEach((project) => {
      container.innerHTML += `
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
          ${project.image ? `<img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">` : ""}
          <div class="p-4">
            <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-100">${project.title}</h4>
            <p class="text-sm text-slate-500 dark:text-slate-400">${project.tech_stack}</p>
            <p class="text-base text-slate-700 dark:text-slate-300 mt-2">${project.description}</p>
            <div class="flex gap-4 mt-3">
              <a href="${project.github_url}" target="_blank" class="text-blue-500 hover:text-blue-700 font-medium text-sm">GitHub</a>
              <a href="${project.live_url}" target="_blank" class="text-blue-500 hover:text-blue-700 font-medium text-sm">Live Demo</a>
            </div>
          </div>
        </div>
      `;
    });
  });

// Dark mode toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  themeToggle.textContent = document.documentElement.classList.contains("dark")
    ? "Light Mode"
    : "Dark Mode";
});

// Scroll fade-in effect
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});

document.querySelectorAll(".scroll-fade").forEach((section) => {
  observer.observe(section);
});

// Mobile toggle
const themeToggleMobile = document.getElementById("theme-toggle-mobile");
if (themeToggleMobile) {
  themeToggleMobile.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    themeToggleMobile.textContent = document.documentElement.classList.contains(
      "dark",
    )
      ? "Light Mode"
      : "Dark Mode";
  });
}
