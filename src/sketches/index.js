import thumbnail000 from "./000-hello-world/thumbnail.png";
import thumbnail001 from "./001-subdivision/thumbnail.png";
import thumbnail002 from "./002-dots/thumbnail.png";
import thumbnail003 from "./003-voronoi/thumbnail.png";
import thumbnail004 from "./004-noise/thumbnail.png";
import thumbnail005 from "./005-greybox-texture/thumbnail.png";

const sketches = [
  {
    id: "000-hello-world",
    thumbnail: thumbnail000,
    load: () => import("./000-hello-world/index.js"),
  },
  {
    id: "001-subdivision",
    thumbnail: thumbnail001,
    load: () => import("./001-subdivision/index.js"),
  },
  {
    id: "002-dots",
    thumbnail: thumbnail002,
    load: () => import("./002-dots/index.js"),
  },
  {
    id: "003-voronoi",
    thumbnail: thumbnail003,
    load: () => import("./003-voronoi/index.js"),
  },
  {
    id: "004-noise",
    thumbnail: thumbnail004,
    load: () => import("./004-noise/index.js"),
  },
  {
    id: "005-greybox-texture",
    thumbnail: thumbnail005,
    load: () => import("./005-greybox-texture/index.js"),
  },
  {
    id: "006-shading",
    thumbnail: null,
    load: () => import("./006-shading/index.js"),
  },
];

export { sketches };
