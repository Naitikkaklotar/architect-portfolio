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

  function tick() {
    relabelLogin();
    markSections();
    addSlugNote();
    hidePhotoExtras();
    preferGrid();
    remindAfterSave();
  }

  var timer;
  new MutationObserver(function () {
    clearTimeout(timer);
    timer = setTimeout(tick, 180);
  }).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", tick);
})();
