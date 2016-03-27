function initGame() {
  window.board = new THREE.Object3D();

  // Constants
  var TILE_WIDTH = 19;
  var BUFFER = 3;
  var DEPTH = 1;
  var TILE_SIZE = TILE_WIDTH + BUFFER;
  var CENTER_OF_THE_UNIVERSE = new THREE.Vector3( 0, 0, 0 );

  // Tile coords
  /*
  face = [MID_TILE, MID_TILE, RADIUS]
  edge = [EDGE_DISTANCE, EDGE_DISTANCE, MID_TILE]
  corner = [CORNER_DISTANCE, CORNER_DISTANCE, CORNER_DISTANCE]
  */
  var LEG_LENGTH = TILE_SIZE * Math.sin( Math.PI / 4 );
  var MID_TILE = 1/2 * TILE_SIZE;
  var RADIUS = TILE_SIZE + LEG_LENGTH;
  var EDGE_DISTANCE = TILE_SIZE + (1/2 * LEG_LENGTH);
  var CORNER_DISTANCE = TILE_SIZE + (1/3 * LEG_LENGTH) + (1/2 * DEPTH);

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
  window.gameState = new GameState(MID_TILE, RADIUS, EDGE_DISTANCE, CORNER_DISTANCE);
  var geometry, mesh;


  var faces = gameState.faces;
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

        faces[x][y][z].mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial(material) );
        faces[x][y][z].mesh.position.set(x, y, z);
        faces[x][y][z].mesh.userData = { coord: faces[x][y][z].coord };

        board.add( faces[x][y][z].mesh );
      }
    }
  }

  var edges = gameState.edges;
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

        edges[x][y][z].mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial(material) );
        edges[x][y][z].mesh.position.set(x, y, z);
        edges[x][y][z].mesh.userData = { coord: edges[x][y][z].coord };

        board.add( edges[x][y][z].mesh );
      }
    }
  }

  var corners = gameState.corners;
  for(var x in corners) {
    for(var y in corners[x]) {
      for(var z in corners[x][y]) {
        corners[x][y][z].isCorner = true;

        corners[x][y][z].mesh = new THREE.Mesh( corner, new THREE.MeshLambertMaterial(material) );
        corners[x][y][z].mesh.position.set(x, y, z);
        corners[x][y][z].mesh.userData = { coord: corners[x][y][z].coord };
        corners[x][y][z].mesh.lookAt( CENTER_OF_THE_UNIVERSE );

        if(Math.sign(y) < 0){
          corners[x][y][z].mesh.rotateZ( Math.PI / 3 );
        }

        board.add( corners[x][y][z].mesh );
      }
    }
  }
}
