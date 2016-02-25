(function() {
  /*
  ========================================
      Game vars
  ========================================
   */
  window.board = {
    color: 0x999999,
  }

  var PLAYER_COLORS = [0xff0000, 0x1e09ff];

  var playerTurn = 0;

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
  document.addEventListener( 'click', onClick, false );
  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  window.socket = io('http://localhost:3030');
  initBoard();
  var prevTime = performance.now();
  window.requestAnimationFrame( animate );


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

  // FPS
  var fps = new Stats();
  fps.setMode( 0 ); // 0: fps, 1: ms, 2: mb

  // align top-left
  fps.domElement.style.position = 'absolute';
  fps.domElement.style.left = '0px';
  fps.domElement.style.top = '0px';

  document.body.appendChild( fps.domElement );
  fps.domElement.style.display = 'none';

  function animate(time) {
    // Begin FPS calculation
    fps.begin();

    if ( controls.enabled ) {
      var delta = ( time - prevTime ) / 1000;

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;

      if ( moveForward ) velocity.z -= 400.0 * delta;
      if ( moveBackward ) velocity.z += 400.0 * delta;
      if ( moveLeft ) velocity.x -= 400.0 * delta;
      if ( moveRight ) velocity.x += 400.0 * delta;

      controls.getObject().translateX( velocity.x * delta );
      controls.getObject().translateZ( velocity.z * delta );

      // Calculate fps
      // elapsed = Math.floor(time / 1000);
      // if(elapsed > seconds) {
      //   console.log('fps:', 1/delta);
      //   seconds = elapsed;
      // }

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
        INTERSECTED.material.emissive.setHex( PLAYER_COLORS[playerTurn] );
      }
    } else {
      if(INTERSECTED) {
        // Restore previous properties of intersection
        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
      }
    }
    renderer.render( scene, camera );

    // End FPS calculation
    fps.end();

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

    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function onClick( event ) {
    if(window.controls.enabled) {
      // if(INTERSECTED.material.emissive.getHex())
      INTERSECTED.currentHex = PLAYER_COLORS[playerTurn];

      playerTurn = 1 - playerTurn;
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

      case 70: // f
        if(event.ctrlKey) {
          if(fps.domElement.style.display === 'none') {
            fps.domElement.style.display = 'block';
          } else {
            fps.domElement.style.display = 'none';
          }
        }
        break;
    }
  };
})();
