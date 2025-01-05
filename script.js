async function getData() {
  const response = await fetch("data.json");
  if (!response.ok) {
    throw new Error("Nie udało się załadować danych JSON");
  }
  const data = await response.json();

  const container = document.querySelector(".container");
  const filterBar = document.querySelector(".filter-bar");
  const filtersContainer = document.querySelector(".filters");
  const clearBtn = document.querySelector(".clear-btn");

  let activeFilters = new Set();

  function renderJobs() {
    container.innerHTML = ""; // Czyść poprzednie oferty
    data.forEach((job) => {
      // Zbierz wszystkie cechy oferty
      const jobFeatures = [job.role, job.level, ...job.languages, ...job.tools];

      // Filtruj oferty pracy na podstawie aktywnych filtrów
      const matchesFilters = [...activeFilters].every((filter) =>
        jobFeatures.includes(filter)
      );

      if (matchesFilters || activeFilters.size === 0) {
        // Tworzenie elementu karty
        const card = document.createElement("div");
        card.classList.add("job-card");

        if (job.new) card.classList.add("new");
        if (job.featured) card.classList.add("featured");

        card.innerHTML = `
          <div class="card-header">
            <img src="${job.logo}" alt="${
          job.company
        } logo" class="company-logo">
            <div class="company-info">
              <h3 class="company-name">${job.company}</h3>
              <div class="tags">
                ${job.new ? '<span class="tag new">NEW!</span>' : ""}
                ${
                  job.featured
                    ? '<span class="tag featured">FEATURED</span>'
                    : ""
                }
              </div>
            </div>
          </div>

          <h2 class="job-position">${job.position}</h2>

          <ul class="job-meta">
            <li>${job.postedAt}</li>
            <li>${job.contract}</li>
            <li>${job.location}</li>
          </ul>

          <hr />

          <div class="job-requirements">
            <ul>
              <li>${job.role}</li>
              <li>${job.level}</li>
              ${job.languages.map((lang) => `<li>${lang}</li>`).join("")}
              ${job.tools.map((tool) => `<li>${tool}</li>`).join("")}
            </ul>
          </div>
        `;
        container.appendChild(card);

        // Dodaj nasłuchiwanie kliknięć na cechy oferty
        card.querySelectorAll(".job-requirements li").forEach((li) => {
          li.addEventListener("click", () => {
            const filter = li.textContent;
            if (activeFilters.has(filter)) {
              activeFilters.delete(filter);
            } else {
              activeFilters.add(filter);
            }
            updateFiltersBar();
            renderJobs();
          });
        });
      }
    });
  }

  function updateFiltersBar() {
    filtersContainer.innerHTML = ""; // Czyść pasek filtrów
    activeFilters.forEach((filter) => {
      const filterTag = document.createElement("div");
      filterTag.classList.add("filter-tag");
      filterTag.innerHTML = `
        ${filter}
        <span>&times;</span>
      `;
      // Usuń filtr po kliknięciu
      filterTag.querySelector("span").addEventListener("click", () => {
        activeFilters.delete(filter);
        updateFiltersBar();
        renderJobs();
      });
      filtersContainer.appendChild(filterTag);
    });

    // Ukryj lub pokaż pasek filtrów
    filterBar.style.display = activeFilters.size > 0 ? "flex" : "none";
  }

  // Wyczyść filtry po kliknięciu przycisku „Clear”
  clearBtn.addEventListener("click", () => {
    activeFilters.clear();
    updateFiltersBar();
    renderJobs();
  });

  renderJobs();
}

getData();
