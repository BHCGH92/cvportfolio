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
    document.getElementById('footer-github').href = profile.github_url
    document.getElementById('footer-linkedin').href = profile.linkedin_url
    document.getElementById('footer-email').href = 'mailto:' + profile.email
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

// Fetch work experience data
fetch("/api/work-experience/")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("experience-container");

    data.forEach((exp) => {
      container.innerHTML += `
                    <div class="mb-6 pl-4 border-l-2 border-blue-500">
                        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-100">${exp.job_title} at ${exp.company}</h4>
                        <p class="text-sm text-slate-500 dark:text-slate-400">${exp.start_date} - ${exp.is_current ? "Present" : exp.end_date}</p>
                        <p class="text-base text-slate-700 dark:text-slate-300 mt-2">${exp.description}</p>
                    </div>
                `;
    });
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
                        <p class="text-base text-slate-700 dark:text-slate-300 mt-2">${edu.description}</p>
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
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible')
        }
    })
})

document.querySelectorAll('.scroll-fade').forEach(section => {
    observer.observe(section)
})

//Mobile toggle
const themeToggleMobile = document.getElementById('theme-toggle-mobile')
if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark')
        themeToggleMobile.textContent = document.documentElement.classList.contains('dark')
            ? 'Light Mode'
            : 'Dark Mode'
    })
}