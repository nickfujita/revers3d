(function() {
  /*
  ========================================
      Scene Setup
  ========================================
   */
  window.scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
  scene.add( light );

  window.controls = new THREE.PointerLockControls( camera );
  scene.add( controls.getObject() );

  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0xffffff );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Register event listeners
  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  initBoard();

  var prevTime = performance.now();
  animate();

  /*
  ========================================
      Animation
  ========================================
   */
  var INTERSECTED;

  var velocity = new THREE.Vector3();
  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;

  function animate() {
    requestAnimationFrame( animate );

    if ( controls.enabled ) {
      var time = performance.now();
      var delta = ( time - prevTime ) / 1000;

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;

      if ( moveForward ) velocity.z -= 400.0 * delta;
      if ( moveBackward ) velocity.z += 400.0 * delta;

      if ( moveLeft ) velocity.x -= 400.0 * delta;
      if ( moveRight ) velocity.x += 400.0 * delta;

      controls.getObject().translateX( velocity.x * delta );
      controls.getObject().translateZ( velocity.z * delta );

      prevTime = time;
    }

    var sightline = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    // update the picking ray with the camera and mouse position
    sightline.setFromCamera( mouse, camera );

    // calculate board tiles intersecting the picking ray
    // TODO: change scene.children to board
    var intersects = sightline.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
      if ( INTERSECTED != intersects[ 0 ].object ) {
        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        // Save previous properties of intersected object to restore its properties on blur
        INTERSECTED = intersects[ 0 ].object;
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex( 0xff0000 );

        // INTERSECTED.geometry = pieceGeometry;
      }
    } else {
      if(INTERSECTED) {
        // Restore previous properties of intersection
        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        // INTERSECTED.geometry = xyFace;
        INTERSECTED = null;
      }
    }

    renderer.render( scene, camera );
  }

  /*
  ========================================
      Event Handlers
  ========================================
   */

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function onKeyDown ( event ) {
    switch ( event.keyCode ) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true; break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 32: // space
        if ( canJump === true ) velocity.y += 350;
        canJump = false;
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
    }
  };
})();
