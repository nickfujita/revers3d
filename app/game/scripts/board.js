function Board(gameState) {
  THREE.Object3D.call(this);
  this.material = { color: 0x999999/*, wireframe: true,*/ };
  this.gs = gameState;

  this.init();
}

Board.prototype = Object.create(THREE.Object3D.prototype);
Board.constructor = Board;

Board.prototype.init = function() {
  // Constants
  var CENTER_OF_THE_UNIVERSE = new THREE.Vector3( 0, 0, 0 );

  // Tile coords
  var TILE_WIDTH = this.gs.TILE_WIDTH;
  var PADDING = this.gs.PADDING;
  var DEPTH = this.gs.DEPTH;

  /*
  face = [midTile, midTile, radius]
  edge = [edgeDistance, edgeDistance, midTile]
  corner = [cornerDistance, cornerDistance, cornerDistance]
  */
  var tileSize = TILE_WIDTH + PADDING;
  var legLength = tileSize * Math.sin( Math.PI / 4 );

  var midTile = 1/2 * tileSize;
  var radius = tileSize + legLength;
  var edgeDistance = tileSize + (1/2 * legLength);
  var cornerDistance = tileSize + (1/3 * legLength) + (1/2 * this.DEPTH);

  /*
  ========================================
      Tile Geometries
  ========================================
   */

  var extrudeSettings = { amount: DEPTH, bevelEnabled: false };

  var equiTri = new THREE.Shape();
  var cornerWidth = TILE_WIDTH;
  var cornerHeight = ( Math.sqrt(3) / 2 ) * cornerWidth;
  equiTri.moveTo( -1/2 * cornerWidth, -1/3 * cornerHeight );
  equiTri.lineTo( 0, 2/3 * cornerHeight );
  equiTri.lineTo( 1/2 * cornerWidth, -1/3 * cornerHeight );
  equiTri.lineTo( -1/2 * cornerWidth, -1/3 * cornerHeight );

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

  var faces = this.gs.faces;
  console.log('faces, radius:', faces, radius);

  for(var x in faces) {
    for(var y in faces[x]) {
      for(var z in faces[x][y]) {
        if(Math.abs(x) == radius) {
          geometry = xFace;
        } else if(Math.abs(y) == radius) {
          geometry = yFace;
        } else {
          geometry = zFace;
        }

        faces[x][y][z].mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial(this.material) );
        faces[x][y][z].mesh.position.set(x, y, z);
        faces[x][y][z].mesh.userData = { coord: faces[x][y][z].coord };

        this.add( faces[x][y][z].mesh );
      }
    }
  }

  var edges = this.gs.edges;
  for(var x in edges) {
    for(var y in edges[x]) {
      for(var z in edges[x][y]) {
        if(Math.abs(x) == midTile) {
          geometry = y * z < 0 ? nxEdge : pxEdge;
        } else if(Math.abs(y) == midTile) {
          geometry = x * z < 0 ? nyEdge : pyEdge;
        } else {
          geometry = x * y < 0 ? nzEdge : pzEdge;
        }

        edges[x][y][z].mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial(this.material) );
        edges[x][y][z].mesh.position.set(x, y, z);
        edges[x][y][z].mesh.userData = { coord: edges[x][y][z].coord };

        this.add( edges[x][y][z].mesh );
      }
    }
  }

  var corners = this.gs.corners;
  for(var x in corners) {
    for(var y in corners[x]) {
      for(var z in corners[x][y]) {
        corners[x][y][z].isCorner = true;

        corners[x][y][z].mesh = new THREE.Mesh( corner, new THREE.MeshLambertMaterial(this.material) );
        corners[x][y][z].mesh.position.set(x, y, z);
        corners[x][y][z].mesh.userData = { coord: corners[x][y][z].coord };
        corners[x][y][z].mesh.lookAt( CENTER_OF_THE_UNIVERSE );

        if(Math.sign(y) < 0){
          corners[x][y][z].mesh.rotateZ( Math.PI / 3 );
        }

        this.add( corners[x][y][z].mesh );
      }
    }
  }
}
