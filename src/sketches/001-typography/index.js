import P5 from 'p5';

const ROWS = 4;
const MAX_DISTANCE = 2;
const INTERVAL = 10;

function createRandom() {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    const row = [];

    for (let j = 0; j < ROWS; j++) {
      row.push(Math.round(Math.random()));
    }

    rows.push(row);
  }

  return rows;
}

function printRows(rows) {
  console.log('rows:');

  rows.forEach((row) => {
    console.log(row.join(' '));
  });
}

function isSameCoordinate(coordinate, otherCoordinate) {
  const [x, y] = coordinate,
        [otherX, otherY] = otherCoordinate;
  
  return x === otherX
    && y === otherY;
}

function getDistance(coordinate, otherCoordinate) {
  const [x, y] = coordinate,
        [otherX, otherY] = otherCoordinate;

  return Math.sqrt(Math.pow(x - otherX, 2) + Math.pow(y - otherY, 2));
}

function isConnected(coordinate, otherCoordinate, maxDistance = MAX_DISTANCE) {
  return !isSameCoordinate(coordinate, otherCoordinate) && getDistance(coordinate, otherCoordinate) <= maxDistance;
}

function isTriangle(coordinate, otherCoordinate, anotherCoordinate) {
  return !isSameCoordinate(coordinate, otherCoordinate)
    && !isSameCoordinate(otherCoordinate, anotherCoordinate)
    && !isSameCoordinate(anotherCoordinate, coordinate)
    && isConnected(coordinate, otherCoordinate)
    && isConnected(otherCoordinate, anotherCoordinate)
    && isConnected(anotherCoordinate, coordinate);
}

function getPixelCoordinate(coordinate) {
  const [x, y] = coordinate;

  return [
    50 + x * 100,
    50 + y * 100
  ];
}

function asCoordinates(rows) {
  return rows.reduce((coordinates, row, rowIndex) => {
    return [
      ...coordinates,
      ...row.reduce((_coordinates, column, columnIndex) => {
        if (column) {
          return [
            ..._coordinates,
            [ columnIndex, rowIndex ]
          ];
        }
        
        return _coordinates;
      }, [])
    ];
  }, []);
}

const example = [
  [0,0,1,1],
  [1,1,0,0],
  [1,0,0,0],
  [0,0,1,1]
];

let rows = createRandom(),
    coordinates = asCoordinates(rows);

console.log(printRows(rows));

console.log(asCoordinates);

const r = 80;

let i = 0;
let visible = true;
let xoff = 0;

let paused = false;

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(400, 400);
  }

  p.draw = () => {
    p.background(255);

    if (!paused && i % INTERVAL === 0) {
      visible = !visible;

      rows = createRandom();
      coordinates = asCoordinates(rows);

      printRows(rows);

      xoff = xoff + 1;
    }

    i++;

    if (!paused && !visible) return;

    let n = p.noise(xoff) * 3 + 1;

    // points
    coordinates.forEach((coordinate) => {
      p.fill(0);
      p.noStroke();

      p.circle(...getPixelCoordinate(coordinate), r);
      
      // lines
      coordinates.forEach(otherCoordinate => {
        if (!isConnected(coordinate, otherCoordinate, n)) return;
        
        p.noFill();
        p.stroke(255, 0, 0, 100);
        p.stroke(0);
        p.strokeWeight(80);
        p.strokeCap(p.ROUND);
        
        p.line(...getPixelCoordinate(coordinate), ...getPixelCoordinate(otherCoordinate));

        // triangles
        coordinates.forEach(anotherCoordinate => {
          if (!isTriangle(coordinate, otherCoordinate, anotherCoordinate)) return;

          p.fill(0, 255, 0, 100);
          p.fill(0);
          p.noStroke();

          p.beginShape();

          p.vertex(...getPixelCoordinate(coordinate));
          p.vertex(...getPixelCoordinate(otherCoordinate));
          p.vertex(...getPixelCoordinate(anotherCoordinate));

          p.endShape(p.CLOSE);
        });
      });
    });
  }

  p.keyPressed = () => {

    // SPACE
    if (p.keyCode === 32) {
      paused = !paused;
    }
  }
}

new P5(sketch);