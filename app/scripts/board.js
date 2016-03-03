function initBoard() {
  var pieceGeometry = new THREE.IcosahedronGeometry(.4, 0);

  var xyFace, yzFace, xzFace; // Faces along given axes
  var pxEdge, nxEdge, pyEdge, nyEdge, pzEdge, nzEdge; // +/- sloped edges along axis
  var pppCor, ppnCor, pnpCor, pnnCor, nppCor, npnCor, nnpCor, nnnCor; // +/- x, y, z Corners

  // Constants
  var TILE_WIDTH = 19;
  var BUFFER = 2;
  var DEPTH = 1;
  var TILE_SIZE = TILE_WIDTH + BUFFER;
  //Old Vars
  var EDGE_LENGTH = TILE_SIZE * Math.sin( Math.PI / 4 );
  var RADIUS = TILE_SIZE + EDGE_LENGTH;
  //New Vars
  var LEG_LENGTH = TILE_SIZE * Math.sin( Math.PI / 4 );
  var a = 1/2 * TILE_SIZE;
  var b = TILE_SIZE + LEG_LENGTH;
  var c = TILE_SIZE + (1/2 * LEG_LENGTH);
  // face = aab
  // edge = cca
  // corner = ccc

  var CENTER_OF_THE_UNIVERSE = new THREE.Vector3( 0, 0, 0 );
  var material = { color: window.board.color/*, wireframe: true,*/ };


  /*
  ========================================
      Tile Shapes
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

  /*
  ========================================
      Tile Placement
  ========================================
   */

  // Face geometry definitions
  zFace = new THREE.BoxGeometry( TILE_WIDTH, TILE_WIDTH, DEPTH );
  yFace = zFace.clone().rotateX( -Math.PI / 2 );
  xFace = zFace.clone().rotateY( -Math.PI / 2 );

  // Edge geometry definitions
  pxEdge = yFace.clone().rotateX( Math.PI / 4 );
  nxEdge = yFace.clone().rotateX( -Math.PI / 4 );
  pyEdge = zFace.clone().rotateY( Math.PI / 4 );
  nyEdge = zFace.clone().rotateY( -Math.PI / 4 );
  pzEdge = xFace.clone().rotateZ( Math.PI / 4 );
  nzEdge = xFace.clone().rotateZ( -Math.PI / 4) ;

  // Place faces
  var faces = allCombos([a, a, b], 0);
  var geometry;

  for(var x in faces) {
    for(var y in faces[x]) {
      for(var z in faces[x][y]) {
        if(Math.abs(x) == b) {
          geometry = xFace;
        } else if(Math.abs(y) == b) {
          geometry = yFace;
        } else {
          geometry = zFace;
        }

        faces[x][y][z] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial(material) );
        faces[x][y][z].position.set(x, y, z);

        scene.add( faces[x][y][z] );
      }
    }
  }

  var edges = allCombos([c, c, a], 0);

  for(var x in edges) {
    for(var y in edges[x]) {
      for(var z in edges[x][y]) {
        if(Math.abs(x) == a) {
          geometry = y > 0 ? nxEdge : pxEdge;
        } else if(Math.abs(y) == a) {
          geometry = z > 0 ? nyEdge : pyEdge;
        } else {
          geometry = x > 0 ? nzEdge : pzEdge;
        }

        edges[x][y][z] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial(material) );
        edges[x][y][z].position.set(x, y, z);

        scene.add( edges[x][y][z] );
      }
    }
  }

  var corners = allCombos([c, c, c], 0);

  for(var x in corners) {
    for(var y in corners[x]) {
      for(var z in corners[x][y]) {
        corners[x][y][z] = new THREE.Mesh( corner, new THREE.MeshLambertMaterial(material) );
        corners[x][y][z].position.set(x, y, z);
        corners[x][y][z].lookAt( CENTER_OF_THE_UNIVERSE );
        if(Math.sign(y) < 0){
          corners[x][y][z].rotateZ( Math.PI / 3 );
        }

        scene.add( corners[x][y][z] );
      }
    }
  }


  // for(var x = -RADIUS; x <= RADIUS; x += 2 * RADIUS) {
  //   faces[x] = {};
  //   for(var y = -1/2 * TILE_SIZE; y <= 1/2 * TILE_SIZE; y += TILE_SIZE) {
  //     faces[x][y] = {};
  //     for(var z = -1/2 * TILE_SIZE; z <= 1/2 * TILE_SIZE; z += TILE_SIZE) {
  //       faces[x][y][z] = new THREE.Mesh( yzFace, new THREE.MeshLambertMaterial(material) );

  //       faces[x][y][z].position.set(x, y, z);

  //       scene.add( faces[x][y][z] );
  //     }
  //   }
  // }

  // for(var x = -1/2 * TILE_SIZE; x <= 1/2 * TILE_SIZE; x += TILE_SIZE) {
  //   faces[x] = {};
  //   for(var y = -RADIUS; y <= RADIUS; y += 2 * RADIUS) {
  //     faces[x][y] = {};
  //     for(var z = -1/2 * TILE_SIZE; z <= 1/2 * TILE_SIZE; z += TILE_SIZE) {
  //       faces[x][y][z] = new THREE.Mesh( xzFace, new THREE.MeshLambertMaterial(material) );

  //       faces[x][y][z].position.set(x, y, z);

  //       scene.add( faces[x][y][z] );
  //     }
  //   }
  // }

  // for(var x = -1/2 * TILE_SIZE; x <= 1/2 * TILE_SIZE; x += TILE_SIZE) {
  //   faces[x] = {};
  //   for(var y = -1/2 * TILE_SIZE; y <= 1/2 * TILE_SIZE; y += TILE_SIZE) {
  //     faces[x][y] = {};
  //     for(var z = -RADIUS; z <= RADIUS; z += 2 * RADIUS) {
  //       faces[x][y][z] = new THREE.Mesh( xyFace, new THREE.MeshLambertMaterial(material) );

  //       faces[x][y][z].position.set(x, y, z);

  //       scene.add( faces[x][y][z] );
  //     }
  //   }
  // }

  // Place edges
  // var edges = {};

  // for(var x = -TILE_SIZE - 1/2 * EDGE_LENGTH; x <= TILE_SIZE + 1/2 * EDGE_LENGTH; x += 2 * (TILE_SIZE + 1/2 * EDGE_LENGTH)) {
  //   edges[x] = {};
  //   for(var y = -1/2 * TILE_SIZE; y <= 1/2 * TILE_SIZE; y += TILE_SIZE) {
  //     edges[x][y] = {};

  //     var z = -x;
  //     edges[x][y][z] = new THREE.Mesh( pxEdge, new THREE.MeshLambertMaterial(material) );

  //     edges[x][y][z].position.set(x, y, z);

  //     scene.add( edges[x][y][z] );
  //   }
  // }

  // for(var x = -TILE_SIZE - 1/2 * EDGE_LENGTH; x <= TILE_SIZE + 1/2 * EDGE_LENGTH; x += 2 * (TILE_SIZE + 1/2 * EDGE_LENGTH)) {
  //   edges[x] = {};
  //   for(var y = -1/2 * TILE_SIZE; y <= 1/2 * TILE_SIZE; y += TILE_SIZE) {
  //     edges[x][y] = {};

  //     var z = x;
  //     edges[x][y][z] = new THREE.Mesh( nxEdge, new THREE.MeshLambertMaterial(material) );

  //     edges[x][y][z].position.set(x, y, z);

  //     scene.add( edges[x][y][z] );
  //   }
  // }

  // for(var x = -1/2 * TILE_SIZE; x <= 1/2 * TILE_SIZE; x += TILE_SIZE) {
  //   edges[x] = {};
  //   for(var y = -TILE_SIZE - 1/2 * EDGE_LENGTH; y <= TILE_SIZE + 1/2 * EDGE_LENGTH; y += 2 * (TILE_SIZE + 1/2 * EDGE_LENGTH)) {
  //     edges[x][y] = {};

  //     var z = -y;
  //     edges[x][y][z] = new THREE.Mesh( nzEdge, new THREE.MeshLambertMaterial(material) );

  //     edges[x][y][z].position.set(x, y, z);

  //     scene.add( edges[x][y][z] );
  //   }
  // }

  // for(var x = -1/2 * TILE_SIZE; x <= 1/2 * TILE_SIZE; x += TILE_SIZE) {
  //   edges[x] = {};
  //   for(var y = -TILE_SIZE - 1/2 * EDGE_LENGTH; y <= TILE_SIZE + 1/2 * EDGE_LENGTH; y += 2 * (TILE_SIZE + 1/2 * EDGE_LENGTH)) {
  //     edges[x][y] = {};

  //     var z = y;
  //     edges[x][y][z] = new THREE.Mesh( pzEdge, new THREE.MeshLambertMaterial(material) );

  //     edges[x][y][z].position.set(x, y, z);

  //     scene.add( edges[x][y][z] );
  //   }
  // }

  // for(var y = -TILE_SIZE - 1/2 * EDGE_LENGTH; y <= TILE_SIZE + 1/2 * EDGE_LENGTH; y += 2 * (TILE_SIZE + 1/2 * EDGE_LENGTH)) {
  //   var x = y;
  //   edges[x] = {};
  //   edges[x][y] = {}
  //   for(var z = -1/2 * TILE_SIZE; z <= 1/2 * TILE_SIZE; z += TILE_SIZE) {
  //     edges[x][y][z] = new THREE.Mesh( nyEdge, new THREE.MeshLambertMaterial(material) );

  //     edges[x][y][z].position.set(x, y, z);

  //     scene.add( edges[x][y][z] );
  //   }
  // }

  // for(var y = -TILE_SIZE - 1/2 * EDGE_LENGTH; y <= TILE_SIZE + 1/2 * EDGE_LENGTH; y += 2 * (TILE_SIZE + 1/2 * EDGE_LENGTH)) {
  //   var x = -y;
  //   edges[x] = {};
  //   edges[x][y] = {}
  //   for(var z = -1/2 * TILE_SIZE; z <= 1/2 * TILE_SIZE; z += TILE_SIZE) {
  //     edges[x][y][z] = new THREE.Mesh( pyEdge, new THREE.MeshLambertMaterial(material) );

  //     edges[x][y][z].position.set(x, y, z);

  //     scene.add( edges[x][y][z] );
  //   }
  // }

  // // Place corners
  // var corners = {};
  // var location = RADIUS - (2/3 * EDGE_LENGTH) + 0.33;

  // for(var x = -1; x <= 1; x += 2) {
  //   corners[x] = {};
  //   for(var y = -1; y <= 1; y += 2) {
  //     corners[x][y] = {};
  //     for(var z = -1; z <= 1; z += 2) {
  //       corners[x][y][z] = new THREE.Mesh( corner, new THREE.MeshLambertMaterial(material) );

  //       corners[x][y][z].position.set(location * x, location * y, location * z);

  //       // Set rotation
  //       corners[x][y][z].lookAt( CENTER_OF_THE_UNIVERSE );
  //       if(Math.sign(y) < 0){
  //         corners[x][y][z].rotateZ( Math.PI / 3 );
  //       }

  //       scene.add(corners[x][y][z]);
  //     }
  //   }
  // }
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
