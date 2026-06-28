/* =========================================================================
   articles.js — renders articles.html from ARTICLES (see articles-data.js)

   Routing is hash-based: articles.html#fiber shows the "fiber" entry from
   ARTICLES. No hash (or an unknown one) shows a landing list of all
   articles. This means any page on the site — or the analysis popup in
   script.js — can deep-link straight to a specific article with a plain
   "articles.html#someId" href, no JS changes needed here.
   ========================================================================= */

(function () {
  "use strict";

  const indexList = document.getElementById("articleIndexList");
  const content = document.getElementById("articleContent");

  // Supports **bold** within paragraph/list text, without using innerHTML.
  function appendRichText(el, text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    parts.forEach(function (part) {
      if (part.length > 4 && part.slice(0, 2) === "**" && part.slice(-2) === "**") {
        const strong = document.createElement("strong");
        strong.textContent = part.slice(2, -2);
        el.appendChild(strong);
      } else if (part) {
        el.appendChild(document.createTextNode(part));
      }
    });
  }

  function renderBlocks(container, blocks) {
    blocks.forEach(function (block) {
      if (block.type === "p") {
        const p = document.createElement("p");
        appendRichText(p, block.text);
        container.appendChild(p);
      } else if (block.type === "subheading") {
        const h3 = document.createElement("h3");
        h3.textContent = block.text;
        container.appendChild(h3);
      } else if (block.type === "list") {
        const ul = document.createElement("ul");
        block.items.forEach(function (item) {
          const li = document.createElement("li");
          appendRichText(li, item);
          ul.appendChild(li);
        });
        container.appendChild(ul);
      } else if (block.type === "note") {
        const p = document.createElement("p");
        p.className = "articleNote";
        const em = document.createElement("em");
        appendRichText(em, block.text);
        p.appendChild(em);
        container.appendChild(p);
      }
    });
  }

  function renderIndex() {
    indexList.innerHTML = "";
    Object.keys(ARTICLES).forEach(function (id) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + id;
      a.textContent = ARTICLES[id].title;
      li.appendChild(a);
      indexList.appendChild(li);
    });
  }

  function highlightActive(id) {
    indexList.querySelectorAll("a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  }

  function renderLanding() {
    content.innerHTML = "";
    const h1 = document.createElement("h1");
    h1.textContent = "Articles";
    content.appendChild(h1);
    const p = document.createElement("p");
    p.textContent = "Pick a topic from the list to read a deep dive on how it can relate to food intolerance.";
    content.appendChild(p);
    highlightActive(null);
  }

  function renderArticle(id) {
    const article = ARTICLES[id];
    if (!article) {
      renderLanding();
      return;
    }

    content.innerHTML = "";
    const h1 = document.createElement("h1");
    h1.textContent = article.title;
    content.appendChild(h1);

    article.sections.forEach(function (section) {
      if (section.heading) {
        const h2 = document.createElement("h2");
        h2.textContent = section.heading;
        content.appendChild(h2);
      }
      renderBlocks(content, section.blocks);
    });

    highlightActive(id);
  }

  function route() {
    const id = decodeURIComponent(location.hash.replace(/^#/, ""));
    renderArticle(id);
  }

  window.addEventListener("hashchange", route);
  renderIndex();
  route();
})();
