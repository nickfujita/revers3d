// function allCombos(remaining, init) {
//   var objSoFar = {};

//   if(remaining.length) {
//     for(var i = 0; i < remaining.length; i++) {
//       var r = allCombos(remaining.slice(0, i).concat(remaining.slice(i+1)), init);
//       objSoFar[remaining[i]] = r;
//       objSoFar[-remaining[i]] = r;
//     }
//   }
//   else {
//     objSoFar = init;
//   }

//   return objSoFar;
// }

function deepExtend(target, source) {
  var sources = Array.prototype.slice.call(arguments, 1);

  for(var i = 0; i < sources.length; i++) {
    for(var key in sources[i]) {
      if(target.hasOwnProperty(key) && typeof sources[i][key] === 'object') {
        deepExtend(target[key], sources[i][key]);
      }
      else {
        target[key] = sources[i][key];
      }
    }
  }

  return target;
}

var prev = gameState.f1;

for(var i = 0, tile = gameState.d6; i < 9; i++){
  var current = tile;
  tile = tile.traverse(prev, function(newTile) { newTile.light(); });
  prev = current;
}
