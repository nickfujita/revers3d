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
