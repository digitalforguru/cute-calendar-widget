document.addEventListener("DOMContentLoaded", () => {
  const calendarWidget = document.getElementById("calendarWidget");
  const previewWidget = document.getElementById("previewWidget");

  const themeBtn = document.getElementById("themeBtn");
  const themeOptions = document.getElementById("themeOptions");
  const themeCircles = document.querySelectorAll(".theme-circle");

  const appearanceToggle = document.getElementById("appearanceToggle");
  const appearanceOptions = document.getElementById("appearanceOptions");
  const appearanceChoices = document.querySelectorAll(".appearance-option");

  const fontToggle = document.getElementById("fontToggle");
  const fontOptions = document.getElementById("fontOptions");
  const fontChoices = document.querySelectorAll(".font-option");

  const copyLinkBtn = document.getElementById("copyLinkBtn");
  const copyMessage = document.getElementById("copyMessage");

  const monthNameEl = document.getElementById("month-name");
  const yearNameEl = document.getElementById("year-name");
  const daysGridEl = document.getElementById("days-grid");

  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");

  const params = new URLSearchParams(window.location.search);
  const isEmbed = params.get("embed") === "true";

  if (isEmbed) {
    document.documentElement.classList.add("embed-mode");
  }

  const state = {
    theme: params.get("theme") || localStorage.getItem("calendarTheme") || "pink",
    font: params.get("font") || localStorage.getItem("calendarFont") || "default",
    appearance:
      params.get("appearance") ||
      localStorage.getItem("calendarAppearance") ||
      "system",
    month:
      params.get("month") !== null
        ? Number(params.get("month"))
        : new Date().getMonth(),
    year:
      params.get("year") !== null
        ? Number(params.get("year"))
        : new Date().getFullYear()
  };

  const themeColors = {
    pink: "#f4dfeb",
    beige: "#faebdd",
    blue: "#ddebf1",
    green: "#ddedea",
    black: "#17171a",
    white: "#f8f6f3"
  };

  const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

  function saveState() {
    localStorage.setItem("calendarTheme", state.theme);
    localStorage.setItem("calendarFont", state.font);
    localStorage.setItem("calendarAppearance", state.appearance);
  }

  function updateBothWidgets(callback) {
    [calendarWidget, previewWidget].forEach((widget) => {
      if (widget) callback(widget);
    });
  }

  function applyTheme(theme) {
    state.theme = theme || "pink";

    updateBothWidgets((widget) => {
      widget.classList.remove("pink", "beige", "blue", "green", "black", "white");
      widget.classList.add(state.theme);
    });

    if (themeBtn) {
      themeBtn.style.setProperty(
        "--theme-color",
        themeColors[state.theme] || themeColors.pink
      );

      themeBtn.style.backgroundColor =
        themeColors[state.theme] || themeColors.pink;
    }

    saveState();
  }

  function applyFont(font) {
    state.font = font || "default";

    updateBothWidgets((widget) => {
      widget.classList.remove("font-default", "font-serif", "font-mono");
      widget.classList.add(`font-${state.font}`);
    });

    saveState();
  }

  function applyAppearance(appearance) {
    state.appearance = appearance || "system";

    document.body.classList.remove(
      "appearance-light",
      "appearance-dark",
      "appearance-system"
    );

    document.body.classList.add(`appearance-${state.appearance}`);

    saveState();
  }

  function renderCalendar(month, year) {
    if (!daysGridEl || !monthNameEl || !yearNameEl) return;

    daysGridEl.innerHTML = "";

    monthNameEl.textContent = monthNames[month];
    yearNameEl.textContent = year;

    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      empty.className = "day empty-day";
      daysGridEl.appendChild(empty);
    }

    for (let day = 1; day <= lastDate; day++) {
      const dayEl = document.createElement("div");
      dayEl.className = "day";
      dayEl.textContent = day;

      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      if (isToday) dayEl.classList.add("today");

      daysGridEl.appendChild(dayEl);
    }
  }

  function closeMenus() {
    themeOptions?.classList.add("hidden");
    fontOptions?.classList.add("hidden");
    appearanceOptions?.classList.add("hidden");
  }

  themeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    themeOptions?.classList.toggle("hidden");
    fontOptions?.classList.add("hidden");
    appearanceOptions?.classList.add("hidden");
  });

  themeCircles.forEach((circle) => {
    circle.addEventListener("click", (e) => {
      e.stopPropagation();
      applyTheme(circle.dataset.theme);
      themeOptions?.classList.add("hidden");
    });
  });

  appearanceToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    appearanceOptions?.classList.toggle("hidden");
    themeOptions?.classList.add("hidden");
    fontOptions?.classList.add("hidden");
  });

  appearanceChoices.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      applyAppearance(option.dataset.appearance);
      appearanceOptions?.classList.add("hidden");
    });
  });

  fontToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    fontOptions?.classList.toggle("hidden");
    themeOptions?.classList.add("hidden");
    appearanceOptions?.classList.add("hidden");
  });

  fontChoices.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      applyFont(option.dataset.font);
      fontOptions?.classList.add("hidden");
    });
  });

  prevMonthBtn?.addEventListener("click", (e) => {
    e.stopPropagation();

    state.month--;

    if (state.month < 0) {
      state.month = 11;
      state.year--;
    }

    renderCalendar(state.month, state.year);
  });

  nextMonthBtn?.addEventListener("click", (e) => {
    e.stopPropagation();

    state.month++;

    if (state.month > 11) {
      state.month = 0;
      state.year++;
    }

    renderCalendar(state.month, state.year);
  });

  copyLinkBtn?.addEventListener("click", async (e) => {
    e.stopPropagation();

    const url =
      `${location.origin}${location.pathname}` +
      `?theme=${encodeURIComponent(state.theme)}` +
      `&font=${encodeURIComponent(state.font)}` +
      `&appearance=${encodeURIComponent(state.appearance)}` +
      `&month=${encodeURIComponent(state.month)}` +
      `&year=${encodeURIComponent(state.year)}` +
      `&embed=true`;

    await navigator.clipboard.writeText(url);

    copyMessage?.classList.remove("hidden");
    copyMessage?.classList.add("show");

    clearTimeout(window.__copyTimer);
    window.__copyTimer = setTimeout(() => {
      copyMessage?.classList.add("hidden");
      copyMessage?.classList.remove("show");
    }, 1500);
  });

  document.addEventListener("click", closeMenus);

  applyTheme(state.theme);
  applyFont(state.font);
  applyAppearance(state.appearance);
  renderCalendar(state.month, state.year);
});
