/**
 * KK Architect folder media library for Decap CMS.
 * Lets editors browse /uploads subfolders, create folders, and upload into them.
 */
(function (global) {
  var REPO = "Naitikkaklotar/architect-portfolio";
  var BRANCH = "main";
  var MEDIA_ROOT = "public/uploads";
  var PUBLIC_ROOT = "/uploads";
  var API = "https://api.github.com/repos/" + REPO;

  function token() {
    var keys = ["decap-cms-user", "netlify-cms-user"];
    for (var i = 0; i < keys.length; i++) {
      try {
        var user = JSON.parse(localStorage.getItem(keys[i]) || "null");
        if (user && user.token) return user.token;
      } catch (e) {}
    }
    return "";
  }

  function authHeaders() {
    var t = token();
    if (!t) throw new Error("Not logged in. Log in to the admin first.");
    return {
      Authorization: "Bearer " + t,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    };
  }

  function encodePath(p) {
    return String(p)
      .split("/")
      .map(encodeURIComponent)
      .join("/");
  }

  function joinPath() {
    var parts = [];
    for (var i = 0; i < arguments.length; i++) {
      var s = String(arguments[i] || "").replace(/^\/+|\/+$/g, "");
      if (s) parts.push(s);
    }
    return parts.join("/");
  }

  function isHiddenName(name) {
    return !name || name.charAt(0) === "." || name === "_opt";
  }

  function isImage(name) {
    return /\.(jpe?g|png|gif|webp|avif|svg|bmp|ico)$/i.test(name || "");
  }

  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var result = String(reader.result || "");
        var comma = result.indexOf(",");
        resolve(comma >= 0 ? result.slice(comma + 1) : result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function listDir(relPath) {
    var path = joinPath(MEDIA_ROOT, relPath);
    var url = API + "/contents/" + encodePath(path) + "?ref=" + BRANCH;
    var res = await fetch(url, { headers: authHeaders(), cache: "no-store" });
    if (res.status === 404) return [];
    if (!res.ok) throw new Error("Could not list " + path + " (" + res.status + ")");
    var data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter(function (item) {
        return !isHiddenName(item.name);
      })
      .map(function (item) {
        return {
          name: item.name,
          path: item.path,
          sha: item.sha,
          size: item.size,
          type: item.type, // file | dir
          download_url: item.download_url,
        };
      })
      .sort(function (a, b) {
        if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }

  async function uploadTo(relDir, file) {
    var repoPath = joinPath(MEDIA_ROOT, relDir, file.name);
    var content = await fileToBase64(file);
    var getUrl = API + "/contents/" + encodePath(repoPath) + "?ref=" + BRANCH;
    var existing = await fetch(getUrl, { headers: authHeaders(), cache: "no-store" });
    var sha;
    if (existing.ok) {
      var body = await existing.json();
      sha = body.sha;
    }
    var res = await fetch(API + "/contents/" + encodePath(repoPath), {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({
        message: "Upload " + file.name + (relDir ? " to " + relDir : ""),
        content: content,
        branch: BRANCH,
        sha: sha,
      }),
    });
    if (!res.ok) {
      var err = await res.text();
      throw new Error("Upload failed (" + res.status + "). " + err.slice(0, 180));
    }
    return res.json();
  }

  async function createFolder(relDir, name) {
    var clean = String(name || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!clean) throw new Error("Enter a folder name");
    var repoPath = joinPath(MEDIA_ROOT, relDir, clean, ".gitkeep");
    var content = btoa("");
    var res = await fetch(API + "/contents/" + encodePath(repoPath), {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({
        message: "Create media folder " + joinPath(relDir, clean),
        content: content,
        branch: BRANCH,
      }),
    });
    if (!res.ok && res.status !== 422) {
      throw new Error("Could not create folder (" + res.status + ")");
    }
    return clean;
  }

  async function deleteItem(item) {
    if (item.type === "dir") {
      throw new Error("Delete files inside the folder first, then remove the empty folder from GitHub if needed.");
    }
    var res = await fetch(API + "/contents/" + encodePath(item.path), {
      method: "DELETE",
      headers: authHeaders(),
      body: JSON.stringify({
        message: "Delete " + item.name,
        sha: item.sha,
        branch: BRANCH,
      }),
    });
    if (!res.ok) throw new Error("Delete failed (" + res.status + ")");
  }

  function publicUrlFor(item) {
    var rel = String(item.path || "").replace(/^public\/uploads\/?/, "");
    return PUBLIC_ROOT + "/" + rel;
  }

  function ensureStyles() {
    if (document.getElementById("kk-folder-media-css")) return;
    var style = document.createElement("style");
    style.id = "kk-folder-media-css";
    style.textContent = [
      "#kk-folder-media{position:fixed;inset:0;z-index:10000;background:rgba(28,25,23,.45);display:flex;align-items:center;justify-content:center;padding:18px}",
      "#kk-folder-media .kk-fm-modal{width:min(980px,100%);max-height:min(860px,92vh);background:#faf9f7;border:1px solid #e7e5e4;display:flex;flex-direction:column;font-family:Inter,system-ui,sans-serif;color:#1c1917}",
      "#kk-folder-media .kk-fm-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid #e7e5e4;background:#fff}",
      "#kk-folder-media .kk-fm-title{font-family:'EB Garamond',Georgia,serif;font-size:22px;margin:0}",
      "#kk-folder-media .kk-fm-crumbs{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:13px;color:#57534e}",
      "#kk-folder-media .kk-fm-crumbs button{border:0;background:transparent;color:#0f766e;cursor:pointer;padding:0;font:inherit}",
      "#kk-folder-media .kk-fm-crumbs button:disabled{color:#1c1917;cursor:default;font-weight:600}",
      "#kk-folder-media .kk-fm-toolbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:12px 16px;border-bottom:1px solid #e7e5e4;background:#fff}",
      "#kk-folder-media .kk-fm-toolbar input[type=text]{min-height:38px;border:1px solid #d6d3d1;padding:0 12px;background:#fff;flex:1;min-width:160px}",
      "#kk-folder-media .kk-fm-btn{min-height:38px;border:1px solid #1c1917;background:#1c1917;color:#fff;padding:0 14px;cursor:pointer;font-size:13px}",
      "#kk-folder-media .kk-fm-btn.ghost{background:#fff;color:#1c1917}",
      "#kk-folder-media .kk-fm-btn.danger{background:#fff;border-color:#b91c1c;color:#b91c1c}",
      "#kk-folder-media .kk-fm-btn:disabled{opacity:.45;cursor:not-allowed}",
      "#kk-folder-media .kk-fm-body{overflow:auto;padding:16px;flex:1}",
      "#kk-folder-media .kk-fm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}",
      "#kk-folder-media .kk-fm-card{border:1px solid #e7e5e4;background:#fff;cursor:pointer;text-align:left;padding:0;overflow:hidden}",
      "#kk-folder-media .kk-fm-card.selected{outline:2px solid #1c1917;outline-offset:-2px}",
      "#kk-folder-media .kk-fm-thumb{aspect-ratio:1;background:#f5f5f4;display:flex;align-items:center;justify-content:center;overflow:hidden}",
      "#kk-folder-media .kk-fm-thumb img{width:100%;height:100%;object-fit:cover}",
      "#kk-folder-media .kk-fm-thumb.folder{font-size:42px}",
      "#kk-folder-media .kk-fm-name{padding:8px 10px;font-size:12px;word-break:break-word;border-top:1px solid #e7e5e4}",
      "#kk-folder-media .kk-fm-foot{display:flex;justify-content:space-between;gap:10px;padding:12px 16px;border-top:1px solid #e7e5e4;background:#fff}",
      "#kk-folder-media .kk-fm-status{font-size:13px;color:#57534e;padding:0 16px 10px}",
      "#kk-folder-media .kk-fm-empty{padding:40px 12px;text-align:center;color:#78716c}",
      "#kk-folder-media .kk-fm-drop{border:1px dashed #a8a29e;padding:14px;margin-bottom:14px;text-align:center;color:#57534e;font-size:13px;background:#fff}",
      "#kk-folder-media .kk-fm-drop.active{border-color:#1c1917;background:#f5f5f4}",
    ].join("");
    document.head.appendChild(style);
  }

  function createLibrary() {
    var overlay = null;
    var currentPath = "";
    var items = [];
    var selected = null;
    var handleInsert = function () {};
    var busy = false;
    var statusText = "";

    function setStatus(text) {
      statusText = text || "";
      var el = overlay && overlay.querySelector(".kk-fm-status");
      if (el) el.textContent = statusText;
    }

    function crumbs() {
      var parts = currentPath ? currentPath.split("/") : [];
      var html = '<button type="button" data-crumb="">uploads</button>';
      var acc = "";
      for (var i = 0; i < parts.length; i++) {
        acc = acc ? acc + "/" + parts[i] : parts[i];
        var last = i === parts.length - 1;
        html +=
          ' <span>/</span> <button type="button" data-crumb="' +
          acc.replace(/"/g, "&quot;") +
          '"' +
          (last ? " disabled" : "") +
          ">" +
          parts[i] +
          "</button>";
      }
      return html;
    }

    function renderGrid() {
      if (!items.length) {
        return '<div class="kk-fm-empty">This folder is empty. Upload photos or create a project folder.</div>';
      }
      return (
        '<div class="kk-fm-grid">' +
        items
          .map(function (item, index) {
            var selectedClass = selected && selected.path === item.path ? " selected" : "";
            var thumb =
              item.type === "dir"
                ? '<div class="kk-fm-thumb folder" aria-hidden="true">📁</div>'
                : isImage(item.name) && item.download_url
                  ? '<div class="kk-fm-thumb"><img src="' +
                    item.download_url +
                    '" alt="" loading="lazy" /></div>'
                  : '<div class="kk-fm-thumb">📄</div>';
            return (
              '<button type="button" class="kk-fm-card' +
              selectedClass +
              '" data-index="' +
              index +
              '">' +
              thumb +
              '<div class="kk-fm-name">' +
              item.name +
              (item.type === "dir" ? "/" : "") +
              "</div></button>"
            );
          })
          .join("") +
        "</div>"
      );
    }

    function render() {
      if (!overlay) return;
      overlay.querySelector(".kk-fm-crumbs").innerHTML = crumbs();
      overlay.querySelector(".kk-fm-body-main").innerHTML = renderGrid();
      overlay.querySelector(".kk-fm-status").textContent = statusText;
      var choose = overlay.querySelector('[data-action="choose"]');
      var del = overlay.querySelector('[data-action="delete"]');
      choose.disabled = !(selected && selected.type === "file");
      del.disabled = !(selected && selected.type === "file") || busy;
      Array.prototype.forEach.call(overlay.querySelectorAll(".kk-fm-btn"), function (btn) {
        if (btn.getAttribute("data-action") === "choose" || btn.getAttribute("data-action") === "delete") return;
        btn.disabled = busy;
      });
    }

    async function refresh() {
      busy = true;
      setStatus("Loading…");
      render();
      try {
        items = await listDir(currentPath);
        selected = null;
        setStatus(
          currentPath
            ? "Folder: /uploads/" + currentPath + " · " + items.length + " items"
            : "Shared uploads · project folders appear below · " + items.length + " items"
        );
      } catch (err) {
        items = [];
        setStatus(String(err.message || err));
      }
      busy = false;
      render();
    }

    function open(insertFn) {
      handleInsert = insertFn || function () {};
      ensureStyles();
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "kk-folder-media";
        overlay.innerHTML =
          '<div class="kk-fm-modal" role="dialog" aria-modal="true" aria-label="Media folders">' +
          '<div class="kk-fm-head"><div><h2 class="kk-fm-title">Media folders</h2><div class="kk-fm-crumbs"></div></div>' +
          '<button type="button" class="kk-fm-btn ghost" data-action="close">Close</button></div>' +
          '<div class="kk-fm-toolbar">' +
          '<button type="button" class="kk-fm-btn" data-action="new-folder">+ New folder</button>' +
          '<button type="button" class="kk-fm-btn" data-action="upload">Upload here</button>' +
          '<button type="button" class="kk-fm-btn danger" data-action="delete">Delete</button>' +
          '<input type="text" data-role="search" placeholder="Filter in this folder…" />' +
          "</div>" +
          '<p class="kk-fm-status"></p>' +
          '<div class="kk-fm-body"><div class="kk-fm-drop">Drop photos here to upload into this folder</div><div class="kk-fm-body-main"></div></div>' +
          '<div class="kk-fm-foot"><span style="font-size:12px;color:#78716c">Tip: open a project folder, then upload. Shared site photos stay in uploads/.</span>' +
          '<div style="display:flex;gap:8px"><button type="button" class="kk-fm-btn ghost" data-action="close">Cancel</button>' +
          '<button type="button" class="kk-fm-btn" data-action="choose">Use selected</button></div></div>' +
          '<input type="file" accept="image/*" multiple hidden data-role="file" />' +
          "</div>";
        document.body.appendChild(overlay);

        overlay.addEventListener("click", function (e) {
          if (e.target === overlay) hide();
        });

        overlay.addEventListener("click", function (e) {
          var t = e.target.closest("[data-action], [data-crumb], [data-index]");
          if (!t) return;
          if (t.hasAttribute("data-action")) {
            var action = t.getAttribute("data-action");
            if (action === "close") hide();
            if (action === "upload") overlay.querySelector('[data-role="file"]').click();
            if (action === "new-folder") onNewFolder();
            if (action === "delete") onDelete();
            if (action === "choose") onChoose();
          } else if (t.hasAttribute("data-crumb")) {
            currentPath = t.getAttribute("data-crumb") || "";
            refresh();
          } else if (t.hasAttribute("data-index")) {
            var item = items[Number(t.getAttribute("data-index"))];
            if (!item) return;
            if (item.type === "dir") {
              currentPath = joinPath(currentPath, item.name);
              refresh();
            } else {
              selected = item;
              render();
            }
          }
        });

        overlay.addEventListener("dblclick", function (e) {
          var t = e.target.closest("[data-index]");
          if (!t) return;
          var item = items[Number(t.getAttribute("data-index"))];
          if (item && item.type === "file") {
            selected = item;
            onChoose();
          }
        });

        var fileInput = overlay.querySelector('[data-role="file"]');
        fileInput.addEventListener("change", function () {
          if (fileInput.files && fileInput.files.length) onUpload(fileInput.files);
          fileInput.value = "";
        });

        var search = overlay.querySelector('[data-role="search"]');
        search.addEventListener("input", function () {
          var q = search.value.trim().toLowerCase();
          Array.prototype.forEach.call(overlay.querySelectorAll(".kk-fm-card"), function (card) {
            var name = (card.querySelector(".kk-fm-name") || {}).textContent || "";
            card.style.display = !q || name.toLowerCase().indexOf(q) !== -1 ? "" : "none";
          });
        });

        var drop = overlay.querySelector(".kk-fm-drop");
        drop.addEventListener("dragover", function (e) {
          e.preventDefault();
          drop.classList.add("active");
        });
        drop.addEventListener("dragleave", function () {
          drop.classList.remove("active");
        });
        drop.addEventListener("drop", function (e) {
          e.preventDefault();
          drop.classList.remove("active");
          if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
            onUpload(e.dataTransfer.files);
          }
        });
      }
      overlay.style.display = "flex";
      refresh();
    }

    function hide() {
      if (overlay) overlay.style.display = "none";
    }

    async function onNewFolder() {
      var name = window.prompt("New folder name (example: vrindavan-bungalow or site-shared)");
      if (!name) return;
      busy = true;
      setStatus("Creating folder…");
      render();
      try {
        var created = await createFolder(currentPath, name);
        currentPath = joinPath(currentPath, created);
        await refresh();
        setStatus("Folder ready. Upload photos here.");
      } catch (err) {
        setStatus(String(err.message || err));
        busy = false;
        render();
      }
    }

    async function onUpload(fileList) {
      var files = Array.prototype.slice.call(fileList || []).filter(function (f) {
        return f && (/^image\//.test(f.type || "") || isImage(f.name));
      });
      if (!files.length) {
        setStatus("Choose image files to upload.");
        return;
      }
      busy = true;
      setStatus("Uploading " + files.length + " photo(s)…");
      render();
      try {
        for (var i = 0; i < files.length; i++) {
          setStatus("Uploading " + (i + 1) + " of " + files.length + ": " + files[i].name);
          await uploadTo(currentPath, files[i]);
        }
        await refresh();
        setStatus("Uploaded. The live site updates in about 2 minutes.");
      } catch (err) {
        setStatus(String(err.message || err));
        busy = false;
        render();
      }
    }

    async function onDelete() {
      if (!selected || selected.type !== "file") return;
      if (!window.confirm('Delete "' + selected.name + '"?')) return;
      busy = true;
      setStatus("Deleting…");
      render();
      try {
        await deleteItem(selected);
        await refresh();
        setStatus("Deleted.");
      } catch (err) {
        setStatus(String(err.message || err));
        busy = false;
        render();
      }
    }

    function onChoose() {
      if (!selected || selected.type !== "file") return;
      handleInsert(publicUrlFor(selected));
      hide();
    }

    return {
      show: function () {
        open(handleInsert);
      },
      open: open,
      hide: hide,
    };
  }

  var ui = createLibrary();

  var plugin = {
    name: "kk-folder-media",
    init: function (opts) {
      var insert = (opts && opts.handleInsert) || function () {};
      return Promise.resolve({
        show: function () {
          ui.open(insert);
        },
        hide: function () {
          ui.hide();
        },
        onClearControl: function () {},
        onRemoveControl: function () {},
        enableStandalone: function () {
          return true;
        },
      });
    },
  };

  global.KKFolderMediaLibrary = plugin;
})(window);
