/**
 * @author alteredq / http://alteredqualia.com/
 * @authod mrdoob / http://mrdoob.com/
 * @authod arodic / http://aleksandarrodic.com/
 * @authod fonserbc / http://fonserbc.github.io/
*/

THREE.StereoEffect = function ( renderer ) {

	var _stereo = new THREE.StereoCamera();
	_stereo.aspect = 0.5;

	this.setSize = function ( width, height ) {

		renderer.setSize( width, height );

	};

	this.render = function ( scene, camera ) {

		scene.updateMatrixWorld();

		if ( camera.parent === null ) camera.updateMatrixWorld();

		_stereo.update( camera );

		var size = renderer.getSize();

		renderer.setScissorTest( true );
		renderer.clear();

		renderer.setScissor( 0, 0, size.width / 2, size.height );
		renderer.setViewport( 0, 0, size.width / 2, size.height );
		renderer.render( scene, _stereo.cameraL );

		renderer.setScissor( size.width / 2, 0, size.width / 2, size.height );
		renderer.setViewport( size.width / 2, 0, size.width / 2, size.height );
		renderer.render( scene, _stereo.cameraR );

		renderer.setScissorTest( false );

	};

};

/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

THREE.DeviceOrientationControls = function ( object ) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( "YXZ" );

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

	var onDeviceOrientationChangeEvent = function ( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function () {

		scope.screenOrientation = window.orientation || 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function () {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function ( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' );                       // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler );                               // orient the device

			quaternion.multiply( q1 );                                      // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );    // adjust for screen orientation

		}

	}();

	this.connect = function() {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = true;

	};

	this.disconnect = function() {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = false;

	};

	this.update = function () {

		if ( scope.enabled === false ) return;

		var alpha  = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) : 0; // Z
		var beta   = scope.deviceOrientation.beta  ? THREE.Math.degToRad( scope.deviceOrientation.beta  ) : 0; // X'
		var gamma  = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
		var orient = scope.screenOrientation       ? THREE.Math.degToRad( scope.screenOrientation       ) : 0; // O

		setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

	};

	this.dispose = function () {

		this.disconnect();

	};

	this.connect();

};

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {
	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {
		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
	};

	this.dispose = function() {
		document.removeEventListener( 'mousemove', onMouseMove, false );
	};

	document.addEventListener( 'mousemove', onMouseMove, false );

	this.enabled = false;

	this.getObject = function () {
		return yawObject;
	};

	this.getDirection = function() {
		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {
			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;
		};
	}();
};

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.TapTouchControls = function ( camera ) {
  var scope = this;

  camera.rotation.set( 0, 0, 0 );

  this.pitchObject = new THREE.Object3D();
  this.pitchObject.add( camera );

  this.yawObject = new THREE.Object3D();
  this.yawObject.add( this.pitchObject );

	this.getObject = function () {
		return this.yawObject;
	};

	this.getDirection = function() {
		// assumes the camera itself is not rotated
		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {
			rotation.set( this.pitchObject.rotation.x, this.yawObject.rotation.y, 0 );
			v.copy( direction ).applyEuler( rotation );
			return v;
		};
	}();


};

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.GeometryUtils = {

	// Merge two geometries or geometry and geometry from object (using object's transform)

	merge: function ( geometry1, geometry2, materialIndexOffset ) {

		console.warn( 'THREE.GeometryUtils: .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead.' );

		var matrix;

		if ( geometry2 instanceof THREE.Mesh ) {

			geometry2.matrixAutoUpdate && geometry2.updateMatrix();

			matrix = geometry2.matrix;
			geometry2 = geometry2.geometry;

		}

		geometry1.merge( geometry2, matrix, materialIndexOffset );

	},

	// Get random point in triangle (via barycentric coordinates)
	// 	(uniform distribution)
	// 	http://www.cgafaq.info/wiki/Random_Point_In_Triangle

	randomPointInTriangle: function () {

		var vector = new THREE.Vector3();

		return function ( vectorA, vectorB, vectorC ) {

			var point = new THREE.Vector3();

			var a = Math.random();
			var b = Math.random();

			if ( ( a + b ) > 1 ) {

				a = 1 - a;
				b = 1 - b;

			}

			var c = 1 - a - b;

			point.copy( vectorA );
			point.multiplyScalar( a );

			vector.copy( vectorB );
			vector.multiplyScalar( b );

			point.add( vector );

			vector.copy( vectorC );
			vector.multiplyScalar( c );

			point.add( vector );

			return point;

		};

	}(),

	// Get random point in face (triangle)
	// (uniform distribution)

	randomPointInFace: function ( face, geometry ) {

		var vA, vB, vC;

		vA = geometry.vertices[ face.a ];
		vB = geometry.vertices[ face.b ];
		vC = geometry.vertices[ face.c ];

		return THREE.GeometryUtils.randomPointInTriangle( vA, vB, vC );

	},

	// Get uniformly distributed random points in mesh
	// 	- create array with cumulative sums of face areas
	//  - pick random number from 0 to total area
	//  - find corresponding place in area array by binary search
	//	- get random point in face

	randomPointsInGeometry: function ( geometry, n ) {

		var face, i,
			faces = geometry.faces,
			vertices = geometry.vertices,
			il = faces.length,
			totalArea = 0,
			cumulativeAreas = [],
			vA, vB, vC;

		// precompute face areas

		for ( i = 0; i < il; i ++ ) {

			face = faces[ i ];

			vA = vertices[ face.a ];
			vB = vertices[ face.b ];
			vC = vertices[ face.c ];

			face._area = THREE.GeometryUtils.triangleArea( vA, vB, vC );

			totalArea += face._area;

			cumulativeAreas[ i ] = totalArea;

		}

		// binary search cumulative areas array

		function binarySearchIndices( value ) {

			function binarySearch( start, end ) {

				// return closest larger index
				// if exact number is not found

				if ( end < start )
					return start;

				var mid = start + Math.floor( ( end - start ) / 2 );

				if ( cumulativeAreas[ mid ] > value ) {

					return binarySearch( start, mid - 1 );

				} else if ( cumulativeAreas[ mid ] < value ) {

					return binarySearch( mid + 1, end );

				} else {

					return mid;

				}

			}

			var result = binarySearch( 0, cumulativeAreas.length - 1 );
			return result;

		}

		// pick random face weighted by face area

		var r, index,
			result = [];

		var stats = {};

		for ( i = 0; i < n; i ++ ) {

			r = Math.random() * totalArea;

			index = binarySearchIndices( r );

			result[ i ] = THREE.GeometryUtils.randomPointInFace( faces[ index ], geometry );

			if ( ! stats[ index ] ) {

				stats[ index ] = 1;

			} else {

				stats[ index ] += 1;

			}

		}

		return result;

	},

	randomPointsInBufferGeometry: function ( geometry, n ) {

		var i,
			vertices = geometry.attributes.position.array,
			totalArea = 0,
			cumulativeAreas = [],
			vA, vB, vC;

		// precompute face areas
		vA = new THREE.Vector3();
		vB = new THREE.Vector3();
		vC = new THREE.Vector3();

		// geometry._areas = [];
		var il = vertices.length / 9;

		for ( i = 0; i < il; i ++ ) {

			vA.set( vertices[ i * 9 + 0 ], vertices[ i * 9 + 1 ], vertices[ i * 9 + 2 ] );
			vB.set( vertices[ i * 9 + 3 ], vertices[ i * 9 + 4 ], vertices[ i * 9 + 5 ] );
			vC.set( vertices[ i * 9 + 6 ], vertices[ i * 9 + 7 ], vertices[ i * 9 + 8 ] );

			area = THREE.GeometryUtils.triangleArea( vA, vB, vC );
			totalArea += area;

			cumulativeAreas.push( totalArea );

		}

		// binary search cumulative areas array

		function binarySearchIndices( value ) {

			function binarySearch( start, end ) {

				// return closest larger index
				// if exact number is not found

				if ( end < start )
					return start;

				var mid = start + Math.floor( ( end - start ) / 2 );

				if ( cumulativeAreas[ mid ] > value ) {

					return binarySearch( start, mid - 1 );

				} else if ( cumulativeAreas[ mid ] < value ) {

					return binarySearch( mid + 1, end );

				} else {

					return mid;

				}

			}

			var result = binarySearch( 0, cumulativeAreas.length - 1 );
			return result;

		}

		// pick random face weighted by face area

		var r, index,
			result = [];

		for ( i = 0; i < n; i ++ ) {

			r = Math.random() * totalArea;

			index = binarySearchIndices( r );

			// result[ i ] = THREE.GeometryUtils.randomPointInFace( faces[ index ], geometry, true );
			vA.set( vertices[ index * 9 + 0 ], vertices[ index * 9 + 1 ], vertices[ index * 9 + 2 ] );
			vB.set( vertices[ index * 9 + 3 ], vertices[ index * 9 + 4 ], vertices[ index * 9 + 5 ] );
			vC.set( vertices[ index * 9 + 6 ], vertices[ index * 9 + 7 ], vertices[ index * 9 + 8 ] );
			result[ i ] = THREE.GeometryUtils.randomPointInTriangle( vA, vB, vC );

		}

		return result;

	},

	// Get triangle area (half of parallelogram)
	// http://mathworld.wolfram.com/TriangleArea.html

	triangleArea: function () {

		var vector1 = new THREE.Vector3();
		var vector2 = new THREE.Vector3();

		return function ( vectorA, vectorB, vectorC ) {

			vector1.subVectors( vectorB, vectorA );
			vector2.subVectors( vectorC, vectorA );
			vector1.cross( vector2 );

			return 0.5 * vector1.length();

		};

	}(),

	center: function ( geometry ) {

		console.warn( 'THREE.GeometryUtils: .center() has been moved to Geometry. Use geometry.center() instead.' );
		return geometry.center();

	}

};

