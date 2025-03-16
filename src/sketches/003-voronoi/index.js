import P5 from "p5";

import Delaunator from "delaunator";

import GUI from "lil-gui";

import randomColor from "randomcolor";

let gui;

const config = {
  numPoints: 500,
  drawDelaunay: false,
  drawCircumcenter: false,
  drawCircumcircle: false,
  drawVoronoi: false,
};

let mousePressed = false;

const colorMap = new Map();

function createRandomPoints(n, p) {
  const points = [];

  for (let i = 0; i < n; i++) {
    points.push({
      x: p.random(p.width),
      y: p.random(p.height),
    });
  }

  return points;
}

function triangulate(points) {
  console.log("points", points);

  const delaunay = Delaunator.from(
    points,
    (point) => point.x,
    (point) => point.y
  );

  console.log(
    "coords",
    arrayFromIterable(delaunay.coords),
    delaunay.coords.length
  );
  console.log(
    "triangles",
    arrayFromIterable(delaunay.triangles),
    delaunay.triangles.length
  );
  console.log(
    "halfedges",
    arrayFromIterable(delaunay.halfedges),
    delaunay.halfedges.length
  );

  return {
    coords: points,
    triangles: delaunay.triangles,
    halfedges: delaunay.halfedges,
    hull: delaunay.hull,
  };
}

