document.addEventListener("DOMContentLoaded", function () {
  // Six common foods that all carry FODMAPs and/or histamine, so most
  // combinations turn up a meaningful shared trait.
  const DEMO_FOODS = ["Wheat", "Garlic", "Onion", "Cows Milk", "Avocado", "Strawberry"];
  const DEFAULT_CHECKED = ["Wheat", "Garlic", "Onion"];
  const TOP_TRAITS_SHOWN = 3;

  const demoFoodsContainer = document.getElementById("demoFoods");
  const demoResultText = document.getElementById("demoResultText");
  const demoTraitList = document.getElementById("demoTraitList");

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
    label.appendChild(document.createTextNode(name));
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

    if (checked.length < 2) {
      demoResultText.textContent = "Select at least two foods to see what they share.";
      return;
    }

    const topTraits = getRankedTraits(checked);

    if (topTraits.length === 0) {
      demoResultText.textContent = "These foods don't share a tracked trait — try a different combination.";
      return;
    }

    demoResultText.textContent = "Top shared traits among these " + checked.length + " foods:";
    topTraits.forEach(function (t) {
      const li = document.createElement("li");
      const label = TRAITS[t.traitId] ? TRAITS[t.traitId].label : t.traitId;
      li.textContent = t.percent + "% — " + label;
      demoTraitList.appendChild(li);
    });
  }

  recomputeDemo();
});