function allowPointerLock(controls) {
  var blocker = document.getElementById( 'blocker' );
  var instructions = document.getElementById( 'instructions' );

  blocker.style.display = '-webkit-box';
  blocker.style.display = '-moz-box';
  blocker.style.display = 'box';

  // http://www.html5rocks.com/en/tutorials/pointerlock/intro/
  var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

  if ( havePointerLock ) {
    var element = document.body;

    var pointerlockchange = function ( event ) {
      if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
        controls.enabled = true;

        blocker.style.display = 'none';
      } else {
        controls.enabled = false;

        blocker.style.display = '-webkit-box';
        blocker.style.display = '-moz-box';
        blocker.style.display = 'box';

        instructions.style.display = '';
      }
    };

    var pointerlockerror = function ( event ) {
      instructions.style.display = '';
    };

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {
      event.stopPropagation();
      instructions.style.display = 'none';

      // Ask the browser to lock the pointer
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

      if ( /Firefox/i.test( navigator.userAgent ) ) {
        var fullscreenchange = function ( event ) {
          if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
            document.removeEventListener( 'fullscreenchange', fullscreenchange );
            document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

            element.requestPointerLock();
          }
        };

        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

        element.requestFullscreen();
      } else {
        element.requestPointerLock();
      }
    }, false );
  } else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
  }
};