const sketch = (p) => {
  let points = [],
    delaunay = [];

  function randomize() {
    points = createRandomPoints(config.numPoints, p);
    delaunay = triangulate(points);
  }

  p.setup = () => {
    gui = new GUI();

    gui.add(config, "numPoints", 10, 1000, 10);

    gui.add(config, "drawDelaunay");
    gui.add(config, "drawCircumcenter");
    gui.add(config, "drawCircumcircle");
    gui.add(config, "drawVoronoi");

    gui.onFinishChange(({ property }) => {
      if (property === "numPoints") {
        randomize();
      }
    });

    gui.add(
      {
        Randomize: () => {
          randomize();
        },
      },
      "Randomize"
    );

    p.createCanvas(p.windowWidth, p.windowHeight);

    randomize();

    const { coords, triangles, halfedges, hull } = delaunay;
  };

  p.update = () => {};

  function drawLine(x1, y1, x2, y2, color = "black") {
    p.stroke(color);
    p.strokeWeight(1);

    p.line(x1, y1, x2, y2);
  }

  function drawPoint(x, y, color = "black", size = 5) {
    p.fill(color);
    p.noStroke();

    p.ellipse(x, y, size, size);
  }

  p.draw = () => {
    p.background(255);

    p.noFill();
    p.stroke(0, 0, 255);
    p.strokeWeight(1);

    const { coords, triangles, halfedges, hull } = delaunay;

    forEachVoronoiCell(coords, delaunay, (points, vertices) => {
      const hash = simpleHash(JSON.stringify(points));

      if (!colorMap.has(hash)) {
        colorMap.set(hash, Math.random() > 0.5 ? "white" : "black");
      }

      p.fill(colorMap.get(hash));
      p.noStroke();
      p.beginShape();

      for (const [x, y] of vertices) {
        p.vertex(x, y);
      }

      p.endShape(p.CLOSE);
    });

    forEachVoronoiEdge(coords, delaunay, (e, p1, p2) => {
      config.drawVoronoi && drawLine(p1[0], p1[1], p2[0], p2[1], "red");
    });

    const trianglePointsToHighlight = [];

    forEachTriangle(coords, delaunay, (t, triangle) => {
      const [p1, p2, p3] = triangle;

      const pointInsideTriangle = isPointInsideTriangle(
        { x: p.mouseX, y: p.mouseY },
        p1,
        p2,
        p3
      );

      if (pointInsideTriangle) {
        trianglePointsToHighlight.push(p1, p2, p3);
      }

      if (pointInsideTriangle) {
        p.fill(0, 0, 255, 50);
      } else {
        p.noFill();
      }

      p.noStroke();

      config.drawDelaunay && p.triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

      const center = triangleCenter(coords, delaunay, t);

      p.fill(0, 0, 255);

      if (pointInsideTriangle) {
        config.drawCircumcenter && p.ellipse(center[0], center[1], 20, 20);
      } else {
        config.drawCircumcenter && p.ellipse(center[0], center[1], 5, 5);
      }

      const radius = p.dist(p1.x, p1.y, center[0], center[1]);

      p.noFill();
      p.stroke(0, 0, 255);
      if (pointInsideTriangle) {
        p.strokeWeight(5);
      } else {
        p.strokeWeight(1);
      }

      config.drawCircumcircle &&
        p.ellipse(center[0], center[1], radius * 2, radius * 2);

      p.fill(0);
      p.stroke(0);
      p.strokeWeight(1);
      config.drawDelaunay &&
        p.text(t, (p1.x + p2.x + p3.x) / 3, (p1.y + p2.y + p3.y) / 3);

      const adjacentTriangles = trianglesAdjacentToTriangle(delaunay, t);

      if (pointInsideTriangle) {
        // highlight adjacent triangles
        p.fill(0, 255, 0, 50);
        p.noStroke();

        for (const adjacentTriangle of adjacentTriangles) {
          const center = triangleCenter(coords, delaunay, adjacentTriangle);

          p.fill(0, 0, 255);
          config.drawDelaunay && p.ellipse(center[0], center[1], 20, 20);
        }
      }
    });

    config.drawDelaunay &&
      forEachTriangleEdge(coords, delaunay, (e, p1, p2) => {
        drawLine(p1.x, p1.y, p2.x, p2.y);

        p.noFill();
        p.stroke(0, 0, 0);
        p.strokeWeight(1);

        p.text(e, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      });

    p.fill(255, 0, 0);
    p.noStroke();

    for (let i = 0; i < points.length; i++) {
      if (
        trianglePointsToHighlight.some(
          (p) => p.x === points[i].x && p.y === points[i].y
        )
      ) {
        config.drawDelaunay && drawPoint(points[i].x, points[i].y, "blue", 20);
      } else {
        config.drawDelaunay && drawPoint(points[i].x, points[i].y);
      }
    }

    if (config.drawDelaunay && mousePressed) drawPoint(p.mouseX, p.mouseY);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.mousePressed = (e) => {
    console.log("mousePressed", e, e.target);

    if (e.target !== p.canvas) return;

    mousePressed = true;

    delaunay = triangulate([...points, { x: p.mouseX, y: p.mouseY }]);
  };

  p.mouseReleased = () => {
    mousePressed = false;

    delaunay = triangulate(points);
  };

  p.mouseDragged = () => {
    if (mousePressed) {
      delaunay = triangulate([...points, { x: p.mouseX, y: p.mouseY }]);
    }
  };
};

function render(node) {
  const instance = new P5(sketch, node);

  return () => {
    instance.remove();

    gui.destroy();
  };
}

export default render;

function arrayFromIterable(arr) {
  return Array.from(arr).join(", ");
}

/*
 * Get edges of triangle.
 *
 * @example
 * edgesOfTriangle(0); // [0, 1, 2]
 * edgesOfTriangle(1); // [3, 4, 5]
 *
 * @param {number} t - Triangle index.
 *
 * @returns {Array<number>} - Edges of triangle.
 */
function edgesOfTriangle(t) {
  const e1 = 3 * t,
    e2 = 3 * t + 1,
    e3 = 3 * t + 2;

  return [e1, e2, e3];
}

/*
 * Get triangle index of edge.
 *
 * @example
 * triangleOfEdge(0); // 0
 * triangleOfEdge(1); // 0
 * triangleOfEdge(2); // 0
 * triangleOfEdge(3); // 1
 *
 * @param {number} e - Edge index.
 *
 * @returns {number} - Triangle index.
 */
function triangleOfEdge(e) {
  const t = Math.floor(e / 3);
  return t;
}

/*
 * Get next edge of triangle.
 *
 * @example
 * nextHalfedge(0); // 1
 * nextHalfedge(1); // 2
 * nextHalfedge(2); // 0
 *
 * @param {number} e - Edge index.
 *
 * @returns {number} - Next edge index.
 */
function nextHalfedge(e) {
  return e % 3 === 2 ? e - 2 : e + 1;
}

/*
 * Get previous edge of triangle.
 *
 * @example
 * prevHalfedge(0); // 2
 * prevHalfedge(1); // 0
 * prevHalfedge(2); // 1
 *
 * @param {number} e - Edge index.
 *
 * @returns {number} - Previous edge index.
 */
function prevHalfedge(e) {
  return e % 3 === 0 ? e + 2 : e - 1;
}

/*
 * Loop over edges of each triangle and call callback with edge index, point p and point q.
 *
 * @example
 * forEachTriangleEdge(points, delaunay, (e, p, q) => {
 *   console.log(e, p, q);
 * }
 * // 0 { x: 0, y: 0 } { x: 100, y: 100 }
 * // 1 { x: 100, y: 100 } { x: 200, y: 0 }
 * // 2 { x: 200, y: 0 } { x: 0, y: 0 }
 *
 * @param {Array<{ x: number, y: number }>} points - Array of points.
 * @param {Delaunator} delaunay - Delaunator instance.
 * @param {Function} callback - Callback function.
 */
function forEachTriangleEdge(points, delaunay, callback) {
  for (let e = 0; e < delaunay.triangles.length; e++) {
    // Only iterate over each edge once. This is why we check if e > delaunay.halfedges[e].
    if (e > delaunay.halfedges[e]) {
      const p1 = points[delaunay.triangles[e]],
        p2 = points[delaunay.triangles[nextHalfedge(e)]];

      callback(e, p1, p2);
    }
  }
}

/*
 * Get points of triangle.
 *
 * @example
 * pointsOfTriangle(delaunay, 0); // [{ x: 0, y: 0 }, { x: 100, y: 100 }, { x: 200, y: 0 }]
 * pointsOfTriangle(delaunay, 1); // [{ x: 100, y: 100 }, { x: 200, y: 0 }, { x: 0, y: 0 }]
 *
 * @param {Delaunator} delaunay - Delaunator instance.
 * @param {number} t - Triangle index.
 *
 * @returns {Array<number>} - Points of triangle.
 */
function pointsOfTriangle(delaunay, t) {
  return edgesOfTriangle(t).map((e) => delaunay.triangles[e]);
}

function forEachTriangle(points, delaunay, callback) {
  for (let t = 0; t < delaunay.triangles.length / 3; t++) {
    callback(
      t,
      pointsOfTriangle(delaunay, t).map((p) => points[p])
    );
  }
}

/*
 * Get adjacent triangles of triangle.
 *
 * @example
 * trianglesAdjacentToTriangle(delaunay, 0); // [1, 2]
 * trianglesAdjacentToTriangle(delaunay, 1); // [0, 2]
 * trianglesAdjacentToTriangle(delaunay, 2); // [0, 1]
 *
 * @param {Delaunator} delaunay - Delaunator instance.
 * @param {number} t - Triangle index.
 *
 * @returns {Array<number>} - Adjacent triangles of triangle.
 */
function trianglesAdjacentToTriangle(delaunay, t) {
  const adjacentTriangles = [];

  for (const e of edgesOfTriangle(t)) {
    const opposite = delaunay.halfedges[e];

    if (opposite >= 0) {
      adjacentTriangles.push(triangleOfEdge(opposite));
    }
  }
  return adjacentTriangles;
}

/*
 * Check whether point is inside triangle using barycentric coordinates.
 *
 * @example
 * isPointInsideTriangle({ x: 100, y: 100 }, { x: 0, y: 0 }, { x: 100, y: 200 }, { x: 200, y: 0 }); // true
 *
 * @param {Object} p - Point.
 * @param {Object} p0 - Point 0 of triangle.
 * @param {Object} p1 - Point 1 of triangle.
 * @param {Object} p2 - Point 2 of triangle.
 *
 * @returns {boolean} - Whether point is inside triangle.
 */
function isPointInsideTriangle(p, p0, p1, p2) {
  const { u, v, w } = calculateBarycentricCoordinates(
    p.x,
    p.y,
    p0.x,
    p0.y,
    p1.x,
    p1.y,
    p2.x,
    p2.y
  );

  return u >= 0 && v >= 0 && w >= 0;
}

/*
 * Calculate barycentric coordinates.
 *
 * @example
 * calculateBarycentricCoordinates(100, 100, 0, 0, 100, 200, 200, 0); // { u: 0.5, v: 0.5, w: 0 }
 *
 * @param {number} x - x coordinate of point.
 * @param {number} y - y coordinate of point.
 * @param {number} x1 - x coordinate of point 1.
 * @param {number} y1 - y coordinate of point 1.
 * @param {number} x2 - x coordinate of point 2.
 * @param {number} y2 - y coordinate of point 2.
 * @param {number} x3 - x coordinate of point 3.
 * @param {number} y3 - y coordinate of point 3.
 *
 * @returns {Object} - Barycentric coordinates.
 */
function calculateBarycentricCoordinates(x, y, x1, y1, x2, y2, x3, y3) {
  // Calculate the determinant of the triangle
  const det = (x2 - x3) * (y1 - y3) - (x1 - x3) * (y2 - y3);

  // Compute barycentric coordinates
  const u = ((x2 - x3) * (y - y3) - (x - x3) * (y2 - y3)) / det;
  const v = ((x3 - x1) * (y - y3) - (x - x3) * (y3 - y1)) / det;
  const w = 1 - u - v;

  return { u, v, w };
}

/*
 * Calculate circumcenter of triangle. The circumcenter is the center of the circumcircle. The circumcircle is the circle that passes through all three points of the triangle.
 *
 * @example
 * circumcenter([0, 0], [100, 200], [200, 0]); // [100, 100]
 *
 * @param {Array<number>} a - Point 0 of triangle.
 * @param {Array<number>} b - Point 1 of triangle.
 * @param {Array<number>} c - Point 2 of triangle.
 *
 * @returns {Array<number>} - Circumcenter of triangle.
 */
function circumcenter(a, b, c) {
  const ad = a[0] * a[0] + a[1] * a[1];
  const bd = b[0] * b[0] + b[1] * b[1];
  const cd = c[0] * c[0] + c[1] * c[1];

  const D =
    2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));

  return [
    (1 / D) * (ad * (b[1] - c[1]) + bd * (c[1] - a[1]) + cd * (a[1] - b[1])),
    (1 / D) * (ad * (c[0] - b[0]) + bd * (a[0] - c[0]) + cd * (b[0] - a[0])),
  ];
}

