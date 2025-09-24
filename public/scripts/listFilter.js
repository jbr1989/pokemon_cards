// Simple client-side filter for ListCardGrid items
// Filters `.cardItem` elements inside `.cards-grid` based on the input value

(function () {
  function normalize(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
  }

  function runFilter() {
    var input = document.getElementById("search-list-grid");
    var grid = document.querySelector(".cards-grid");
    if (!input || !grid) return;

    var query = normalize(input.value || "");
    var items = grid.querySelectorAll(".cardItem");

    if (!query) {
      items.forEach(function (el) {
        el.classList.remove("hidden");
      });
      return;
    }

    items.forEach(function (el) {
      // Use all visible text within the card for matching
      var text = normalize(el.textContent || "");
      if (text.includes(query)) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    });
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  onReady(function () {
    var input = document.getElementById("search-list-grid");
    if (!input) return;

    // Run once on load (in case of BFCache/restored state)
    runFilter();

    // Live filtering
    input.addEventListener("input", runFilter);
  });
})();


