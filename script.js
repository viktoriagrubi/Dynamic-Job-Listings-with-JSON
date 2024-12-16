// Pobieranie danych z pliku JSON i generowanie kart pracy
fetch("data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Nie udało się załadować danych JSON");
    }
    return response.json();
  })
  .then((data) => {
    const container = document.querySelector(".container");

    data.forEach((job) => {
      // Tworzenie elementu karty
      const card = document.createElement("div");
      card.classList.add("job-card");

      // Jeśli oferta jest oznaczona jako "new" lub "featured"
      if (job.new) card.classList.add("new");
      if (job.featured) card.classList.add("featured");

      // Generowanie treści karty
      card.innerHTML = `
        <div class="card-header">
          <img src="${job.logo}" alt="${job.company} logo" class="company-logo">
          <div class="company-info">
            <h3 class="company-name">${job.company}</h3>
            <div class="tags">
              ${job.new ? '<span class="tag new">NEW!</span>' : ""}
              ${
                job.featured ? '<span class="tag featured">FEATURED</span>' : ""
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

      // Dodanie karty do kontenera
      container.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Błąd:", error);
  });
