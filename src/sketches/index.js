import thumbnail000 from "./000-hello-world/thumbnail.png";
import thumbnail001 from "./001-subdivision/thumbnail.png";
import thumbnail002 from "./002-dots/thumbnail.png";
import thumbnail003 from "./003-voronoi/thumbnail.png";

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
];

export { sketches };