/*
========================================
    Tiles (graph nodes)

    Individual surfaces of the game board. Has relationships with other Tiles.
    Relationships are defined where upper and lowercase of the same letter are opposite.
========================================
 */

/**
 * @param {Boolean} isCorner - Whether or not constructed Tile is a corner
 */
function Tile(isCorner) {
  this.constructor = Tile;
  this.ownedBy = null;
  this.isCorner = !!isCorner;
}

Tile.prototype.traverse = function(fromTile, callback) {
  var toIndex = (this.edges.indexOf(fromTile) + (1/2 * this.edges.length)) % this.edges.length;

  callback(this);

  return this.edges[toIndex];
}

Tile.prototype.addEdge = function() {
  var end = this.isCorner ? 6 : 8;
  this.edges = Array.prototype.slice.call(arguments, 0, end);
}

Tile.prototype.setOwner = function(playerNum, color) {
  this.ownedBy = playerNum;
}

if(!window) {
  var Tile = require('./Tile');
  var utils = require('./utils')

  module.exports = GameState;
}

var getters = (function() {
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

  function getMasterData() {
    return _MASTER_DATA;
  }

  function getA() {
    return a;
  }

  function getB() {
    return b;
  }

  function getC() {
    return c;
  }

  function getD() {
    return d;
  }

  return {
    getMasterData: getMasterData,
    getA: getA,
    getB: getB,
    getC: getC,
    getD: getD,
  }
})();

/*
========================================
    GameState

    Object which correlates coordinates(pointers) to individual tiles.
========================================
 */

/**
 * @param {Number} a Parallel distance to the middle of a face
 * @param {Number} b Perpendicular distance along an axis to the face of the cube
 * @param {Number} c Parallel distance to the middle of an edge
 * @param {Number} d Parallel distance to the middle of a corner
 */
