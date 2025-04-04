import thumbnail001 from "./001-subdivision/thumbnail.png";
import thumbnail002 from "./002-dots/thumbnail.png";
import thumbnail003 from "./003-voronoi/thumbnail.png";
import thumbnail004 from "./004-noise/thumbnail.png";
import thumbnail005 from "./005-greybox-texture/thumbnail.png";
import thumbnail006 from "./006-shading/thumbnail.png";
import thumbnail007 from "./007-dithering/thumbnail.png";
import thumbnail008 from "./008-kuwahara/thumbnail.png";

const sketches = [
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
    thumbnail: thumbnail006,
    load: () => import("./006-shading/index.js"),
  },
  {
    id: "007-dithering",
    thumbnail: thumbnail007,
    load: () => import("./007-dithering/index.js"),
  },
  {
    id: "008-kuwahara",
    thumbnail: thumbnail008,
    load: () => import("./008-kuwahara/index.js"),
  },
];

export { sketches };
