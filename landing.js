document.addEventListener("DOMContentLoaded", function () {
  const DEMO_FOODS = ["Wheat", "Garlic", "Apples", "Cows Milk", "Shrimp", "Strawberry", "Coffee", "Peanut"];
  const DEFAULT_CHECKED = ["Wheat", "Garlic", "Apples"];

  const demoFoodsContainer = document.getElementById("demoFoods");
  const demoResult = document.getElementById("demoResult");

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

  function recomputeDemo() {
    const checked = Array.from(demoFoodsContainer.querySelectorAll("input:checked")).map(function (cb) { return cb.value; });

    if (checked.length < 2) {
      demoResult.textContent = "Select at least two foods to see what they share.";
      return;
    }

    const traitSets = checked.map(findFoodTraits);
    const shared = traitSets[0].filter(function (trait) {
      return traitSets.every(function (set) { return set.indexOf(trait) !== -1; });
    });

    if (shared.length === 0) {
      demoResult.textContent = "These foods don't share a tracked trait — try a different combination.";
      return;
    }

    const label = TRAITS[shared[0]] ? TRAITS[shared[0]].label : shared[0];
    demoResult.textContent = "These foods share: " + label + (shared.length > 1 ? " (and " + (shared.length - 1) + " more)" : "");
  }

  recomputeDemo();
});
