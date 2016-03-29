/*
========================================
    Tiles (graph nodes)
========================================
 */

/**
 * Constructor for individual surface of board. Has relationships with other Tiles.
 * Relationships are defined where upper and lowercase of the same letter are opposite.
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

Tile.prototype.light = function(color) {
  color = color || 0x7fff00;

  this.previousColor = this.mesh.material.emissive.getHex();
  this.mesh.material.emissive.setHex(color);
}

Tile.prototype.unlight = function(color) {
  color = color || 0x7fff00;

  this.mesh.material.emissive.setHex(this.previousColor);
}

Tile.prototype.capture = function(playerNum, color) {
  this.ownedBy = playerNum;
  this.light(color);
}

module.exports = Tile;
