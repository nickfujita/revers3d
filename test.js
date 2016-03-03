function allCombos(remaining, init) {
  var objSoFar = {};

  if(remaining.length) {
    for(var i = 0; i < remaining.length; i++) {
      var r = allCombos(remaining.slice(0, i).concat(remaining.slice(i+1)), init);
      objSoFar[remaining[i]] = r;
      objSoFar[-remaining[i]] = r;
    }
  }
  else {
    objSoFar = init;
  }

  return objSoFar;
}