function GameState() {
  var _MASTER_DATA = getters.getMasterData();
  var a = getters.getA();
  var b = getters.getB();
  var c = getters.getC();
  var d = getters.getD();

  this.data = deepExtend({}, _MASTER_DATA);

  /*
  ========================================
      Enumerable tile states
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

  this.configure();
}

GameState.prototype.init = function() {
  this.c1.setOwner(0);
  this.d6.setOwner(0);
  this.c2.setOwner(1);
  this.d5.setOwner(1);
}

GameState.prototype.capture = function(coord, playerTurn) {
  var tile = this[coord];
  var edges = tile.edges;
  var toCapture = [tile];
  var potentialCapture;

  focus.currentHex = PLAYER[playerTurn].color;

  edges.forEach(function(edge, i, edges) {
    var prev = tile;
    var next = edge;
    potentialCapture = [];

    // Loop while the next tile is owned by the opponent, and potentially capture it
    while (next.ownedBy === (1 - playerTurn)) {
      next = next.traverse(prev, function(current) {
        potentialCapture.push(current);
        prev = current;
      });
    }

    // Once the while loop ends, the next tile must either be null or self owned.
    // If self owned, commit the capture. If null, reject the capture.
    if(potentialCapture.length && next.ownedBy === playerTurn) {
      toCapture = toCapture.concat(potentialCapture);
      potentialCapture = [];
    } else {
      potentialCapture = [];
    }
  })

  toCapture.forEach(function(tile) {
    tile.setOwner(playerTurn);
  })

  return toCapture.length;
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
  } else {
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
      } else {
        target[key] = sources[i][key];
      }
    }
  }

  return target;
}

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

(function() {
  /*
  ========================================
      App State
  ========================================
   */

  var isMobile = checkMobile();
  var turn = 0;
  var scores = [2, 2];

  var notifyArea = document.getElementById('notification');
  var score1 = document.getElementById('score1');
  var score2 = document.getElementById('score2');
  var PLAYER = [
    {
      color: 0xff0000
    }, {
      color: 0x1e09ff
    }
  ];

  /*
  ========================================
      Scene Setup
  ========================================
   */
  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
  scene.add( light );


  var mono = new THREE.WebGLRenderer();
  mono.setClearColor( 0xffffff );
  mono.setPixelRatio( window.devicePixelRatio );
  mono.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( mono.domElement );

  var stereo = new THREE.StereoEffect(mono);

  /*
  ========================================
      Initialize controls
  ========================================
   */
  var render, update, controls;

  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'click', onClick, false );

  var fsButton = document.getElementById('fs-icon');
  // var screenButton = document.getElementById('screen-icon');
  // vrButton.style.display = "block";
  fsButton.addEventListener( 'click', toggleFSVR, false );
  // screenButton.addEventListener( 'click', toggleFSVR, false );
  fsButton.addEventListener( 'touchstart', toggleFSVR, false );
  // screenButton.addEventListener( 'touchstart', toggleFSVR, false );

  if(isMobile) {
    // controls = new THREE.TapTouchControls( camera );
    controls = new THREE.DeviceOrientationControls( camera );

    var xStart, yStart;
    var tapStart;

    document.addEventListener( 'touchstart', onTouchStart, false );
    document.addEventListener( 'touchend', onTouchEnd, false );

    // render = mono.render.bind( mono, scene, camera );
    // update = camera.updateProjectionMatrix.bind( camera );
    // scene.add( controls.getObject() );
    render = stereo.render.bind( stereo, scene, camera );
    update = controls.update.bind( controls );
  } else {
    controls = new THREE.PointerLockControls( camera );

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    allowPointerLock(controls);
    render = mono.render.bind( mono, scene, camera );
    update = camera.updateProjectionMatrix.bind( camera );
    scene.add( controls.getObject() );
  }


  /*
  ========================================
      Initialize gameplay
  ========================================
   */
  window.board = new Board(new GameState(), PLAYER);
  var gameState = board.gs;
  var socket;

  board.draw(scene);

  if(window.hasOwnProperty('isMultiplayer')) initMultiplayer();

  /*
  ========================================
      Animation Loop
  ========================================
   */

  // Movement
  var velocity = new THREE.Vector3();
  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;
  var moveUp = false;
  var moveDown = false;

  // Set sight ray
  var focus, intersects;
  var sightline = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  window.requestAnimationFrame( animate );

  // FPS
  // var fps = new Stats();
  // fps.setMode( 0 ); // 0: fps, 1: ms, 2: mb

  // align top-left
  // fps.domElement.style.position = 'absolute';
  // fps.domElement.style.left = '0px';
  // fps.domElement.style.top = '0px';
