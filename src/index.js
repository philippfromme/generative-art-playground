import { sketches } from "./sketches";

const gallery = document.querySelector("#gallery"),
  sketch = document.querySelector("#sketch");

let cleanup = null;

sketches.forEach(({ id, thumbnail, load }) => {
  const anchor = document.createElement("div");

  anchor.classList.add("thumbnail");

  if (thumbnail) {
    anchor.style.backgroundImage = `url(${thumbnail})`;
  }

  anchor.addEventListener("click", async () => {
    updateURL(id);

    showSketch(id);
  });

  gallery.appendChild(anchor);
});

function updateURL(sketchId) {
  const newURL = `${window.location.pathname}#${sketchId}`;

  history.pushState({ sketchId: sketchId }, "", newURL);
}

function showGallery() {
  if (cleanup) {
    cleanup();

    cleanup = null;
  }

  gallery.classList.remove("hidden");
  sketch.classList.add("hidden");
}

function showSketch(sketchId) {
  const { load } = sketches.find(({ id }) => id === sketchId);

  load().then(async ({ default: render }) => {
    gallery.classList.add("hidden");
    sketch.classList.remove("hidden");

    cleanup = await render(sketch);
  });
}

window.addEventListener("popstate", (event) => {
  if (event.state && event.state.sketchId) {
    showSketch(event.state.sketchId);
  } else {
    showGallery();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash;

  if (hash) {
    showSketch(hash.slice(1));
  } else {
    showGallery();
  }
});
