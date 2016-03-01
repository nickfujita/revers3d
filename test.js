// Calculates all combinations of coordinates (x, y, z) such that the points are
// centered around (0, 0, 0), which form the surface of a cube. Returns an object
// where obj[x][y][z] is initialized to a value, init
function allCombos(tileSize, boardSize, radius, init) {
  var combos = {};
  var ordinates = [];
  var max = (tileSize * boardSize / 2) - (1/2 * tileSize);

  for(var i = -max; i <= max; i+= tileSize) {
    ordinates.push(i);
  }


  function createCoordinates(ordinates, d) {
    for(var i = 0; i < ordinates.length; i++) {
      combos[ordinates] = {};
    }

    for(var i = 0; i < d; i++) {
      ordinates.forEach(function(value) {
        combos[value] = createCoordinates(ordinates, d-1);
      })
    }
  }
}

allCombos(10, 4, 0)
