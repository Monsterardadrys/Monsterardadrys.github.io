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
    const labels = traitIds.map(function (id) { return I18N.traitLabel(TRAITS[id]); });
    if (labels.length === 1) return labels[0];
    const or = I18N.lang() === "sv" ? " eller " : " or ";
    return labels.slice(0, -1).join(", ") + or + labels[labels.length - 1];
  }

  function render() {
    const traitIds = selectedTraits();
    Session.set("without", { traits: traitIds });
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
        li.textContent = I18N.nameOf(name);
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

  /* A saved file is a snapshot of all three tools, not just this one — see
     session.js. Loading one here restores the picked traits and leaves the
     app's selection and any meals waiting on their own pages. */
  const errorBox = document.getElementById("withoutError");

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = !message;
  }

  document.getElementById("saveSessionButton").addEventListener("click", function () {
    showError("");
    SaveLoad.save("session", Session.snapshot(), "food-intolerance-guide");
  });

  document.getElementById("loadSessionButton").addEventListener("click", function () {
    SaveLoad.load("session", function (data) {
      Session.restore(data);
      const wanted = new Set((data.without && data.without.traits) || []);
      picker.querySelectorAll("input[type='checkbox']").forEach(function (cb) {
        cb.checked = wanted.has(cb.value);
      });
      showError(wanted.size
        ? ""
        : "Loaded. That file had no traits picked here — anything it held for the " +
          "other tools is waiting on their pages.");
      render();
    }, showError);
  });

  TraitFoods.renderPicker(picker, render);

  // What was picked last time, kept in this browser — see session.js.
  const remembered = Session.get("without");
  if (remembered && Array.isArray(remembered.traits)) {
    const wanted = new Set(remembered.traits);
    picker.querySelectorAll("input[type='checkbox']").forEach(function (cb) {
      cb.checked = wanted.has(cb.value);
    });
  }

  render();
})();
