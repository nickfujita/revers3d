function initGame() {
  window.gameState = {};
  window.board = new THREE.Object3D();

  var pieceGeometry = new THREE.IcosahedronGeometry(.4, 0);

  // Constants
  var TILE_WIDTH = 19;
  var BUFFER = 3;
  var DEPTH = 1;
  var TILE_SIZE = TILE_WIDTH + BUFFER;
  var CENTER_OF_THE_UNIVERSE = new THREE.Vector3( 0, 0, 0 );

  // Tile coords
  var EDGE_LENGTH = TILE_SIZE * Math.sin( Math.PI / 4 );
  var LEG_LENGTH = TILE_SIZE * Math.sin( Math.PI / 4 );
  // face = aab
  // edge = cca
  // corner = ddd
  var MID_TILE = 1/2 * TILE_SIZE;
  var RADIUS = TILE_SIZE + LEG_LENGTH;
  var EDGE_DISTANCE = TILE_SIZE + (1/2 * LEG_LENGTH);
  var CORNER_DISTANCE = TILE_SIZE + (1/3 * LEG_LENGTH) + (1/2 * DEPTH);

  var material = { color: 0x999999/*, wireframe: true,*/ };

  /*
  ========================================
      Init game state
  ========================================
   */

  var faces = allCombos([MID_TILE, MID_TILE, RADIUS], new Tile());
  var edges = allCombos([EDGE_DISTANCE, EDGE_DISTANCE, MID_TILE], new Tile());
  var corners = allCombos([CORNER_DISTANCE, CORNER_DISTANCE, CORNER_DISTANCE], new Tile());

  // var superBoard = deepExtend({}, faces, edges, corners);

  // TODO: Make tiles and state 1:1 by migrating faces/edges/corners to singular board.
  gameState.a1 = faces[ -MID_TILE ][ RADIUS ][ MID_TILE ];
  gameState.a2 = faces[ MID_TILE ][ RADIUS ][ MID_TILE ];
  gameState.a3 = faces[ -MID_TILE ][ RADIUS ][ -MID_TILE ];
  gameState.a4 = faces[ MID_TILE ][ RADIUS ][ -MID_TILE ];
  gameState.a5 = edges[ -MID_TILE ][ EDGE_DISTANCE ][ -EDGE_DISTANCE ];
  gameState.a6 = edges[ MID_TILE ][ EDGE_DISTANCE ][ -EDGE_DISTANCE ];
  gameState.a7 = corners[ CORNER_DISTANCE ][ CORNER_DISTANCE ][ -CORNER_DISTANCE ];
  gameState.a8 = edges[ EDGE_DISTANCE ][ EDGE_DISTANCE ][ -MID_TILE ];
  gameState.b1 = edges[ EDGE_DISTANCE ][ EDGE_DISTANCE ][ MID_TILE ];
  gameState.b2 = corners[ CORNER_DISTANCE ][ CORNER_DISTANCE ][ CORNER_DISTANCE ];
  gameState.b3 = edges[ MID_TILE ][ EDGE_DISTANCE ][ EDGE_DISTANCE ];
  gameState.b4 = edges[ -MID_TILE ][ EDGE_DISTANCE ][ EDGE_DISTANCE ];
  gameState.b5 = corners[ -CORNER_DISTANCE ][ CORNER_DISTANCE ][ CORNER_DISTANCE ];
  gameState.b6 = edges[ -EDGE_DISTANCE ][ EDGE_DISTANCE ][ MID_TILE ];
  gameState.b7 = edges[ -EDGE_DISTANCE ][ EDGE_DISTANCE ][ -MID_TILE ];
  gameState.b8 = corners[ -CORNER_DISTANCE ][ CORNER_DISTANCE ][ -CORNER_DISTANCE ];
  gameState.c1 = faces[ -MID_TILE ][ MID_TILE ][ -RADIUS ];
  gameState.c2 = faces[ MID_TILE ][ MID_TILE ][ -RADIUS ];
  gameState.c3 = edges[ EDGE_DISTANCE ][ MID_TILE ][ -EDGE_DISTANCE ];
  gameState.c4 = faces[ RADIUS ][ -MID_TILE ][ -MID_TILE ];
  gameState.c5 = faces[ RADIUS ][ MID_TILE ][ MID_TILE ];
  gameState.c6 = edges[ EDGE_DISTANCE ][ MID_TILE ][ EDGE_DISTANCE ];
  gameState.c7 = faces[ MID_TILE ][ MID_TILE ][ RADIUS ];
  gameState.c8 = faces[ -MID_TILE ][ MID_TILE ][ RADIUS ];
  gameState.d1 = edges[ -EDGE_DISTANCE ][ MID_TILE ][ EDGE_DISTANCE ];
  gameState.d2 = faces[ -RADIUS ][ MID_TILE ][ MID_TILE ];
  gameState.d3 = faces[ -RADIUS ][ MID_TILE ][ -MID_TILE ];
  gameState.d4 = edges[ -EDGE_DISTANCE ][ MID_TILE ][ -EDGE_DISTANCE ];
  gameState.d5 = faces[ -MID_TILE ][ -MID_TILE ][ -RADIUS ];
  gameState.d6 = faces[ MID_TILE ][ -MID_TILE ][ -RADIUS ];
  gameState.d7 = edges[ EDGE_DISTANCE ][ -MID_TILE ][ -EDGE_DISTANCE ];
  gameState.d8 = faces[ RADIUS ][ -MID_TILE ][ MID_TILE ];
  gameState.e1 = faces[ RADIUS ][ MID_TILE ][ -MID_TILE ];
  gameState.e2 = edges[ EDGE_DISTANCE ][ -MID_TILE ][ EDGE_DISTANCE ];
  gameState.e3 = faces[ MID_TILE ][ -MID_TILE ][ RADIUS ];
  gameState.e4 = faces[ -MID_TILE ][ -MID_TILE ][ RADIUS ];
  gameState.e5 = edges[ -EDGE_DISTANCE ][ -MID_TILE ][ EDGE_DISTANCE ];
  gameState.e6 = faces[ -RADIUS ][ -MID_TILE ][ MID_TILE ];
  gameState.e7 = faces[ -RADIUS ][ -MID_TILE ][ -MID_TILE ];
  gameState.e8 = edges[ -EDGE_DISTANCE ][ -MID_TILE ][ -EDGE_DISTANCE ];
  gameState.f1 = edges[ -MID_TILE ][ -EDGE_DISTANCE ][ -EDGE_DISTANCE ];
  gameState.f2 = edges[ MID_TILE ][ -EDGE_DISTANCE ][ -EDGE_DISTANCE ];
  gameState.f3 = corners[ CORNER_DISTANCE ][ -CORNER_DISTANCE ][ -CORNER_DISTANCE ];
  gameState.f4 = edges[ EDGE_DISTANCE ][ -EDGE_DISTANCE ][ -MID_TILE ];
  gameState.f5 = edges[ EDGE_DISTANCE ][ -EDGE_DISTANCE ][ MID_TILE ];
  gameState.f6 = corners[ CORNER_DISTANCE ][ -CORNER_DISTANCE ][ CORNER_DISTANCE ];
  gameState.f7 = edges[ MID_TILE ][ -EDGE_DISTANCE ][ EDGE_DISTANCE ];
  gameState.f8 = edges[ -MID_TILE ][ -EDGE_DISTANCE ][ EDGE_DISTANCE ];
  gameState.g1 = corners[ -CORNER_DISTANCE ][ -CORNER_DISTANCE ][ CORNER_DISTANCE ];
  gameState.g2 = edges[ -EDGE_DISTANCE ][ -EDGE_DISTANCE ][ MID_TILE ];
  gameState.g3 = edges[ -EDGE_DISTANCE ][ -EDGE_DISTANCE ][ -MID_TILE ];
  gameState.g4 = corners[ -CORNER_DISTANCE ][ -CORNER_DISTANCE ][ -CORNER_DISTANCE ];
  gameState.g5 = faces[ -MID_TILE ][ -RADIUS ][ -MID_TILE ];
  gameState.g6 = faces[ MID_TILE ][ -RADIUS ][ -MID_TILE ];
  gameState.g7 = faces[ -MID_TILE ][ -RADIUS ][ MID_TILE ];
  gameState.g8 = faces[ MID_TILE ][ -RADIUS ][ MID_TILE ];

  for(var prop in gameState) {
    gameState[prop]["coord"] = prop;
  }

  // Add edges
  // TODO: double check these values
  gameState.a1.addEdge(gameState.b5, gameState.b4, gameState.b3, gameState.a2, gameState.a4, gameState.a3, gameState.b7, gameState.b6);
  gameState.a2.addEdge(gameState.b4, gameState.b3, gameState.b2, gameState.b1, gameState.a8, gameState.a4, gameState.a3, gameState.a1);
  gameState.a3.addEdge(gameState.b6, gameState.a1, gameState.a2, gameState.a4, gameState.a6, gameState.a5, gameState.b8, gameState.b7);
  gameState.a4.addEdge(gameState.a1, gameState.a2, gameState.b1, gameState.a8, gameState.a7, gameState.a6, gameState.a5, gameState.a3);
  gameState.a5.addEdge(gameState.b7, gameState.a3, gameState.a4, gameState.a6, gameState.c2, gameState.c1, gameState.d4, gameState.b8);
  gameState.a6.addEdge(gameState.a3, gameState.a4, gameState.a8, gameState.a7, gameState.c3, gameState.c2, gameState.c1, gameState.a5);
  gameState.a7.addEdge(gameState.a4, gameState.a8, gameState.c4, gameState.c3, gameState.c2, gameState.a6);
  gameState.a8.addEdge(gameState.a6, gameState.a4, gameState.a2, gameState.b1, gameState.c5, gameState.c4, gameState.c3, gameState.a7);
  gameState.b1.addEdge(gameState.a4, gameState.a2, gameState.b3, gameState.b2, gameState.c6, gameState.c5, gameState.c4, gameState.a8);
  gameState.b2.addEdge(gameState.b1, gameState.a2, gameState.b3, gameState.c7, gameState.c6, gameState.c5);
  gameState.b3.addEdge(gameState.b1, gameState.a2, gameState.a1, gameState.b4, gameState.c8, gameState.c7, gameState.c6, gameState.b2);
  gameState.b4.addEdge(gameState.a2, gameState.a1, gameState.b6, gameState.b5, gameState.d1, gameState.c8, gameState.c7, gameState.b3);
  gameState.b5.addEdge(gameState.b4, gameState.a1, gameState.b6, gameState.d2, gameState.d1, gameState.c8);
  gameState.b6.addEdge(gameState.b4, gameState.a1, gameState.a3, gameState.b7, gameState.d3, gameState.d2, gameState.d1, gameState.b5);
  gameState.b7.addEdge(gameState.a1, gameState.a3, gameState.a5, gameState.b8, gameState.d4, gameState.d3, gameState.d2, gameState.b6);
  gameState.b8.addEdge(gameState.b7, gameState.a3, gameState.a5, gameState.c1, gameState.d4, gameState.d3);
  gameState.c1.addEdge(gameState.b8, gameState.a5, gameState.a6, gameState.c2, gameState.d6, gameState.d5, gameState.e8, gameState.d4);
  gameState.c2.addEdge(gameState.a5, gameState.a6, gameState.a7, gameState.c3, gameState.d7, gameState.d6, gameState.d5, gameState.c1);
  gameState.c3.addEdge(gameState.a6, gameState.a7, gameState.a8, gameState.c4, gameState.d8, gameState.d7, gameState.d6, gameState.c2);
  gameState.c4.addEdge(gameState.a7, gameState.a8, gameState.b1, gameState.c5, gameState.e1, gameState.d8, gameState.d7, gameState.c3);
  gameState.c5.addEdge(gameState.a8, gameState.b1, gameState.b2, gameState.c6, gameState.e2, gameState.e1, gameState.d8, gameState.c4);
  gameState.c6.addEdge(gameState.b1, gameState.b2, gameState.b3, gameState.c7, gameState.e3, gameState.e2, gameState.e1, gameState.c5);
  gameState.c7.addEdge(gameState.b2, gameState.b3, gameState.b4, gameState.e8, gameState.e4, gameState.e3, gameState.e2, gameState.c6);
  gameState.c8.addEdge(gameState.b3, gameState.b4, gameState.b5, gameState.d1, gameState.e5, gameState.e4, gameState.e3, gameState.c7);
  gameState.d1.addEdge(gameState.b4, gameState.b5, gameState.b6, gameState.d2, gameState.e6, gameState.e5, gameState.e4, gameState.c8);
  gameState.d2.addEdge(gameState.b5, gameState.b6, gameState.b7, gameState.d3, gameState.e7, gameState.e6, gameState.e5, gameState.d1);
  gameState.d3.addEdge(gameState.b6, gameState.b7, gameState.b8, gameState.d4, gameState.e8, gameState.e7, gameState.e6, gameState.d2);
  gameState.d4.addEdge(gameState.b7, gameState.b8, gameState.a5, gameState.c1, gameState.d5, gameState.e8, gameState.e7, gameState.d3);
  gameState.d5.addEdge(gameState.d4, gameState.c1, gameState.c2, gameState.d6, gameState.f2, gameState.f1, gameState.g4, gameState.e8);
  gameState.d6.addEdge(gameState.c1, gameState.c2, gameState.c3, gameState.d7, gameState.f3, gameState.f2, gameState.f1, gameState.d5);
  gameState.d7.addEdge(gameState.c2, gameState.c3, gameState.c4, gameState.d8, gameState.f4, gameState.f3, gameState.f2, gameState.d6);
  gameState.d8.addEdge(gameState.c3, gameState.c4, gameState.c5, gameState.e1, gameState.f5, gameState.f4, gameState.f3, gameState.d7);
  gameState.e1.addEdge(gameState.c4, gameState.c5, gameState.c6, gameState.e2, gameState.f6, gameState.f5, gameState.f4, gameState.d8);
  gameState.e2.addEdge(gameState.c5, gameState.c6, gameState.c7, gameState.e3, gameState.f7, gameState.f6, gameState.f5, gameState.e1);
  gameState.e3.addEdge(gameState.c6, gameState.c7, gameState.c8, gameState.e4, gameState.f8, gameState.f7, gameState.f6, gameState.e2);
  gameState.e4.addEdge(gameState.c7, gameState.c8, gameState.d1, gameState.e5, gameState.g1, gameState.f8, gameState.f7, gameState.e3);
  gameState.e5.addEdge(gameState.c8, gameState.d1, gameState.d2, gameState.e6, gameState.g2, gameState.g1, gameState.f8, gameState.e4);
  gameState.e6.addEdge(gameState.d1, gameState.d2, gameState.d3, gameState.e7, gameState.g3, gameState.g2, gameState.g1, gameState.e5);
  gameState.e7.addEdge(gameState.d2, gameState.d3, gameState.d4, gameState.e8, gameState.g4, gameState.g3, gameState.g2, gameState.e6);
  gameState.e8.addEdge(gameState.d3, gameState.d4, gameState.c1, gameState.d5, gameState.f1, gameState.g4, gameState.g3, gameState.e7);
  gameState.f1.addEdge(gameState.e8, gameState.d5, gameState.d6, gameState.f2, gameState.g6, gameState.g5, gameState.g3, gameState.g4);
  gameState.f2.addEdge(gameState.d5, gameState.d6, gameState.d7, gameState.f3, gameState.f4, gameState.g6, gameState.g5, gameState.f1);
  gameState.f3.addEdge(gameState.d6, gameState.d7, gameState.d8, gameState.f4, gameState.g6, gameState.f2);
  gameState.f4.addEdge(gameState.d7, gameState.d8, gameState.e1, gameState.f5, gameState.g8, gameState.g6, gameState.f2, gameState.f3);
  gameState.f5.addEdge(gameState.d8, gameState.e1, gameState.e2, gameState.f6, gameState.f7, gameState.g8, gameState.g6, gameState.f4);
  gameState.f6.addEdge(gameState.e1, gameState.e2, gameState.e3, gameState.f7, gameState.f8, gameState.g5);
  gameState.f7.addEdge(gameState.e2, gameState.e3, gameState.e4, gameState.f8, gameState.g7, gameState.g8, gameState.f5, gameState.f6);
  gameState.f8.addEdge(gameState.e3, gameState.e4, gameState.e5, gameState.g1, gameState.g2, gameState.g7, gameState.g8, gameState.f7);
  gameState.g1.addEdge(gameState.e4, gameState.e5, gameState.e6, gameState.g2, gameState.g7, gameState.f8);
  gameState.g2.addEdge(gameState.e5, gameState.e6, gameState.e7, gameState.g3, gameState.g5, gameState.g7, gameState.f8, gameState.g1);
  gameState.g3.addEdge(gameState.e6, gameState.e7, gameState.e8, gameState.g4, gameState.f1, gameState.g5, gameState.g7, gameState.g2);
  gameState.g4.addEdge(gameState.e7, gameState.e8, gameState.d5, gameState.f1, gameState.g5, gameState.g3);
  gameState.g5.addEdge(gameState.g4, gameState.f1, gameState.f2, gameState.g6, gameState.g8, gameState.g7, gameState.g2, gameState.g3);
  gameState.g6.addEdge(gameState.f1, gameState.f2, gameState.f3, gameState.f4, gameState.f5, gameState.g8, gameState.g7, gameState.g5);
  gameState.g7.addEdge(gameState.g3, gameState.g5, gameState.g6, gameState.g8, gameState.f7, gameState.f8, gameState.g1, gameState.g2);
  gameState.g8.addEdge(gameState.g5, gameState.g6, gameState.f4, gameState.f5, gameState.f6, gameState.f7, gameState.f8, gameState.g7);

  // console.log(faces);

  // console.log('faces[ -MID_TILE ][ RADIUS ][ MID_TILE ].edges:', faces[ -MID_TILE ][ RADIUS ][ MID_TILE ].edges);

  /*
  ========================================
      Tile Geometries
  ========================================
   */

  var extrudeSettings = { amount: DEPTH, bevelEnabled: false };

  var equiTri = new THREE.Shape();
  var CORNER_WIDTH = TILE_WIDTH;
  var CORNER_HEIGHT = ( Math.sqrt(3) / 2 ) * CORNER_WIDTH;
  equiTri.moveTo( -1/2 * CORNER_WIDTH, -1/3 * CORNER_HEIGHT );
  equiTri.lineTo(0, 2/3 * CORNER_HEIGHT );
  equiTri.lineTo( 1/2 * CORNER_WIDTH, -1/3 * CORNER_HEIGHT );
  equiTri.lineTo( -1/2 * CORNER_WIDTH, -1/3 * CORNER_HEIGHT );

  var corner = new THREE.ExtrudeGeometry( equiTri, extrudeSettings );

  // Face geometry definitions
  var zFace = new THREE.BoxGeometry( TILE_WIDTH, TILE_WIDTH, DEPTH );
  var yFace = zFace.clone().rotateX( -Math.PI / 2 );
  var xFace = zFace.clone().rotateY( -Math.PI / 2 );

  // Edge geometry definitions
  var pxEdge = yFace.clone().rotateX( Math.PI / 4 );
  var nxEdge = yFace.clone().rotateX( -Math.PI / 4 );
  var pyEdge = zFace.clone().rotateY( Math.PI / 4 );
  var nyEdge = zFace.clone().rotateY( -Math.PI / 4 );
  var pzEdge = xFace.clone().rotateZ( Math.PI / 4 );
  var nzEdge = xFace.clone().rotateZ( -Math.PI / 4) ;

  /*
  ========================================
      Tile Placement
  ========================================
   */
  var geometry, mesh;

  for(var x in faces) {
    for(var y in faces[x]) {
      for(var z in faces[x][y]) {
        if(Math.abs(x) == RADIUS) {
          geometry = xFace;
        } else if(Math.abs(y) == RADIUS) {
          geometry = yFace;
        } else {
          geometry = zFace;
        }

        mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial(material) );
        mesh.position.set(x, y, z);
        mesh.userData = { stateVar: faces[x][y][z].coord };

        board.add( mesh );
      }
    }
  }

  for(var x in edges) {
    for(var y in edges[x]) {
      for(var z in edges[x][y]) {
        if(Math.abs(x) == MID_TILE) {
          geometry = y * z < 0 ? nxEdge : pxEdge;
        } else if(Math.abs(y) == MID_TILE) {
          geometry = x * z < 0 ? nyEdge : pyEdge;
        } else {
          geometry = x * y < 0 ? nzEdge : pzEdge;
        }

        mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial(material) );
        mesh.position.set(x, y, z);
        mesh.userData = { stateVar: edges[x][y][z].coord };


        board.add( mesh );
      }
    }
  }


  for(var x in corners) {
    for(var y in corners[x]) {
      for(var z in corners[x][y]) {
        corners[x][y][z].isCorner = true;

        mesh = new THREE.Mesh( corner, new THREE.MeshLambertMaterial(material) );
        mesh.position.set(x, y, z);
        mesh.userData = { stateVar: corners[x][y][z].coord };
        mesh.lookAt( CENTER_OF_THE_UNIVERSE );

        if(Math.sign(y) < 0){
          mesh.rotateZ( Math.PI / 3 );
        }

        board.add( mesh );
      }
    }
  }

  scene.add( board );
}

/*
========================================
    Helpers
========================================
 */

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



/*
========================================
    Graph Nodes (board tiles)
========================================
 */

/**
 * Constructor for individual surface of board. Has relationships with other Tiles.
 * Relationships are defined where upper and lowercase of the same letter are opposite.
 * @param {Boolean} isCorner - Whether or not constructed Tile is a corner
 */
function Tile(isCorner) {
  this.constructor = Tile;
  this.ownedBy = null;
  this.isCorner = !!isCorner;
}

/**
 * Direction in which to check for tiles for capture
 * @param  {Character} direction direction to traverse
 * @return {Number}            number of pieces captured
 */
Tile.prototype.traverse = function(direction) {

}


Tile.prototype.addEdge = function() {
  var end = this.isCorner ? 6 : 8;
  this.edges = Array.prototype.slice.call(arguments, 0, end);
}
