(function() {
  var isMobile = checkMobile();
  /*
  ========================================
      Game vars
  ========================================
   */
  var PLAYER = [
    {
      color: 0xff0000
    }, {
      color: 0x1e09ff
    }
  ];

  var playerTurn = 0;

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


  // window.addEventListener('deviceorientation', setOrientationControls, true);


  /*
  ========================================
      Initialize controls
  ========================================
   */
  var render, update, controls;

  if(isMobile) {
    controls = new THREE.TapTouchControls( camera );

    var PI_2 = Math.PI / 2;
    var xStart, yStart;
    var tapStart;
    var yaw = controls.yawObject;
    var pitch = controls.pitchObject;

    document.addEventListener( 'touchstart', onTouchStart, false );
    document.addEventListener( 'touchmove', onTouchMove, false );
    document.addEventListener( 'touchend', onTouchEnd, false );

  } else {
    controls = new THREE.PointerLockControls( camera );

    window.addEventListener( 'resize', onWindowResize, false );
    // document.addEventListener( 'click', onClick, false );
    document.addEventListener( 'click', togVr, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    allowPointerLock(controls);
  }

  scene.add( controls.getObject() );
  var isVr = false;
  render = mono.render.bind( mono, scene, camera );
  update = camera.updateProjectionMatrix.bind( camera );

  function togVr(event) {
    if(event) {
      event.stopPropagation();
    }

    if(isVr) {
      mono.setSize( window.innerWidth, window.innerHeight );
      render = mono.render.bind( mono, scene, camera );
      console.log('vr off');
    } else {
      render = stereo.render.bind( stereo, scene, camera );
      console.log('vr on');
    }

    isVr = !isVr;
  }

  /*
  ========================================
      Initialize gameplay
  ========================================
   */
  window.board = new Board(new GameState(), PLAYER);
  var gameState = board.gs;

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
  var fps = new Stats();
  fps.setMode( 0 ); // 0: fps, 1: ms, 2: mb

  // align top-left
  fps.domElement.style.position = 'absolute';
  fps.domElement.style.left = '0px';
  fps.domElement.style.top = '0px';

  document.body.appendChild( fps.domElement );
  // fps.domElement.style.display = 'none';

  var prevTime = performance.now();

  function animate(time) {
    // Begin FPS calculation
    fps.begin();

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

    mono.setSize( window.innerWidth, window.innerHeight );
    stereo.setSize( window.innerWidth, window.innerHeight );
  }

  function onClick( event ) {
    event.stopPropagation();

    if(focus) {
      var coord = focus.userData.coord;
      if(gameState[coord].ownedBy === null) {
        board.capture(coord, playerTurn);
        playerTurn = ~~!!!playerTurn;
      } else {
        console.log(focus.userData.coord, 'already owned by player', gameState[coord].ownedBy);
      }
    } else {
      console.log('no tile selected');
    }
  }

  function onTouchStart( event ) {
    event.preventDefault();
    console.log('start!');
    if ( event.touches.length === 1 ) {
      // document.addEventListener( 'touchmove', onTouchMove, false );

      xStart = event.touches[ 0 ].pageX;
      yStart = event.touches[ 0 ].pageY;

      tapStart = Date.now();
    }
  }

  function onTouchMove( event ) {
    event.preventDefault();
    if ( event.touches.length === 1 ) {
      // document.addEventListener( 'touchend', onTouchEnd, false );
      var xEnd = event.touches[ 0 ].pageX;
      var yEnd = event.touches[ 0 ].pageY;

      var dx = xEnd - xStart;
      var dy = yEnd - yStart;

      yaw.rotation.y += 0.005 * dx;
      xStart += dx;

      pitch.rotation.x += 0.005 * dy;
      pitch.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitch.rotation.x ) );
      yStart += dy;
    }
  };

  function onTouchEnd( event ) {
    event.preventDefault();
    // document.removeEventListener( 'touchmove', onTouchMove, false );

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
  function checkMobile() {
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
    intersects = sightline.intersectObjects( board.children );

    if ( intersects.length > 0 ) { // on focus
      if ( focus != intersects[ 0 ].object ) { // if focus is on a new object
        // if ( focus ) focus.material.emissive.setHex( focus.currentHex ); // restore color to old object
        focus = intersects[ 0 ].object; // Set focus to new object
        focus.currentHex = focus.material.emissive.getHex(); // remember focused elements color

        if(gameState[focus.userData.coord].ownedBy === null) {
          focus.material.emissive.setHex( PLAYER[playerTurn].color ); // set focused element to new color
        }
      }
    } else {
      if(focus) { // on blur
        // Restore previous properties of intersection
        focus.material.emissive.setHex( focus.currentHex );

        focus = null;
      }
    }
  }

  function initMultiplayer() {
    var socket = io(window.location.pathname, {some: 'data'});

    socket.on('connection', function(data) {
      // Client becomes player if one of the first two to connect to a game.
      // Otherwise, is spectator.
      if(data.hasOwnProperty('playerNum')) {
        Object.defineProperty(window, 'PLAYER_NUM', {
          value: data.playerNum,
          writeable: false,
          enumerable: false
        })

        console.log('You are player', data.playerNum + 1);
      } else {
        console.log('You are a spectator.');
      }

      turn = data.turn;
      var i = 0;
      data.moves.forEach(function(move) {
        board.capture(move, i, true);
        i = ~~!!!i;
      })
    })

    socket.on('user connected', function(socketId) {
    })

    socket.on('receive move', function(data) {
      board.capture(data.move, data.turn);
      turn = ~~!!!data.turn;
      var scores = data.scores;
      console.log('scores', scores);
    })

    socket.on('game over', function(data) {
      alert(data.message + ' Final score: ' + data.scores[0] + ' : ' + data.scores[1]);
      // do game over stuff and show rematch/find new games buttons
    })

    socket.on('player leave', function(data) {
      alert('Player ' + (data.playerNum + 1) + 'disconnected. Final score: ')
    })
  }

})();

