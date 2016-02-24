function initBoard() {
  var pieceGeometry = new THREE.IcosahedronGeometry(.4, 0);

  var xyFace, yzFace, xzFace; // Faces along given axes
  var pxEdge, nxEdge, pyEdge, nyEdge, pzEdge, nzEdge; // +/- sloped edges along axis
  var pppCor, ppnCor, pnpCor, pnnCor, nppCor, npnCor, nnpCor, nnnCor; // +/- x, y, z Corners

  // Constants
  var TILE_SIZE = 19;
  var BUFFER = 2;
  var DEPTH = 1;
  var TILE_WIDTH = TILE_SIZE + BUFFER;

  var EDGE_LENGTH = TILE_WIDTH * Math.sin( Math.PI / 4 );
  var RADIUS = TILE_WIDTH + EDGE_LENGTH;

  var material = { color: window.board.color/*, wireframe: true,*/ };


  /*
  ========================================
      Tile Shapes
  ========================================
   */

  var extrudeSettings = { amount: DEPTH, bevelEnabled: false };

  var equiTri = new THREE.Shape();
  var CORNER_WIDTH = TILE_SIZE;
  var CORNER_HEIGHT = ( Math.sqrt(3) / 2 ) * CORNER_WIDTH;
  equiTri.moveTo( -1/2 * CORNER_WIDTH, -1/3 * CORNER_HEIGHT );
  equiTri.lineTo(0, 2/3 * CORNER_HEIGHT );
  equiTri.lineTo( 1/2 * CORNER_WIDTH, -1/3 * CORNER_HEIGHT );
  equiTri.lineTo( -1/2 * CORNER_WIDTH, -1/3 * CORNER_HEIGHT );

  var corner = new THREE.ExtrudeGeometry( equiTri, extrudeSettings );

  // var square = new THREE.Shape();
  // square.moveTo(-9.5, -9.5)
  // square.lineTo(-9.5, 9.5);
  // square.lineTo(9.5, 9.5);
  // square.lineTo(9.5, -9.5);
  // square.lineTo(-9.5, -9.5);

  // // var sqMin = new THREE.Vector2(0, 0);
  // // var sqMax = new THREE.Vector2(TILE_SIZE, TILE_SIZE);

  // var face = new THREE.ExtrudeGeometry( square, extrudeSettings );


  /*
  ========================================
      Tile Placement
  ========================================
   */

  // Face geometry definitions
  // xyFace = face;
  xyFace = new THREE.BoxGeometry( TILE_SIZE, TILE_SIZE, DEPTH );
  yzFace = xyFace.clone().rotateY( -Math.PI / 2 );
  xzFace = xyFace.clone().rotateX( -Math.PI / 2 );

  // Edge geometry definitions
  pxEdge = xyFace.clone().rotateY( -Math.PI / 4 );
  pyEdge = yzFace.clone().rotateZ( -Math.PI / 4 );
  pzEdge = xyFace.clone().rotateX( -Math.PI / 4 );
  nxEdge = xyFace.clone().rotateY( Math.PI / 4 );
  nyEdge = yzFace.clone().rotateZ( Math.PI / 4 );
  nzEdge = xyFace.clone().rotateX( Math.PI / 4) ;

  // Place faces
  var faces = {};

  for(var x = -RADIUS; x <= RADIUS; x += 2 * RADIUS) {
    faces[x] = {};
    for(var y = -1/2 * TILE_WIDTH; y <= 1/2 * TILE_WIDTH; y += TILE_WIDTH) {
      faces[x][y] = {};
      for(var z = -1/2 * TILE_WIDTH; z <= 1/2 * TILE_WIDTH; z += TILE_WIDTH) {
        faces[x][y][z] = new THREE.Mesh( yzFace, new THREE.MeshLambertMaterial(material) );

        faces[x][y][z].position.set(x, y, z);

        scene.add( faces[x][y][z] );
      }
    }
  }

  for(var x = -1/2 * TILE_WIDTH; x <= 1/2 * TILE_WIDTH; x += TILE_WIDTH) {
    faces[x] = {};
    for(var y = -RADIUS; y <= RADIUS; y += 2 * RADIUS) {
      faces[x][y] = {};
      for(var z = -1/2 * TILE_WIDTH; z <= 1/2 * TILE_WIDTH; z += TILE_WIDTH) {
        faces[x][y][z] = new THREE.Mesh( xzFace, new THREE.MeshLambertMaterial(material) );

        faces[x][y][z].position.set(x, y, z);

        scene.add( faces[x][y][z] );
      }
    }
  }

  for(var x = -1/2 * TILE_WIDTH; x <= 1/2 * TILE_WIDTH; x += TILE_WIDTH) {
    faces[x] = {};
    for(var y = -1/2 * TILE_WIDTH; y <= 1/2 * TILE_WIDTH; y += TILE_WIDTH) {
      faces[x][y] = {};
      for(var z = -RADIUS; z <= RADIUS; z += 2 * RADIUS) {
        faces[x][y][z] = new THREE.Mesh( xyFace, new THREE.MeshLambertMaterial(material) );

        faces[x][y][z].position.set(x, y, z);

        scene.add( faces[x][y][z] );
      }
    }
  }

  // Place edges
  var edges = {};

  for(var x = -TILE_WIDTH - 1/2 * EDGE_LENGTH; x <= TILE_WIDTH + 1/2 * EDGE_LENGTH; x += 2 * (TILE_WIDTH + 1/2 * EDGE_LENGTH)) {
    edges[x] = {};
    for(var y = -1/2 * TILE_WIDTH; y <= 1/2 * TILE_WIDTH; y += TILE_WIDTH) {
      edges[x][y] = {};

      var z = -x;
      edges[x][y][z] = new THREE.Mesh( pxEdge, new THREE.MeshLambertMaterial(material) );

      edges[x][y][z].position.set(x, y, z);

      scene.add( edges[x][y][z] );
    }
  }

  for(var x = -TILE_WIDTH - 1/2 * EDGE_LENGTH; x <= TILE_WIDTH + 1/2 * EDGE_LENGTH; x += 2 * (TILE_WIDTH + 1/2 * EDGE_LENGTH)) {
    edges[x] = {};
    for(var y = -1/2 * TILE_WIDTH; y <= 1/2 * TILE_WIDTH; y += TILE_WIDTH) {
      edges[x][y] = {};

      var z = x;
      edges[x][y][z] = new THREE.Mesh( nxEdge, new THREE.MeshLambertMaterial(material) );

      edges[x][y][z].position.set(x, y, z);

      scene.add( edges[x][y][z] );
    }
  }

  for(var x = -1/2 * TILE_WIDTH; x <= 1/2 * TILE_WIDTH; x += TILE_WIDTH) {
    edges[x] = {};
    for(var y = -TILE_WIDTH - 1/2 * EDGE_LENGTH; y <= TILE_WIDTH + 1/2 * EDGE_LENGTH; y += 2 * (TILE_WIDTH + 1/2 * EDGE_LENGTH)) {
      edges[x][y] = {};

      var z = -y;
      edges[x][y][z] = new THREE.Mesh( nzEdge, new THREE.MeshLambertMaterial(material) );

      edges[x][y][z].position.set(x, y, z);

      scene.add( edges[x][y][z] );
    }
  }

  for(var x = -1/2 * TILE_WIDTH; x <= 1/2 * TILE_WIDTH; x += TILE_WIDTH) {
    edges[x] = {};
    for(var y = -TILE_WIDTH - 1/2 * EDGE_LENGTH; y <= TILE_WIDTH + 1/2 * EDGE_LENGTH; y += 2 * (TILE_WIDTH + 1/2 * EDGE_LENGTH)) {
      edges[x][y] = {};

      var z = y;
      edges[x][y][z] = new THREE.Mesh( pzEdge, new THREE.MeshLambertMaterial(material) );

      edges[x][y][z].position.set(x, y, z);

      scene.add( edges[x][y][z] );
    }
  }

  for(var y = -TILE_WIDTH - 1/2 * EDGE_LENGTH; y <= TILE_WIDTH + 1/2 * EDGE_LENGTH; y += 2 * (TILE_WIDTH + 1/2 * EDGE_LENGTH)) {
    var x = y;
    edges[x] = {};
    edges[x][y] = {}
    for(var z = -1/2 * TILE_WIDTH; z <= 1/2 * TILE_WIDTH; z += TILE_WIDTH) {
      edges[x][y][z] = new THREE.Mesh( nyEdge, new THREE.MeshLambertMaterial(material) );

      edges[x][y][z].position.set(x, y, z);

      scene.add( edges[x][y][z] );
    }
  }

  for(var y = -TILE_WIDTH - 1/2 * EDGE_LENGTH; y <= TILE_WIDTH + 1/2 * EDGE_LENGTH; y += 2 * (TILE_WIDTH + 1/2 * EDGE_LENGTH)) {
    var x = -y;
    edges[x] = {};
    edges[x][y] = {}
    for(var z = -1/2 * TILE_WIDTH; z <= 1/2 * TILE_WIDTH; z += TILE_WIDTH) {
      edges[x][y][z] = new THREE.Mesh( pyEdge, new THREE.MeshLambertMaterial(material) );

      edges[x][y][z].position.set(x, y, z);

      scene.add( edges[x][y][z] );
    }
  }

  // Place corners
  var corners = {};
  var location = RADIUS - (2/3 * EDGE_LENGTH) + 0.5;

  for(var x = -1; x <= 1; x += 2) {
    corners[x] = {};
    for(var y = -1; y <= 1; y += 2) {
      corners[x][y] = {};
      for(var z = -1; z <= 1; z += 2) {
        corners[x][y][z] = new THREE.Mesh( corner, new THREE.MeshLambertMaterial(material) );

        corners[x][y][z].position.set(location * x, location * y, location * z);

        corners[x][y][z].rotateY( Math.PI / 4 * x * z );
        corners[x][y][z].rotateX( -Math.PI / 5.1 * y * z );
        if(Math.sign(y) < 0){
          corners[x][y][z].rotateZ( Math.PI / 3 );
        }

        scene.add(corners[x][y][z]);
      }
    }
  }
}