/*
 * Get center of triangle.
 *
 * @example
 * triangleCenter(points, delaunay, 0); // [100, 100]
 *
 * @param {Array<{ x: number, y: number }>} points - Array of points.
 * @param {Delaunator} delaunay - Delaunator instance.
 * @param {number} t - Triangle index.
 *
 * @returns {Array<number>} - Center of triangle.
 */
function triangleCenter(points, delaunay, t) {
  const vertices = pointsOfTriangle(delaunay, t).map((p) => [
    points[p].x,
    points[p].y,
  ]);

  return circumcenter(vertices[0], vertices[1], vertices[2]);
}

/*
 * Loop over edges of each Voronoi cell and call callback with edge index, point p and point q.
 *
 * @example
 * forEachVoronoiEdge(points, delaunay, (e, p, q) => {
 *   console.log(e, p, q);
 * }
 *
 * @param {Array<{ x: number, y: number }>} points - Array of points.
 * @param {Delaunator} delaunay - Delaunator instance.
 * @param {Function} callback - Callback function.
 */
function forEachVoronoiEdge(points, delaunay, callback) {
  for (let e = 0; e < delaunay.triangles.length; e++) {
    if (e < delaunay.halfedges[e]) {
      const p = triangleCenter(points, delaunay, triangleOfEdge(e));
      const q = triangleCenter(
        points,
        delaunay,
        triangleOfEdge(delaunay.halfedges[e])
      );
      callback(e, p, q);
    }
  }
}

