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
    controls = new THREE.DeviceOrientationControls( camera );

    // var PI_2 = Math.PI / 2;
    // var xStart, yStart;
    // var tapStart;
    // var yaw = controls.yawObject;
    // var pitch = controls.pitchObject;

    document.addEventListener( 'touchstart', onTouchStart, false );
    // document.addEventListener( 'touchmove', onTouchMove, false );
    document.addEventListener( 'touchend', onTouchEnd, false );

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
  var fps = new Stats();
  fps.setMode( 0 ); // 0: fps, 1: ms, 2: mb

  // align top-left
  fps.domElement.style.position = 'absolute';
  fps.domElement.style.left = '0px';
  fps.domElement.style.top = '0px';

  document.body.appendChild( fps.domElement );
  fps.domElement.style.display = 'none';

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
      // if ( moveDown ) velocity.y -= 400.0 * delta;

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

      yaw.rotation.y += 0.005 * dx;
      xStart += dx;

      pitch.rotation.x += 0.005 * dy;
      pitch.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitch.rotation.x ) );
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

  function enterVR() {
    vrButton.style.display = "none";
    screenButton.style.display = "block";

    render = stereo.render.bind( stereo, scene, camera );
  }

  function exitVR() {
    vrButton.style.display = "block";
    screenButton.style.display = "none";

    mono.setSize( window.innerWidth, window.innerHeight );
    render = mono.render.bind( mono, scene, camera );
  }

  function findIntersects() {
    if(!window.isMultiplayer || window.PLAYER_NUM === turn) {
      sightline.setFromCamera( mouse, camera );

      // calculate board tiles intersecting the picking ray
      intersects = sightline.intersectObjects( board.children );

      if ( intersects.length > 0 ) { // on focus
        if ( focus != intersects[ 0 ].object ) { // if focus is on a new object
          // if ( focus ) focus.material.emissive.setHex( focus.currentHex ); // restore color to old object
          focus = intersects[ 0 ].object; // Set focus to new object
          focus.currentHex = focus.material.emissive.getHex(); // remember focused elements color

          if(gameState[focus.userData.coord].ownedBy === null) {
            focus.material.emissive.setHex( PLAYER[turn].color ); // set focused element to new color
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