//
  // document.body.appendChild( fps.domElement );
  // fps.domElement.style.display = 'none';

  var prevTime = performance.now();

  function animate(time) {
    // Begin FPS calculation
    // fps.begin();

    // Allow movement for development
    if ( !isMobile ) {
      var delta = ( time - prevTime ) / 1000;

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.y -= velocity.y * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;

      if ( moveForward ) velocity.z -= 400.0 * delta;
      if ( moveBackward ) velocity.z += 400.0 * delta;
      if ( moveLeft ) velocity.x -= 400.0 * delta;
      if ( moveRight ) velocity.x += 400.0 * delta;
      if ( moveUp ) velocity.y += 400.0 * delta;
      if ( moveDown ) velocity.y -= 400.0 * delta;

      controls.getObject().translateX( velocity.x * delta );
      controls.getObject().translateY( velocity.y * delta );
      controls.getObject().translateZ( velocity.z * delta );

      prevTime = time;
    }

    update();
    findIntersects();
    render();

    // End FPS calculation
    // fps.end();

    window.requestAnimationFrame( animate );
  }

  /*
  ========================================
      Event Handlers
  ========================================
   */

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    mono.setSize( window.innerWidth, window.innerHeight );
    stereo.setSize( window.innerWidth, window.innerHeight );
  }

  function onClick( event ) {
    event.stopPropagation();

    if(focus) {
      var coord = focus.userData.coord;

      if(gameState[coord].ownedBy === null) {
        if(window.isMultiplayer) {
          socket.emit('send move', coord);
        } else {
          var dScore = board.capture(coord, turn);

          scores[turn] += dScore;
          turn = ~~!!!turn;
          scores[turn] -= (dScore - 1);

          score1.innerText = scores[0].toString().length === 2 ? scores[0] : ('0' + scores[0]);
          score2.innerText = scores[1].toString().length === 2 ? scores[1] : ('0' + scores[1]);
          notifyArea.innerText = 'Player ' + (turn + 1) + '\'s turn';

          if(scores[0] + scores[1] === 56) {
            var message = 'Game over. ';

            if(scores[0] === scores[1]) {
              message += 'It\'s a Tie! '
            } else {
              message += 'Player ' + (scores[0] > scores[1] ? 1 : 2) + ' wins!';
              // message += scores[0] > scores[1] ? 'Congratulations, you win!' : 'You lose :(';
            }
            notifyArea.innerText = message;
          }
        }
      } else {
        console.log(focus.userData.coord, 'owned by player', gameState[coord].ownedBy);
      }
    }
  }

  function onTouchStart( event ) {
    if ( event.touches.length === 1 ) {

      xStart = event.touches[ 0 ].pageX;
      yStart = event.touches[ 0 ].pageY;

      tapStart = Date.now();
    }
  }

  function onTouchMove( event ) {
    if ( event.touches.length === 1 ) {
      event.preventDefault();
      var xEnd = event.touches[ 0 ].pageX;
      var yEnd = event.touches[ 0 ].pageY;

      var dx = xEnd - xStart;
      var dy = yEnd - yStart;
      var PI_2 = Math.PI / 2;

      controls.yawObject.rotation.y += 0.005 * dx;
      xStart += dx;

      controls.pitchObject.rotation.x += 0.005 * dy;
      controls.pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, controls.pitchObject.rotation.x ) );
      yStart += dy;
    }
  };

  function onTouchEnd( event ) {
    event.preventDefault();

    var isClick = Date.now() - tapStart < 150;

    if(isClick) {
      onClick(event);
      console.log('click!');
    } else {
      console.log('hold!');
    }
  }

  function onKeyDown ( event ) {
    switch ( event.keyCode ) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 32: // space
        moveUp = true;
        break;

      case 16: // shift
        moveDown = true;
        break;
    }
  };

  function onKeyUp ( event ) {
    switch( event.keyCode ) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

      case 32: // space
        moveUp = false;
        break;

      case 16: // shift
        moveDown = false;
        break;

      // case 70: // f
      //   if(event.ctrlKey) {
      //     if(fps.domElement.style.display === 'none') {
      //       fps.domElement.style.display = 'block';
      //     } else {
      //       fps.domElement.style.display = 'none';
      //     }
      //   }
      //   break;
    }
  };

  /*
  ========================================
      Helpers
  ========================================
   */
  function checkMobile() {
    try{ document.createEvent("TouchEvent"); return true; }
    catch(e){ return false; }
  }

  function toggleFSVR(event) {
    event.stopPropagation();

    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      // Enter fullscreen
      requestFullScreen.call(docEl);
    }
    else {
      // Exit fullscreen
      cancelFullScreen.call(doc);
    }

    // if(wasFs()) { enterVR(); }
    // else { exitVR(); }
  }

  function wasFs() {
    return document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitIsFullScreen ? false : true;
  }

  window.enterVR = enterVR;
  function enterVR() {
    // vrButton.style.display = "none";
    // screenButton.style.display = "block";

    document.removeEventListener( 'touchmove', onTouchMove, false );
    scene.remove( controls.getObject() );

    // controls = new THREE.DeviceOrientationControls( camera );
    // render = stereo.render.bind( stereo, scene, camera );
    // update = controls.update.bind( controls );

    controls = new THREE.DeviceOrientationControls( camera );
    // controls.enabled = true;
    render = stereo.render.bind( stereo, scene, camera );
    update = controls.update.bind( controls );
  }

  window.exitVR = exitVR;
  function exitVR() {
    // vrButton.style.display = "block";
    // screenButton.style.display = "none";

    controls = new THREE.TapTouchControls( camera );

    document.addEventListener( 'touchmove', onTouchMove, false );

    // camera.updateProjectionMatrix();

    mono.setSize( window.innerWidth, window.innerHeight );
    render = mono.render.bind( mono, scene, camera );
    update = camera.updateProjectionMatrix.bind( camera );
    scene.add( controls.getObject() );
  }

  function findIntersects() {
    if(!window.isMultiplayer || window.PLAYER_NUM === turn) {
      sightline.setFromCamera( mouse, camera );

      // calculate board tiles intersecting the picking ray
      intersects = sightline.intersectObjects( board.children );

      if ( intersects.length > 0 ) { // on focus
        if ( focus != intersects[ 0 ].object ) { // if focus is on a new object
          if ( focus ) focus.material.emissive.setHex( focus.currentHex ); // restore old focus' color
          focus = intersects[ 0 ].object; // Set focus to new object
          focus.currentHex = focus.material.emissive.getHex(); // remember focused elements color

          if(gameState[focus.userData.coord].ownedBy === null) {
            focus.material.emissive.setHex( PLAYER[turn].color ); // set focused element to new color
          }
        }
      } else {
        if(focus) { // on blur
          focus.material.emissive.setHex( focus.currentHex ); // restore old focus' color

          focus = null;
        }
      }
    }
  }

  function initMultiplayer() {
    socket = io(window.location.pathname, {some: 'data'});

    socket.on('connection', function(data) {
      // Client becomes player if one of the first two to connect to a game.
      // Otherwise, is spectator.
      if(data.hasOwnProperty('playerNum')) {
        window.PLAYER_NUM = data.playerNum;

        notifyArea.innerText = 'You are player ' + (data.playerNum + 1) + '!';
      } else {
        notifyArea.innerText = 'You are spectating';
        score1.innerText = scores[0].length = 2 ? scores[0] : '0' + scores[0];
        score2.innerText = scores[1].length = 2 ? scores[1] : '0' + scores[1];
        turn = data.turn;
        var i = 0;
        data.moves.forEach(function(move) {
          board.capture(move, i, true);
          i = ~~!!!i;
        });
      }
    })

    socket.on('user connected', function(socketId) {
      // notifyArea.innerText = 'player connected';
    })

    socket.on('receive move', function(data) {
      board.capture(data.move, data.turn);
      turn = ~~!!!data.turn;
      scores = data.scores;
      score1.innerText = scores[0].toString().length === 2 ? scores[0] : ('0' + scores[0]);
      score2.innerText = scores[1].toString().length === 2 ? scores[1] : ('0' + scores[1]);
      notifyArea.innerText = window.hasOwnProperty('PLAYER_NUM') && window.PLAYER_NUM === turn ? 'Your turn' : 'Player ' + (turn + 1) + '\'s turn';
    })

    socket.on('game over', function(data) {
      console.log('game over');

      notifyArea.innerText = data.message + ' Final score: ' + data.scores[0] + ' : ' + data.scores[1];
      // do game over stuff and show rematch/find new games buttons
    })

    socket.on('player leave', function(data) {
      var numMoves = data.scores.reduce(function(a, b) { return a + b; }, -4);

      if(numMoves) {
        notifyArea.innerText = 'Player ' + (data.playerNum + 1) + 'disconnected. Final score: ' + data.scores[0] + ' : ' + data.scores[1];
      } else {
        window.PLAYER_NUM = 0

        notifyArea.innerText = 'Player ' + (data.playerNum + 1) + ' disconnected. You are now player 1.';
      }
    })
  }

})();