/*
 * Loop over edges around point and call callback with edge index, point p and point q.
 *
 * @example
 * edgesAroundPoint(delaunay, 0); // [0, 1, 2]
 * edgesAroundPoint(delaunay, 1); // [3, 4, 5]
 * edgesAroundPoint(delaunay, 2); // [6, 7, 8]
 *
 * @param {Delaunator} delaunay - Delaunator instance.
 * @param {number} start - Start edge index.
 *
 * @returns {Array<number>} - Edges around point.
 */
function edgesAroundPoint(delaunay, start) {
  const result = [];

  let incoming = start;

  do {
    result.push(incoming);

    const outgoing = nextHalfedge(incoming);

    incoming = delaunay.halfedges[outgoing];
  } while (incoming !== -1 && incoming !== start);

  return result;
}

/*
 * Loop over Voronoi cells and call callback with point id and vertices.
 *
 * @example
 * forEachVoronoiCell(points, delaunay, (p, vertices) => {
 *  console.log(p, vertices);
 * }
 *
 * @param {Array<{ x: number, y: number }>} points - Array of points.
 * @param {Delaunator} delaunay - Delaunator instance.
 * @param {Function} callback - Callback function.
 */
function forEachVoronoiCell(points, delaunay, callback) {
  const index = new Map(); // point id to half-edge id

  for (let e = 0; e < delaunay.triangles.length; e++) {
    const endpoint = delaunay.triangles[nextHalfedge(e)];

    if (!index.has(endpoint) || delaunay.halfedges[e] === -1) {
      index.set(endpoint, e);
    }
  }

  for (let p = 0; p < points.length; p++) {
    const incoming = index.get(p);

    const edges = edgesAroundPoint(delaunay, incoming);

    const triangles = edges.map(triangleOfEdge);

    const vertices = triangles.map((t) => triangleCenter(points, delaunay, t));

    callback(p, vertices);
  }
}

/*
 * Get hash of string.
 *
 * @example
 * simpleHash("hello"); // 99162322
 *
 * @param {string} str - String.
 *
 * @returns {number} - Hash of string.
 */
function simpleHash(str) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }

  return hash >>> 0; // Convert to unsigned integer
}
