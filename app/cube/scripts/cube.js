/*
========================================
    Scene setup
========================================
 */

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var light = new THREE.PointLight( 0xffffff, 8, 100 );
light.position.set( 50, 50, 50 );
scene.add( light );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

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

function onMouseMove( event ) {
  event.preventDefault();

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

/*
==============================
    Custom Event Listeners
==============================
 */

document.getElementById('goFS').addEventListener('click', function(){
  toggleFullScreen();
})
document.getElementById('test').addEventListener('click', function(){
  test();
})

function test() {
  console.log(scene.getObjectById(1));
}

function toggleFullScreen(enterFS, exitFS) {
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
    if(enterFS) enterFS();
  }
  else {
    if(exitFS) exitFS();
    cancelFullScreen.call(doc);
  }
}

/*
==============================
    Three js stuff
==============================
 */


function refreshCube() {
  if(cube) {
    scene.remove(cube);
  }

  geometry = new THREE.BoxGeometry( 1, 1, 1 );
  material = new THREE.MeshLambertMaterial({
    color: 0xffefd5
  });
  cube = new THREE.Mesh( geometry, material );
  cube.addEventListener('click', function() {
    console.log('click');
  })
  scene.add( cube );
}

function render() {
  if(!isPaused) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera( mouse, camera );

  // var intersect = raycaster.intersectObjects( scene.children )[0];

  // if(intersect) {
  //   console.log(INTERSECTED);

  //   intersect.object.material.wireframe = true;
  // }
  // else {
  // }

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects( scene.children );

  if ( intersects.length > 0 ) {
    document.body.style.cursor = 'pointer';
    if ( INTERSECTED != intersects[ 0 ].object ) {
      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      // Save previous properties of intersected object to restore its properties on blur
      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xff0000 );
    }
  } else {
    document.body.style.cursor = 'crosshair';
    // Restore previous properties of intersection
    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    INTERSECTED = null;
  }

  renderer.render( scene, camera );

  animationID = requestAnimationFrame( render );
}

/*
========================================
    Main
========================================
 */

var animationID, isPaused, geometry, material, cube;

refreshCube();
render();
