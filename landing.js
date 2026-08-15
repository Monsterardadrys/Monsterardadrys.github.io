document.addEventListener("DOMContentLoaded", function () {
  // Six common foods that all carry FODMAPs and/or histamine, so most
  // combinations turn up a meaningful shared trait.
  const DEMO_FOODS = ["Wheat", "Garlic", "Onion", "Cows Milk (3% fat)", "Avocado", "Strawberry"];
  const DEFAULT_CHECKED = ["Wheat", "Garlic", "Onion"];
  const TOP_TRAITS_SHOWN = 3;

  /* The demo is a teaser, not the database. A food's full name carries its fat
     level so a shopper can tell two versions of it apart on the shelf; here
     there is only ever one of each, so the parenthesis is noise. Stripped for
     display only — the value behind the checkbox stays the real name. */
  function demoLabel(name) { return I18N.nameOf(name).replace(/\s*\([^)]*\)$/, ""); }

  const demoFoodsContainer = document.getElementById("demoFoods");
  const demoResultText = document.getElementById("demoResultText");
  const demoTraitList = document.getElementById("demoTraitList");
  const demoHint = document.getElementById("demoHint");
  const demoPopupOverlay = document.getElementById("demoPopupOverlay");
  const demoPopupTitle = document.getElementById("demoPopupTitle");
  const demoPopupText = document.getElementById("demoPopupText");
  const demoPopupClose = document.getElementById("demoPopupClose");

  // Small teaser popup — one sentence pulled from the same TRAITS data the
  // full app's analysis popup uses, just enough to show what's there.
  function openDemoPopup(traitId) {
    const trait = TRAITS[traitId];
    if (!trait) return;
    demoPopupTitle.textContent = I18N.traitLabel(trait);
    demoPopupText.textContent = I18N.pickList(trait, "analysis")[0];
    demoPopupOverlay.classList.add("show");
  }

  function closeDemoPopup() {
    demoPopupOverlay.classList.remove("show");
  }

  demoPopupClose.addEventListener("click", closeDemoPopup);
  demoPopupOverlay.addEventListener("click", function (e) {
    if (e.target === demoPopupOverlay) closeDemoPopup();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDemoPopup();
  });

  function findFoodTraits(name) {
    for (const category of CATEGORIES) {
      const food = category.foods.find(function (f) { return f.name === name; });
      if (food) return food.traits;
    }
    return [];
  }

  DEMO_FOODS.forEach(function (name) {
    const label = document.createElement("label");
    label.className = "checkboxStyle";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = name;
    checkbox.checked = DEFAULT_CHECKED.indexOf(name) !== -1;
    checkbox.addEventListener("change", recomputeDemo);
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(demoLabel(name)));
    demoFoodsContainer.appendChild(label);
  });

  // Ranks traits the same way the full app's summary does: how many of the
  // selected foods carry each trait, shown as a percent of the selection.
  function getRankedTraits(checked) {
    const counts = {};
    checked.forEach(function (name) {
      findFoodTraits(name).forEach(function (traitId) {
        counts[traitId] = (counts[traitId] || 0) + 1;
      });
    });

    return Object.keys(counts)
      .sort(function (a, b) { return counts[b] - counts[a]; })
      .map(function (traitId) {
        return { traitId: traitId, percent: Math.floor((counts[traitId] / checked.length) * 100) };
      })
      .slice(0, TOP_TRAITS_SHOWN);
  }

  function recomputeDemo() {
    const checked = Array.from(demoFoodsContainer.querySelectorAll("input:checked")).map(function (cb) { return cb.value; });
    demoTraitList.innerHTML = "";
    demoHint.hidden = true;

    if (checked.length < 2) {
      demoResultText.textContent = "Select at least two foods to see what they share.";
      return;
    }

    const topTraits = getRankedTraits(checked);

    if (topTraits.length === 0) {
      demoResultText.textContent = "These foods don't share a tracked trait — try a different combination.";
      return;
    }

    demoHint.hidden = false;

    demoResultText.textContent = "Top shared traits among these " + checked.length + " foods:";
    topTraits.forEach(function (t) {
      const li = document.createElement("li");
      const label = TRAITS[t.traitId] ? I18N.traitLabel(TRAITS[t.traitId]) : t.traitId;
      li.textContent = t.percent + "% — " + label;
      if (TRAITS[t.traitId]) {
        li.tabIndex = 0;
        li.setAttribute("role", "button");
        li.addEventListener("click", function () { openDemoPopup(t.traitId); });
        li.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDemoPopup(t.traitId); }
        });
      }
      demoTraitList.appendChild(li);
    });
  }

  recomputeDemo();
});
