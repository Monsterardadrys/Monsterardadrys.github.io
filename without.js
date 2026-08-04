/* =========================================================================
   without.js — drives without.html

   Pick traits, get the foods carrying none of them. The trait picker and the
   filtering both live in trait-foods.js; this file is the page wiring.

   Nothing here decides what is safe to eat, and the wording is chosen to keep
   it that way — see the comment at the top of without.html.
   ========================================================================= */

(function () {
  "use strict";

  const picker = document.getElementById("traitPicker");
  const results = document.getElementById("withoutResults");
  const clearButton = document.getElementById("clearTraitsButton");
  const printButton = document.getElementById("printWithoutButton");

  const TOTAL = CATEGORIES.reduce(function (sum, c) { return sum + c.foods.length; }, 0);

  function selectedTraits() {
    return Array.from(picker.querySelectorAll("input[type='checkbox']:checked"))
      .map(function (cb) { return cb.value; });
  }

  function joinLabels(traitIds) {
    const labels = traitIds.map(function (id) { return TRAITS[id].label; });
    if (labels.length === 1) return labels[0];
    return labels.slice(0, -1).join(", ") + " or " + labels[labels.length - 1];
  }

  function render() {
    const traitIds = selectedTraits();
    results.innerHTML = "";

    if (!traitIds.length) {
      const p = document.createElement("p");
      p.className = "withoutEmpty";
      p.textContent = "Pick at least one trait above. This database holds " + TOTAL + " foods.";
      results.appendChild(p);
      return;
    }

    const groups = TraitFoods.withoutTraits(traitIds);
    const count = groups.reduce(function (sum, g) { return sum + g.names.length; }, 0);

    const heading = document.createElement("h2");
    heading.textContent = count + " of " + TOTAL + " foods carry no " + joinLabels(traitIds);
    results.appendChild(heading);

    if (!count) {
      const p = document.createElement("p");
      p.className = "withoutEmpty";
      p.textContent = "Every food in this database carries at least one of those.";
      results.appendChild(p);
      return;
    }

    groups.forEach(function (group) {
      const h3 = document.createElement("h3");
      h3.className = "traitFoodsCategory";
      h3.textContent = group.label + " (" + group.names.length + ")";
      results.appendChild(h3);

      const ul = document.createElement("ul");
      ul.className = "traitFoodsList";
      group.names.forEach(function (name) {
        const li = document.createElement("li");
        li.textContent = name;
        ul.appendChild(li);
      });
      results.appendChild(ul);
    });

    // Repeated under every list, because this is the part that gets printed
    // and carried out of the room.
    const note = document.createElement("p");
    note.className = "traitFoodsNote";
    note.textContent = "These are the foods in this database not tagged with " +
      joinLabels(traitIds) + ". That is all it means. It is not a list of foods " +
      "that are safe for you, and it is not a diet — an untagged food can still " +
      "cause symptoms, and a list built by removing things can leave out something " +
      "you need.";
    results.appendChild(note);
  }

  clearButton.addEventListener("click", function () {
    picker.querySelectorAll("input[type='checkbox']").forEach(function (cb) { cb.checked = false; });
    render();
  });

  printButton.addEventListener("click", function () { window.print(); });

  TraitFoods.renderPicker(picker, render);
  render();
})();
