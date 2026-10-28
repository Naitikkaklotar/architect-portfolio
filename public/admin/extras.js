/* Small helpers shared by the admin and the Start page:
   1. Live-site status badge (is my change published yet?)
   2. Warning when a very large photo is picked for upload */
(function () {
  var REPO = "Naitikkaklotar/architect-portfolio";
  var SITE = "https://architect-portfolio.kkarchitect.workers.dev";

  /* ---------- 1. Live-site status ---------- */
  var badge = document.createElement("a");
  badge.id = "kk-status";
  badge.href = SITE;
  badge.target = "_blank";
  badge.rel = "noopener";
  badge.setAttribute("data-state", "loading");
  badge.innerHTML = '<span class="kk-dot"></span><span class="kk-status-text">Checking the live site…</span>';
  document.addEventListener("DOMContentLoaded", function () {
    document.body.appendChild(badge);
  });
  if (document.body) document.body.appendChild(badge);

  function ago(iso) {
    var s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return Math.round(s / 60) + " min ago";
    if (s < 86400) return Math.round(s / 3600) + " h ago";
    return Math.round(s / 86400) + " days ago";
  }

  function setState(state, text) {
    badge.setAttribute("data-state", state);
    badge.querySelector(".kk-status-text").textContent = text;
  }

  function check() {
    fetch(
      "https://api.github.com/repos/" + REPO + "/actions/runs?branch=main&per_page=1",
      { headers: { Accept: "application/vnd.github+json" } }
    )
      .then(function (r) {
        if (!r.ok) throw new Error("status " + r.status);
        return r.json();
      })
      .then(function (data) {
        var run = data.workflow_runs && data.workflow_runs[0];
        if (!run) return setState("unknown", "Live site status unavailable");
        if (run.status !== "completed") {
          return setState("busy", "Publishing… the live site updates in about 2 minutes");
        }
        if (run.conclusion === "success") {
          return setState("ok", "Live site is up to date · updated " + ago(run.updated_at));
        }
        setState("fail", "The last publish did not finish. Please tell your developer.");
      })
      .catch(function () {
        setState("unknown", "Live site status unavailable");
      });
  }
  check();
  setInterval(check, 20000);

  /* ---------- 2. Big photo warning ---------- */
  var LIMIT = 5 * 1024 * 1024;
  var toast;
  var toastTimer;

  function showToast(html) {
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "kk-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.innerHTML =
      html + '<button type="button" aria-label="Close" id="kk-toast-close">×</button>';
    toast.style.display = "block";
    document.getElementById("kk-toast-close").onclick = function () {
      toast.style.display = "none";
    };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.style.display = "none";
    }, 20000);
  }

  function inspect(files) {
    if (!files) return;
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      if (f.type && f.type.indexOf("image/") === 0 && f.size > LIMIT) {
        var mb = (f.size / 1048576).toFixed(1);
        var name = f.name.replace(/[<>&"]/g, "");
        showToast(
          "<strong>This photo is large (" +
            mb +
            " MB).</strong><br>“" +
            name +
            "” will upload slowly. For best results shrink it to about 2000 pixels wide (under 3 MB) with " +
            '<a href="https://squoosh.app" target="_blank" rel="noopener">squoosh.app</a>, then upload it again. You can still continue if you prefer.'
        );
        return;
      }
    }
  }

  document.addEventListener(
    "change",
    function (e) {
      if (e.target && e.target.type === "file") inspect(e.target.files);
    },
    true
  );
  document.addEventListener(
    "drop",
    function (e) {
      if (e.dataTransfer) inspect(e.dataTransfer.files);
    },
    true
  );
})();

/* Form structure: section headings, simpler gallery items, default photo grid,
   page-link under the title, and a reminder after Save. */
