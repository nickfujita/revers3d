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

// function deepExtend(target, source) {
//   var sources = Array.prototype.slice.call(arguments, 1);

//   for(var i = 0; i < sources.length; i++) {
//     for(var key in sources[i]) {
//       if(target.hasOwnProperty(key) && typeof sources[i][key] === 'object') {
//         deepExtend(target[key], sources[i][key]);
//       }
//       else {
//         target[key] = sources[i][key];
//       }
//     }
//   }

//   return target;
// }

// function sum() { // sum(3)(4)() === 7;
//   var total = 0;
//   if(arguments[0]) {
//     total += arguments[0];
//     return sum;
//   }
//   else return total += sum;
// }

// console.log(sum(3)(4)());

// var str = 'Backbone, d3, Mongoose, SQL, mysql, sqlite, Sequelize, ES6, Gulp, socket.io, Mocha, Chai, levelDB, Material Design';

// function alphabetize(str) {
//   console.log('str.split(',')[0]:', str.split(',')[0]);

//   return str.split(', ').sort(function(a, b) {
//     var A = a.toLowerCase();
//     var B = b.toLowerCase();
//     if (A < B){
//       return -1;
//     }else if (A > B){
//       return  1;
//     }else{
//       return 0;
//     }
//   }).join(', ');
// }

// var x = alphabetize(str);
// console.log('x:', x);

// a-g, 1-8

var str = 'abcdefg'

for (var i = 0; i < str.length; i++) {
  for (var j = 1; j <= 8; j++) {
    console.log('this.' + str[i] + j + " = ");
  }
}
