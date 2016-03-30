if(process) {
  module.exports = Tile;
}
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
