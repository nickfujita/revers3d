var _MASTER_DATA = {};

_MASTER_DATA.TILE_WIDTH = 19;
_MASTER_DATA.PADDING = 3;
_MASTER_DATA.DEPTH = 1;

var tileSize = _MASTER_DATA.TILE_WIDTH + _MASTER_DATA.PADDING;
var legLength = tileSize * Math.sin( Math.PI / 4 );

var a = 1/2 * tileSize;
var b = tileSize + legLength;
var c = tileSize + (1/2 * legLength);
var d = tileSize + (1/3 * legLength) + (1/2 * _MASTER_DATA.DEPTH);

_MASTER_DATA.faces = allCombos([a, a, b], new Tile());
_MASTER_DATA.edges = allCombos([c, c, a], new Tile());
_MASTER_DATA.corners = allCombos([d, d, d], new Tile(true));

/**
 * Game state constructor - establishes the spatial relationships between tiles
 * @param {Number} a Parallel distance to the middle of a face
 * @param {Number} b Perpendicular distance along an axis to the face of the cube
 * @param {Number} c Parallel distance to the middle of an edge
 * @param {Number} d Parallel distance to the middle of a corner
 */
function GameState() {
  this.data = deepExtend({}, _MASTER_DATA);

  /*
  ========================================
      Enumerable tile states
      TODO: separate this from faces etc.
  ========================================
   */

  this.a1 = this.data.faces[ -a ][ b ][ a ];
  this.a2 = this.data.faces[ a ][ b ][ a ];
  this.a3 = this.data.faces[ -a ][ b ][ -a ];
  this.a4 = this.data.faces[ a ][ b ][ -a ];
  this.a5 = this.data.edges[ -a ][ c ][ -c ];
  this.a6 = this.data.edges[ a ][ c ][ -c ];
  this.a7 = this.data.corners[ d ][ d ][ -d ];
  this.a8 = this.data.edges[ c ][ c ][ -a ];
  this.b1 = this.data.edges[ c ][ c ][ a ];
  this.b2 = this.data.corners[ d ][ d ][ d ];
  this.b3 = this.data.edges[ a ][ c ][ c ];
  this.b4 = this.data.edges[ -a ][ c ][ c ];
  this.b5 = this.data.corners[ -d ][ d ][ d ];
  this.b6 = this.data.edges[ -c ][ c ][ a ];
  this.b7 = this.data.edges[ -c ][ c ][ -a ];
  this.b8 = this.data.corners[ -d ][ d ][ -d ];
  this.c1 = this.data.faces[ -a ][ a ][ -b ];
  this.c2 = this.data.faces[ a ][ a ][ -b ];
  this.c3 = this.data.edges[ c ][ a ][ -c ];
  this.c4 = this.data.faces[ b ][ -a ][ -a ];
  this.c5 = this.data.faces[ b ][ a ][ a ];
  this.c6 = this.data.edges[ c ][ a ][ c ];
  this.c7 = this.data.faces[ a ][ a ][ b ];
  this.c8 = this.data.faces[ -a ][ a ][ b ];
  this.d1 = this.data.edges[ -c ][ a ][ c ];
  this.d2 = this.data.faces[ -b ][ a ][ a ];
  this.d3 = this.data.faces[ -b ][ a ][ -a ];
  this.d4 = this.data.edges[ -c ][ a ][ -c ];
  this.d5 = this.data.faces[ -a ][ -a ][ -b ];
  this.d6 = this.data.faces[ a ][ -a ][ -b ];
  this.d7 = this.data.edges[ c ][ -a ][ -c ];
  this.d8 = this.data.faces[ b ][ -a ][ a ];
  this.e1 = this.data.faces[ b ][ a ][ -a ];
  this.e2 = this.data.edges[ c ][ -a ][ c ];
  this.e3 = this.data.faces[ a ][ -a ][ b ];
  this.e4 = this.data.faces[ -a ][ -a ][ b ];
  this.e5 = this.data.edges[ -c ][ -a ][ c ];
  this.e6 = this.data.faces[ -b ][ -a ][ a ];
  this.e7 = this.data.faces[ -b ][ -a ][ -a ];
  this.e8 = this.data.edges[ -c ][ -a ][ -c ];
  this.f1 = this.data.edges[ -a ][ -c ][ -c ];
  this.f2 = this.data.edges[ a ][ -c ][ -c ];
  this.f3 = this.data.corners[ d ][ -d ][ -d ];
  this.f4 = this.data.edges[ c ][ -c ][ -a ];
  this.f5 = this.data.edges[ c ][ -c ][ a ];
  this.f6 = this.data.corners[ d ][ -d ][ d ];
  this.f7 = this.data.edges[ a ][ -c ][ c ];
  this.f8 = this.data.edges[ -a ][ -c ][ c ];
  this.g1 = this.data.corners[ -d ][ -d ][ d ];
  this.g2 = this.data.edges[ -c ][ -c ][ a ];
  this.g3 = this.data.edges[ -c ][ -c ][ -a ];
  this.g4 = this.data.corners[ -d ][ -d ][ -d ];
  this.g5 = this.data.faces[ -a ][ -b ][ -a ];
  this.g6 = this.data.faces[ a ][ -b ][ -a ];
  this.g7 = this.data.faces[ -a ][ -b ][ a ];
  this.g8 = this.data.faces[ a ][ -b ][ a ];

  // Add coordinate reference
  for(var prop in this) {
    if(prop.length === 2) {
      this[prop].coord = prop;
    }
  }
}

