const calendarWidget = document.getElementById("calendarWidget");

/* =========================
   🎨 BUILDER UI ELEMENTS
========================= */

const themeBtn = document.getElementById("themeBtn");
const themeOptions = document.getElementById("themeOptions");
const themeCircles = document.querySelectorAll(".theme-circle");

const fontToggle = document.getElementById("fontToggle");
const fontOptions = document.getElementById("fontOptions");
const fontChoices = document.querySelectorAll(".font-option");

const copyLinkBtn = document.getElementById("copyLinkBtn");
const copyMessage = document.getElementById("copyMessage");

/* =========================
   📅 CALENDAR ELEMENTS
========================= */

const monthNameEl = document.getElementById("month-name");
const yearNameEl = document.getElementById("year-name");
const daysGridEl = document.getElementById("days-grid");

const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

/* =========================
   🎨 THEME SYSTEM
========================= */

themeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  themeOptions.classList.toggle("hidden");
});

themeCircles.forEach(circle => {
  circle.addEventListener("click", () => {
    const theme = circle.getAttribute("data-theme");

    calendarWidget.className = `widget ${theme} calendar-widget`;

    localStorage.setItem("calendarTheme", theme);
    themeOptions.classList.add("hidden");
  });
});

/* =========================
   🔤 FONT SYSTEM
========================= */

fontToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  fontOptions.classList.toggle("hidden");
});

fontChoices.forEach(option => {
  option.addEventListener("click", () => {
    const font = option.getAttribute("data-font");

    calendarWidget.classList.remove("font-default", "font-serif", "font-mono");
    calendarWidget.classList.add(`font-${font}`);

    localStorage.setItem("calendarFont", font);
    fontOptions.classList.add("hidden");
  });
});

/* =========================
   📋 COPY SYSTEM
========================= */

function copyLink() {
  const base = window.location.origin + window.location.pathname;

  const url = `${base}?widget=calendar&embed=true`;

  navigator.clipboard.writeText(url);

  copyMessage.classList.remove("hidden");
  copyMessage.classList.add("show");

  setTimeout(() => {
    copyMessage.classList.add("hidden");
    copyMessage.classList.remove("show");
  }, 2000);
}

copyLinkBtn.addEventListener("click", copyLink);

/* =========================
   📅 CALENDAR LOGIC
========================= */

const monthNames = [
  "january","february","march","april","may","june",
  "july","august","september","october","november","december"
];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function renderCalendar(month, year) {
  daysGridEl.innerHTML = "";

  monthNameEl.textContent = monthNames[month];
  yearNameEl.textContent = year;

  const today = new Date();
  today.setHours(0,0,0,0);

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const weekdays = ["s","m","t","w","t","f","s"];

  // header
  weekdays.forEach(d => {
    const el = document.createElement("div");
    el.className = "day-name";
    el.textContent = d;
    daysGridEl.appendChild(el);
  });

  // blanks
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    daysGridEl.appendChild(empty);
  }

  // days
  for (let day = 1; day <= lastDate; day++) {
    const dayEl = document.createElement("div");
    dayEl.classList.add("day");

    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    if (isToday) dayEl.classList.add("today");

    dayEl.textContent = day;

    daysGridEl.appendChild(dayEl);
  }
}
/* =========================
   ⬅️➡️ NAVIGATION
========================= */

prevMonthBtn.addEventListener("click", () => {
  currentMonth--;

  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }

  renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener("click", () => {
  currentMonth++;

  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }

  renderCalendar(currentMonth, currentYear);
});

/* =========================
   🚀 INIT
========================= */

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("calendarTheme") || "pink";
  const savedFont = localStorage.getItem("calendarFont") || "default";

  calendarWidget.className = `widget ${savedTheme} calendar-widget`;
  calendarWidget.classList.add(`font-${savedFont}`);

  renderCalendar(currentMonth, currentYear);
});
