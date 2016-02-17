/*
========================================
    Scene setup
========================================
 */
var scene = new THREE.Scene();

// Lights
var light = new THREE.PointLight( 0xffffff, 4, 100 );
light.position.set( 0, 10, 90 );
scene.add( light );

// var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
// directionalLight.position.set( camera.position.x, camera.position.y, camera.position.z );
// scene.add( directionalLight );

var spotLight = new THREE.SpotLight( 0xff0066 );

// console.log(camera.position.x, camera.position.y, camera.position.z);

spotLight.position.set( 0, 0, 5 );

spotLight.castShadow = true;

// spotLight.shadowMapWidth = 1024;
// spotLight.shadowMapHeight = 1024;

// spotLight.shadowCameraNear = 500;
// spotLight.shadowCameraFar = 4000;
// spotLight.shadowCameraFov = 30;

scene.add( spotLight );

// Camera
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.5, 500 );
// var height = 100, width = 100;
// var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );

camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

/*
========================================
    Board Setup
========================================
 */


var geometry = new THREE.BoxGeometry( 0.8, 0.8, .1 );
var pieceGeometry = new THREE.IcosahedronGeometry(.4, 0);

var material = new THREE.MeshLambertMaterial({
  color: 0x999999
});

// Initialize board
var board = [];
for(var i = 0; i < 8; i++) {
  board[i] = [];
  for(var j = 0; j < 8; j++) {
    board[i][j] = new THREE.Mesh( geometry, material );
    board[i][j].position.x = i - 3.25;
    board[i][j].position.y = j - 3.25;

    scene.add( board[i][j] )
  }
}

// var cube = new THREE.Mesh( geometry, material );
// cube.position.x = 1;
// cube.position.y = 0;

// scene.add( cube )

// var cube2 = new THREE.Mesh( geometry, material );
// cube2.position.x = 2;
// cube2.position.y = 0;

// scene.add( cube2 );



/*
==============================
    Window Events
==============================
 */

window.onresize = function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  // refreshCube();
  isPaused = true;
  setTimeout(function() {
    isPaused = false;
  }, 400);
}


/*
========================================
    Mouse Events
========================================
 */

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var INTERSECTED;

window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'mousedown', onMouseClick, false );
window.addEventListener( 'scrolldown', onScrollDown, false );

function onMouseMove( event ) {
  event.preventDefault();

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onMouseClick( event ) {
  event.preventDefault();

  if(INTERSECTED) {
    // console.log('INTERSECTED:', INTERSECTED);
  }
  else  {
    // console.log('should drag');
  }
}

function onScrollDown( event ) {
  // console.log('scrolldown');

}

/*
==============================
    Custom Event Listeners
==============================
 */

function test() {
  console.log(scene.getObjectById(1));
}


/*
==============================
    Animations
==============================
 */


// function refreshCube() {
//   if(cube) {
//     scene.remove(cube);
//   }

//   geometry = new THREE.BoxGeometry( 1, 1, 1 );
//   material = new THREE.MeshLambertMaterial({
//     color: 0xffefd5
//   });
//   cube = new THREE.Mesh( geometry, material );
//   cube.addEventListener('click', function() {
//     console.log('click');
//   })
//   scene.add( cube );
// }

function render() {
  // if(!isPaused) {
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;
  // }

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera( mouse, camera );

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects( scene.children );

  if ( intersects.length > 0 ) {
    document.body.style.cursor = 'pointer';
    if ( INTERSECTED != intersects[ 0 ].object ) {
      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      // Save previous properties of intersected object to restore its properties on blur
      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      // INTERSECTED.material.emissive.setHex( 0xff0000 );

      spotLight.target = INTERSECTED;
      INTERSECTED.geometry = pieceGeometry;
    }
  } else {
    if(INTERSECTED) {
      document.body.style.cursor = 'crosshair';
      // Restore previous properties of intersection
      // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      INTERSECTED.geometry = geometry;
      INTERSECTED = null;
    }
  }

  renderer.render( scene, camera );

  animationID = requestAnimationFrame( render );
}

/*
========================================
    Main
========================================
 */
// var animationID, isPaused, geometry, material, cube;

// refreshCube();
render();
