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
  var a = 1/2 * TILE_SIZE;
  var b = TILE_SIZE + LEG_LENGTH;
  var c = TILE_SIZE + (1/2 * LEG_LENGTH);
  var d = TILE_SIZE + (1/3 * LEG_LENGTH) + (1/2 * DEPTH);

  var material = { color: 0x999999/*, wireframe: true,*/ };

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

  gameState.faces = allCombos([a, a, b], new Tile());

  for(var x in gameState.faces) {
    for(var y in gameState.faces[x]) {
      for(var z in gameState.faces[x][y]) {
        if(Math.abs(x) == b) {
          geometry = xFace;
        } else if(Math.abs(y) == b) {
          geometry = yFace;
        } else {
          geometry = zFace;
        }

        mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial(material) );
        mesh.position.set(x, y, z);

        board.add( mesh );

        // scene.add( gameState.faces[x][y][z] );
      }
    }
  }

  gameState.edges = allCombos([c, c, a], new Tile());

  for(var x in gameState.edges) {
    for(var y in gameState.edges[x]) {
      for(var z in gameState.edges[x][y]) {
        if(Math.abs(x) == a) {
          geometry = y * z < 0 ? nxEdge : pxEdge;
        } else if(Math.abs(y) == a) {
          geometry = x * z < 0 ? nyEdge : pyEdge;
        } else {
          geometry = x * y < 0 ? nzEdge : pzEdge;
        }

        mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial(material) );
        mesh.position.set(x, y, z);

        board.add( mesh );
      }
    }
  }

  gameState.corners = allCombos([d, d, d], new Tile());

  for(var x in gameState.corners) {
    for(var y in gameState.corners[x]) {
      for(var z in gameState.corners[x][y]) {
        gameState.corners[x][y][z].isCorner = true;

        mesh = new THREE.Mesh( corner, new THREE.MeshLambertMaterial(material) );
        mesh.position.set(x, y, z);
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
      var r = allCombos(remaining.slice(0, i).concat(remaining.slice(i+1)), init);
      objSoFar[remaining[i]] = r;
      objSoFar[-remaining[i]] = r;
    }
  }
  else {
    objSoFar = init;
  }

  return objSoFar;
}

/*
========================================
    Graph Nodes (board tiles)
========================================
 */

function Tile() {
  this.ownedBy = null;
  this.isCorner = false;
  this.A = null; // up
  this.a = null; // down
  this.B = null; // up right
  this.b = null; // down left
  this.C = null; // right
  this.c = null; // left
  this.D = null; // down right
  this.d = null; // up left
}

/**
 * Direction in which to check for tiles for capture
 * @param  {char} direction direction to traverse
 * @return {num}            number of pieces captured
 */
Tile.prototype.traverse = function(direction) {

}
