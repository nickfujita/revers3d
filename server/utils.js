function allCombos(remaining, init) {
  var objSoFar = {};

  if(remaining.length) {
    for(var i = 0; i < remaining.length; i++) {
      objSoFar[remaining[i]] = deepExtend({}, allCombos(remaining.slice(0, i).concat(remaining.slice(i+1)), init));
      objSoFar[-remaining[i]] = deepExtend({}, allCombos(remaining.slice(0, i).concat(remaining.slice(i+1)), init));
    }
  } else {
    objSoFar = init;
  }

  return objSoFar;
}

function deepExtend(target) {
  var sources = Array.prototype.slice.call(arguments, 1);

  for(var i = 0; i < sources.length; i++) {
    for(var key in sources[i]) {
      if(target.hasOwnProperty(key) && typeof sources[i][key] === 'object') {
        deepExtend(target[key], sources[i][key]);
      } else {
        target[key] = sources[i][key];
      }
    }
  }

  return target;
}

function randStr(length) {
  return (Math.floor(Math.random() * Math.pow(10, length + 2))).toString(36).substr(0, length);
}

module.exports = {
  allCombos: allCombos,
  deepExtend: deepExtend,
  randStr: randStr
};
