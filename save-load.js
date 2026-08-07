/* =========================================================================
   save-load.js — write a JSON file to disk and read one back

   Nothing on this site is stored anywhere: no server, no account, no local
   storage. A saved file is the only record that survives closing the tab,
   and it never leaves the device unless the user sends it somewhere.

   Every file carries { app, tool, version } so a file from one tool cannot
   be silently loaded into another, and the saved state sits under `data`
   rather than beside them.

   THE NESTING IS NOT DECORATION. It used to be flat — Object.assign of the
   payload over the envelope — and the session's own `app` slice quietly
   overwrote the envelope's `app` identity field. Every file saved that way
   failed its own identity check on the way back in: "That file was not saved
   by this tool." A payload key can never collide with an envelope key again.
   Do not flatten it.
   ========================================================================= */

const SaveLoad = (function () {
  "use strict";

  const APP = "food-intolerance-guide";
  const FORMAT = 1;

  function stamp() {
    // 2026-08-04T13:05 -> 2026-08-04-1305, safe in a filename everywhere.
    return new Date().toISOString().slice(0, 16).replace("T", "-").replace(":", "");
  }

  function save(tool, payload, basename) {
    const data = {
      app: APP, tool: tool, version: FORMAT, saved: new Date().toISOString(),
      data: payload
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = basename + "-" + stamp() + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Revoking immediately can cancel the download in some browsers.
    setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
  }

  // Opens the file picker. `done(payload)` on success — the payload as it was
  // handed to save(), without the envelope — and `fail(message)` on a file
  // that is not ours. The caller decides how to show it.
  function load(tool, done, fail) {
    // The input has to be in the document: a detached one is ignored by
    // Safari, and by anything driving the page for a test.
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.className = "fileInput";
    document.body.appendChild(input);

    function cleanUp() {
      if (input.parentNode) input.parentNode.removeChild(input);
    }

    input.addEventListener("change", function () {
      const file = input.files && input.files[0];
      if (!file) { cleanUp(); return; }

      const reader = new FileReader();
      reader.onload = function () {
        cleanUp();
        let data;
        try {
          data = JSON.parse(reader.result);
        } catch (e) {
          fail("That file is not readable — it is not the kind of file this tool saves.");
          return;
        }
        if (!data || data.app !== APP) {
          fail("That file was not saved by this tool.");
          return;
        }
        if (data.tool !== tool) {
          fail("That file was saved by a different part of this tool" +
            (data.tool ? " (" + data.tool + ")" : "") + ".");
          return;
        }
        if (!data.data || typeof data.data !== "object") {
          fail("That file carries no saved work.");
          return;
        }
        done(data.data);
      };
      reader.onerror = function () { cleanUp(); fail("The file could not be read."); };
      reader.readAsText(file);
    });

    input.click();
  }

  return { save: save, load: load };
})();
