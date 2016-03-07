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


  var mono = new THREE.WebGLRenderer();
  mono.setClearColor( 0xffffff );
  mono.setPixelRatio( window.devicePixelRatio );
  mono.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( mono.domElement );

  // Register event listeners
  // window.addEventListener('deviceorientation', setOrientationControls, true);
  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'click', onClick, false );
  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  /*
  ========================================
      Initialization
  ========================================
   */
  var render, update;

  if(isMobile()) {
    var vrButton = document.getElementById('vr-icon');
    var screenButton = document.getElementById('screen-icon');
    vrButton.style.display = "block";
    vrButton.addEventListener( 'click', toggleFullScreen.bind(null, enterVR, exitVR), false );
    screenButton.addEventListener( 'click', toggleFullScreen.bind(null, enterVR, exitVR), false );

    window.controls = new THREE.DeviceOrientationControls(camera, true);
    var stereo = new THREE.StereoEffect(mono);

    instructions.style.display = 'none';
    blocker.style.display = 'none';

    render = stereo.render.bind( stereo, scene, camera );
    update = controls.update.bind( controls );
  }
  else {
    enablePointerLock();
    window.controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );

    render = mono.render.bind( mono, scene, camera );
    update = camera.updateProjectionMatrix.bind( camera );
  }

  window.requestAnimationFrame( animate );

  /*
  ========================================
      Sockets
  ========================================
   */

  window.socket = io('http://localhost:3030');
  initBoard();
  var prevTime = performance.now();


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

  // Set sight ray
  var focus, intersects;
  var sightline = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  // FPS
  var fps = new Stats();
  fps.setMode( 0 ); // 0: fps, 1: ms, 2: mb

  // align top-left
  fps.domElement.style.position = 'absolute';
  fps.domElement.style.left = '0px';
  fps.domElement.style.top = '0px';

  document.body.appendChild( fps.domElement );
  // fps.domElement.style.display = 'none';

  function animate(time) {
    // Begin FPS calculation
    fps.begin();

    // Allow movement for development
    if ( !stereo ) {
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

    update();
    findIntersects();
    render();

    // End FPS calculation
    fps.end();

    window.requestAnimationFrame( animate );
  }

  /*
  ========================================
      Event Handlers
  ========================================
   */
  // function setOrientationControls(e) {
  //   if (!e.alpha) {
  //     return;
  //   }

  //   controls = new THREE.DeviceOrientationControls(camera, true);
  //   controls.connect();
  //   controls.update();
  //   element.addEventListener('click', fullscreen, false);

  //   window.removeEventListener('deviceorientation', setOrientationControls, true);
  // }



  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    mono.setSize( window.innerWidth, window.innerHeight );
  }

  function onClick( event ) {
    event.stopPropagation();

    if(INTERSECTED) {
      INTERSECTED.currentHex = PLAYER_COLORS[playerTurn];
      playerTurn = 1 - playerTurn;
    }
    else {
      console.log('no tile selected');
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

  /*
  ========================================
      Helpers
  ========================================
   */

  function isMobile() {
    try{ document.createEvent("TouchEvent"); return true; }
    catch(e){ return false; }
  }

  function toggleFullScreen(enterFS, exitFS, event) {
    event.stopPropagation();

    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      // Enter fullscreen
      requestFullScreen.call(docEl);
      if(enterFS) enterFS();
    }
    else {
      if(exitFS) exitFS();
      // Exit fullscreen
      cancelFullScreen.call(doc);
    }
  }

  function enterVR() {
    vrButton.style.display = "none";
    screenButton.style.display = "block";

    // scene.remove( controls.getObject() );
    // vrButton.style.display = "block";
    // screenButton.style.display = "none";

    // controls = new THREE.DeviceOrientationControls(camera, true);
    // stereo = new THREE.StereoEffect(mono);

    // render = stereo.render.bind( stereo, scene, camera );
    // update = controls.update.bind( controls );
  }

  function exitVR() {
    vrButton.style.display = "block";
    screenButton.style.display = "none";

    // vrButton.style.display = "none";
    // screenButton.style.display = "block";

    // controls = new THREE.PointerLockControls( camera );
    // scene.add( controls.getObject() );

    // render = mono.render.bind( mono, scene, camera );
    // update = camera.updateProjectionMatrix.bind( camera );
  }

  function findIntersects() {
    sightline.setFromCamera( mouse, camera );

    // calculate board tiles intersecting the picking ray
    intersects = sightline.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
      if ( focus != intersects[ 0 ].object ) {
        if ( focus ) focus.material.emissive.setHex( focus.currentHex );
        // Save previous properties of intersected object to restore its properties on blur
        focus = intersects[ 0 ].object;
        focus.currentHex = focus.material.emissive.getHex();
        focus.material.emissive.setHex( PLAYER_COLORS[playerTurn] );
      }
    } else {
      if(focus) {
        // Restore previous properties of intersection
        if ( focus ) focus.material.emissive.setHex( focus.currentHex );
        focus = null;
      }
    }
  }

})();

