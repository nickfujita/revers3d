/*
========================================
    Board (Three.Object3D object)

    View layer. Board produces the actual, player-interactive object
========================================
 */

/**
 * @param {Object} gameState -Current state of the game
 */
function Board(gameState, players) {
  THREE.Object3D.call(this);
  this.gs = gameState;
  this.players = players;
  this.material = { color: 0x999999/*, wireframe: true,*/ };

  // Constants
  var CENTER_OF_THE_UNIVERSE = new THREE.Vector3( 0, 0, 0 );

  // Tile coords
  var TILE_WIDTH = this.gs.data.TILE_WIDTH;
  var PADDING = this.gs.data.PADDING;
  var DEPTH = this.gs.data.DEPTH;

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

  var faces = this.gs.data.faces;
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

  var edges = this.gs.data.edges;
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

  var corners = this.gs.data.corners;
  for(var x in corners) {
    for(var y in corners[x]) {
      for(var z in corners[x][y]) {

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
  this.init();
};

Board.prototype = Object.create(THREE.Object3D.prototype);
Board.constructor = Board;

Board.prototype.light = function(coord, color) {
  color = color || 0x7fff00;

  var tile = this.gs[coord];

  tile.previousColor = tile.mesh.material.emissive.getHex();
  tile.mesh.material.emissive.setHex(color);
};

Board.prototype.unlight = function(coord, color) {
  color = color || 0x7fff00;

  var tile = this.gs[coord];

  tile.mesh.material.emissive.setHex(tile.previousColor);
};

Board.prototype.draw = function(scene) {
  scene.add(this);
};

Board.prototype.erase = function(scene) {
  scene.remove(this);
};

Board.prototype.init = function() {
  this.light('c1', this.players[0].color);
  this.light('d6', this.players[0].color);
  this.light('c2', this.players[1].color);
  this.light('d5', this.players[1].color);

  this.gs.init();
};

Board.prototype.capture = function(coord, playerNum, noAnimate) {
  var tile = this.gs[coord];
  var edges = tile.edges;
  var toCapture = [tile];
  var potentialCapture;
  var capColor = this.players[playerNum].color;

  edges.forEach(function(edge, i, edges) {
    var prev = tile;
    var next = edge;
    potentialCapture = [];

    // Loop while the next tile is owned by the opponent, and potentially capture it
    while (next.ownedBy === (1 - playerNum)) {
      next = next.traverse(prev, function(current) {
        potentialCapture.push(current);
        prev = current;
      });
    }

    // Once the while loop ends, the next tile must either be null or self owned.
    // If self owned, commit the capture. If null, reject the capture.
    if(potentialCapture.length && next.ownedBy === playerNum) {
      toCapture = toCapture.concat(potentialCapture);
      potentialCapture = [];
    } else {
      potentialCapture = [];
    }
  })

  var currentBoard = this;

  var captureMode = noAnimate ? capture : captureAnimated;
  toCapture.forEach(captureMode);

  return toCapture.length;

  function captureAnimated(tile, i) {
    tile.setOwner(playerNum);
    tile.mesh.currentHex = capColor;
    // Light captured tiles on a delay for visual appeal
    setTimeout( function() {
      currentBoard.light(tile.coord, capColor);
    }, i * 50);
  }

  function capture(tile) {
    tile.setOwner(playerNum);
    tile.mesh.currentHex = capColor;
    currentBoard.light(tile.coord, capColor);
  }
};