(function () {
  function labelOf(box) {
    var el = box.querySelector('[class*="FieldLabel"]');
    return el ? String(el.textContent || "").replace(/\s+/g, " ").trim() : "";
  }

  function nestedInList(box) {
    var p = box.parentElement;
    while (p) {
      var c = String(p.className || "");
      if (/ListItem-listControlItem|SortableListItem/.test(c)) return true;
      p = p.parentElement;
    }
    return false;
  }

  var SECTIONS = [
    { re: /^Project name$/i, title: "1 · About the project", first: true },
    { re: /^Cover photo$/i, title: "2 · Photos" },
    { re: /^Project description$/i, title: "3 · The story" },
    { re: /^Extra:/i, title: "4 · Optional extras  ·  leave empty if you don't need them", once: true },
  ];

  function markSections() {
    document.querySelectorAll('[class*="ControlContainer"]').forEach(function (box) {
      if (nestedInList(box)) return;
      var text = labelOf(box);
      if (!text) return;

      if (/^Extra:/i.test(text)) box.classList.add("kk-extra");

      SECTIONS.forEach(function (sec) {
        if (!sec.re.test(text)) return;
        if (box.previousElementSibling && box.previousElementSibling.classList.contains("kk-section")) return;
        if (
          sec.once &&
          Array.prototype.some.call(document.querySelectorAll(".kk-section"), function (el) {
            return el.textContent === sec.title;
          })
        ) {
          return;
        }
        var bar = document.createElement("div");
        bar.className = "kk-section" + (sec.first ? " kk-section-first" : "");
        bar.textContent = sec.title;
        box.parentNode.insertBefore(bar, box);
      });
    });
  }

  function addSlugNote() {
    document.querySelectorAll('[class*="ControlContainer"]').forEach(function (box) {
      if (nestedInList(box)) return;
      if (!/^Project name$/i.test(labelOf(box))) return;
      if (box.querySelector(".kk-slug")) return;
      var note = document.createElement("p");
      note.className = "kk-slug";
      var m = String(location.hash || "").match(/\/entries\/([^/?#]+)/);
      note.textContent = m
        ? "Page link on the website: /projects/" + decodeURIComponent(m[1])
        : "The page link is made from this name, for example Villa Sunrise → /projects/villa-sunrise. It does not change if you rename the project later.";
      box.appendChild(note);
    });
  }

  function hidePhotoExtras() {
    document.querySelectorAll('[class*="ListItem-listControlItem"], [class*="SortableListItem"]').forEach(function (item) {
      if (item.querySelector(".kk-more-btn")) return;
      var extras = [];
      item.querySelectorAll('[class*="ControlContainer"]').forEach(function (box) {
        if (/^More:/.test(labelOf(box))) extras.push(box);
      });
      if (!extras.length) return;
      extras.forEach(function (box) {
        box.classList.add("kk-photo-more");
      });
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "kk-more-btn";
      btn.textContent = "More options for this photo";
      btn.addEventListener("click", function () {
        var open = item.classList.toggle("kk-photo-open");
        btn.textContent = open ? "Hide extra options" : "More options for this photo";
      });
      extras[0].parentNode.insertBefore(btn, extras[0]);
    });
  }

  var gridTried = "";
  function preferGrid() {
    var hash = location.hash || "";
    if (!/#\/collections\/projects\/?$/.test(hash)) return;
    if (gridTried === hash) return;
    var buttons = document.querySelectorAll('[class*="ViewControlsButton"]');
    if (buttons.length < 2) return;
    var grid = buttons[buttons.length - 1];
    if (/buttonActive/.test(grid.className)) {
      gridTried = hash;
      return;
    }
    grid.click();
    gridTried = hash;
  }

  var savedOnce = false;
  function remindAfterSave() {
    var body = document.body ? document.body.innerText : "";
    var saved = /CHANGES SAVED/i.test(body);
    if (saved && !savedOnce) {
      savedOnce = true;
      var toast = document.getElementById("kk-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "kk-toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
      }
      toast.innerHTML =
        "<strong>Published.</strong> The live site updates in about 2 minutes. Then refresh the website to see it." +
        '<button type="button" aria-label="Close" id="kk-toast-close">×</button>';
      toast.style.display = "block";
      var close = document.getElementById("kk-toast-close");
      if (close) close.onclick = function () { toast.style.display = "none"; };
    }
    if (!saved) savedOnce = false;
  }

  function relabelLogin() {
    document.querySelectorAll("button").forEach(function (button) {
      if (/login with github/i.test(button.textContent || "")) {
        button.textContent = "Log in";
      }
    });
  }

  var GH_REPO = "Naitikkaklotar/architect-portfolio";

  function cmsToken() {
    var keys = ["decap-cms-user", "netlify-cms-user"];
    for (var i = 0; i < keys.length; i += 1) {
      try {
        var user = JSON.parse(localStorage.getItem(keys[i]) || "null");
        if (user && user.token) return user.token;
      } catch (e) {}
    }
    return "";
  }

  function decodeB64(b64) {
    var bin = atob(String(b64).replace(/\s/g, ""));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function encodeB64(text) {
    var bytes = new TextEncoder().encode(text);
    var bin = "";
    for (var i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  function withHidden(text, hidden) {
    var match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;
    var fm = match[1];
    var line = "hidden: " + (hidden ? "true" : "false");
    fm = /^hidden:\s*(true|false)\s*$/m.test(fm)
      ? fm.replace(/^hidden:\s*(true|false)\s*$/m, line)
      : fm + "\n" + line;
    return "---\n" + fm + "\n---" + text.slice(match[0].length);
  }

  function paintToggle(button, hidden) {
    button.setAttribute("data-on", hidden ? "0" : "1");
    button.setAttribute("aria-pressed", hidden ? "false" : "true");
    button.querySelector(".kk-vis-label").textContent = hidden ? "Hidden" : "On website";
    var card = button.closest("a");
    if (card) card.classList.toggle("kk-card-hidden", hidden);
  }

  function showNote(html) {
    var toast = document.getElementById("kk-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "kk-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.innerHTML = html + '<button type="button" aria-label="Close" id="kk-toast-close">×</button>';
    toast.style.display = "block";
    var close = document.getElementById("kk-toast-close");
    if (close) close.onclick = function () { toast.style.display = "none"; };
  }

  function mountVisibilityToggles() {
    if (!/#\/collections\/projects\/?$/.test(location.hash || "")) return;
    var token = cmsToken();
    if (!token) return;
    document.querySelectorAll('a[href*="/collections/projects/entries/"]').forEach(function (card) {
      if (card.querySelector(".kk-vis")) return;
      var match = (card.getAttribute("href") || "").match(/entries\/([^/?#]+)/);
      if (!match) return;
      var slug = decodeURIComponent(match[1]);
      var button = document.createElement("button");
      button.type = "button";
      button.className = "kk-vis";
      button.innerHTML = '<span class="kk-vis-label">…</span><span class="kk-vis-track"><span class="kk-vis-knob"></span></span>';
      button.disabled = true;
      ["pointerdown", "mousedown"].forEach(function (type) {
        button.addEventListener(type, function (event) {
          event.stopPropagation();
        });
      });
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
      });
      card.classList.add("kk-project-card");
      card.appendChild(button);

      var fileUrl =
        "https://api.github.com/repos/" + GH_REPO + "/contents/content/projects/" + slug + ".md";

      fetch(fileUrl + "?ref=main", {
        headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json" },
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (!data.content) throw new Error("missing");
          var hidden = /^hidden:\s*true\s*$/m.test(decodeB64(data.content).split("---")[1] || "");
          paintToggle(button, hidden);
          button.disabled = false;
        })
        .catch(function () {
          paintToggle(button, false);
          button.disabled = false;
        });

      button.addEventListener("click", function () {
        if (button.disabled) return;
        var nextHidden = button.getAttribute("data-on") !== "0";
        button.disabled = true;
        fetch(fileUrl + "?ref=main", {
          headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json" },
        })
          .then(function (response) { return response.json(); })
          .then(function (data) {
            var next = withHidden(decodeB64(data.content), nextHidden);
            if (!next) throw new Error("Could not update this project");
            return fetch(fileUrl, {
              method: "PUT",
              headers: {
                Authorization: "Bearer " + token,
                Accept: "application/vnd.github+json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: (nextHidden ? "Hide " : "Show ") + slug.replace(/-/g, " "),
                content: encodeB64(next),
                sha: data.sha,
                branch: "main",
              }),
            });
          })
          .then(function (response) {
            if (!response.ok) throw new Error("GitHub did not save the change");
            paintToggle(button, nextHidden);
            showNote(
              "<strong>" +
                (nextHidden ? "Hidden from the website." : "Visible on the website again.") +
                "</strong> The live site updates in about 2 minutes."
            );
          })
          .catch(function () {
            showNote("<strong>Could not change this project.</strong> Open it and use “Hide this project” instead.");
          })
          .then(function () {
            button.disabled = false;
          });
      });
    });
  }

  function tick() {
    relabelLogin();
    markSections();
    addSlugNote();
    hidePhotoExtras();
    preferGrid();
    remindAfterSave();
    mountVisibilityToggles();
  }

  var timer;
  new MutationObserver(function () {
    clearTimeout(timer);
    timer = setTimeout(tick, 180);
  }).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", tick);
})();