GameState.prototype.init = function() {
  this.c1.capture(0, 0xff0000);
  this.d6.capture(0, 0xff0000);
  this.c2.capture(1, 0x1e09ff);
  this.d5.capture(1, 0x1e09ff);
}

GameState.prototype.capture = function(coord) {

}

GameState.prototype.reset = function() {
  this.data.faces = deepExtend({}, _MASTER_DATA.faces);
  this.data.edges = deepExtend({}, _MASTER_DATA.edges);
  this.data.corners = deepExtend({}, _MASTER_DATA.corners);

  this.init();
}

GameState.prototype.configure = function() {
  this.a1.addEdge(this.b5, this.b4, this.b3, this.a2, this.a4, this.a3, this.b7, this.b6);
  this.a2.addEdge(this.b4, this.b3, this.b2, this.b1, this.a8, this.a4, this.a3, this.a1);
  this.a3.addEdge(this.b6, this.a1, this.a2, this.a4, this.a6, this.a5, this.b8, this.b7);
  this.a4.addEdge(this.a1, this.a2, this.b1, this.a8, this.a7, this.a6, this.a5, this.a3);
  this.a5.addEdge(this.b7, this.a3, this.a4, this.a6, this.c2, this.c1, this.d4, this.b8);
  this.a6.addEdge(this.a3, this.a4, this.a8, this.a7, this.c3, this.c2, this.c1, this.a5);
  this.a7.addEdge(this.a6, this.a4, this.a8, this.e1, this.c3, this.c2);
  this.a8.addEdge(this.a6, this.a4, this.a2, this.b1, this.c5, this.e1, this.c3, this.a7);
  this.b1.addEdge(this.a4, this.a2, this.b3, this.b2, this.c6, this.c5, this.e1, this.a8);
  this.b2.addEdge(this.b1, this.a2, this.b3, this.c7, this.c6, this.c5);
  this.b3.addEdge(this.b1, this.a2, this.a1, this.b4, this.c8, this.c7, this.c6, this.b2);
  this.b4.addEdge(this.a2, this.a1, this.b6, this.b5, this.d1, this.c8, this.c7, this.b3);
  this.b5.addEdge(this.b4, this.a1, this.b6, this.d2, this.d1, this.c8);
  this.b6.addEdge(this.b4, this.a1, this.a3, this.b7, this.d3, this.d2, this.d1, this.b5);
  this.b7.addEdge(this.a1, this.a3, this.a5, this.b8, this.d4, this.d3, this.d2, this.b6);
  this.b8.addEdge(this.b7, this.a3, this.a5, this.c1, this.d4, this.d3);
  this.c1.addEdge(this.b8, this.a5, this.a6, this.c2, this.d6, this.d5, this.e8, this.d4);
  this.c2.addEdge(this.a5, this.a6, this.a7, this.c3, this.d7, this.d6, this.d5, this.c1);
  this.c3.addEdge(this.a6, this.a7, this.a8, this.e1, this.c4, this.d7, this.d6, this.c2);
  this.c4.addEdge(this.c3, this.e1, this.c5, this.d8, this.f5, this.f4, this.f3, this.d7);
  this.c5.addEdge(this.a8, this.b1, this.b2, this.c6, this.e2, this.e1, this.d8, this.c4);
  this.c6.addEdge(this.b1, this.b2, this.b3, this.c7, this.e3, this.e2, this.d8, this.c5);
  this.c7.addEdge(this.b2, this.b3, this.b4, this.c8, this.e4, this.e3, this.e2, this.c6);
  this.c8.addEdge(this.b3, this.b4, this.b5, this.d1, this.e5, this.e4, this.e3, this.c7);
  this.d1.addEdge(this.b4, this.b5, this.b6, this.d2, this.e6, this.e5, this.e4, this.c8);
  this.d2.addEdge(this.b5, this.b6, this.b7, this.d3, this.e7, this.e6, this.e5, this.d1);
  this.d3.addEdge(this.b6, this.b7, this.b8, this.d4, this.e8, this.e7, this.e6, this.d2);
  this.d4.addEdge(this.b7, this.b8, this.a5, this.c1, this.d5, this.e8, this.e7, this.d3);
  this.d5.addEdge(this.d4, this.c1, this.c2, this.d6, this.f2, this.f1, this.g4, this.e8);
  this.d6.addEdge(this.c1, this.c2, this.c3, this.d7, this.f3, this.f2, this.f1, this.d5);
  this.d7.addEdge(this.c2, this.c3, this.e1, this.c4, this.f4, this.f3, this.f2, this.d6);
  this.d8.addEdge(this.e1, this.c5, this.c6, this.e2, this.f6, this.f5, this.f4, this.c4);
  this.e1.addEdge(this.a7, this.a8, this.b1, this.c5, this.d8, this.c4, this.d7, this.c3);
  this.e2.addEdge(this.c5, this.c6, this.c7, this.e3, this.f7, this.f6, this.f5, this.d8);
  this.e3.addEdge(this.c6, this.c7, this.c8, this.e4, this.f8, this.f7, this.f6, this.e2);
  this.e4.addEdge(this.c7, this.c8, this.d1, this.e5, this.g1, this.f8, this.f7, this.e3);
  this.e5.addEdge(this.c8, this.d1, this.d2, this.e6, this.g2, this.g1, this.f8, this.e4);
  this.e6.addEdge(this.d1, this.d2, this.d3, this.e7, this.g3, this.g2, this.g1, this.e5);
  this.e7.addEdge(this.d2, this.d3, this.d4, this.e8, this.g4, this.g3, this.g2, this.e6);
  this.e8.addEdge(this.d3, this.d4, this.c1, this.d5, this.f1, this.g4, this.g3, this.e7);
  this.f1.addEdge(this.e8, this.d5, this.d6, this.f2, this.g6, this.g5, this.g3, this.g4);
  this.f2.addEdge(this.d5, this.d6, this.d7, this.f3, this.f4, this.g6, this.g5, this.f1);
  this.f3.addEdge(this.d6, this.d7, this.c4, this.f4, this.g6, this.f2);
  this.f4.addEdge(this.d7, this.c4, this.d8, this.f5, this.g8, this.g6, this.f2, this.f3);
  this.f5.addEdge(this.c4, this.d8, this.e2, this.f6, this.f7, this.g8, this.g6, this.f4);
  this.f6.addEdge(this.d8, this.e2, this.e3, this.f7, this.g8, this.f5);
  this.f7.addEdge(this.e2, this.e3, this.e4, this.f8, this.g7, this.g8, this.f5, this.f6);
  this.f8.addEdge(this.e3, this.e4, this.e5, this.g1, this.g2, this.g7, this.g8, this.f7);
  this.g1.addEdge(this.e4, this.e5, this.e6, this.g2, this.g7, this.f8);
  this.g2.addEdge(this.e5, this.e6, this.e7, this.g3, this.g5, this.g7, this.f8, this.g1);
  this.g3.addEdge(this.e6, this.e7, this.e8, this.g4, this.f1, this.g5, this.g7, this.g2);
  this.g4.addEdge(this.e7, this.e8, this.d5, this.f1, this.g5, this.g3);
  this.g5.addEdge(this.g4, this.f1, this.f2, this.g6, this.g8, this.g7, this.g2, this.g3);
  this.g6.addEdge(this.f1, this.f2, this.f3, this.f4, this.f5, this.g8, this.g7, this.g5);
  this.g7.addEdge(this.g3, this.g5, this.g6, this.g8, this.f7, this.f8, this.g1, this.g2);
  this.g8.addEdge(this.g5, this.g6, this.f4, this.f5, this.f6, this.f7, this.f8, this.g7);
}

function allCombos(remaining, init) {
  var objSoFar = {};

  if(remaining.length) {
    for(var i = 0; i < remaining.length; i++) {
      objSoFar[remaining[i]] = deepExtend({}, allCombos(remaining.slice(0, i).concat(remaining.slice(i+1)), init));
      objSoFar[-remaining[i]] = deepExtend({}, allCombos(remaining.slice(0, i).concat(remaining.slice(i+1)), init));
    }
  }
  else {
    objSoFar = init;
  }

  return objSoFar;
}

function deepExtend(target) {
  var sources = Array.prototype.slice.call(arguments, 1);

  for(var i = 0; i < sources.length; i++) {
    for(var key in sources[i]) {
      if(target.hasOwnProperty(key) && typeof sources[i][key] === 'object') {
        deepExtend(target[key], sources[i][key]);
      }
      else {
        target[key] = sources[i][key];
      }
    }
  }

  return target;
}
