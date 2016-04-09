// Write a function to take a list of numbers and a target, and return all the
// ways that those numbers can be formed into expressions evaluating to the
// target. Do not use the eval function in Python, Ruby or JavaScript

// Array of mathematical operators, in order of operations. Can support more operations.
var operators = [
  ['*', function(a, b) { return parseInt(a) * parseInt(b) }],
  ['/', function(a, b) { return parseInt(a) / parseInt(b) }],
  ['+', function(a, b) { return parseInt(a) + parseInt(b) }],
  ['-', function(a, b) { return parseInt(a) - parseInt(b) }],
]

function f(numString, target) {
  var res = [];
  var stringWOps = insertOperators(numString);

  stringWOps.forEach(function(val){
    if(evaluateString(val) === target) {
      res.push(val);
    }
  })

  return res;
}

// 3 + 1 - 415 * 92 + 65358 = 27182
function evaluateString(expression) {
  var exp = trimWhiteSpace(expression);

  for(var i = 0; i < operators.length; i++) {
    var re = new RegExp('(\\d+)\\' + operators[i][0] + '(\\d+)', 'g');

    var matches = exp.match(re);

    if(matches !== null) {
      var vals = [];

      matches.forEach(function(match) {
        var re2 = new RegExp('(\\d+)\\D(\\d+)')
        var operands = re2.exec(match);

        var val = operators[i][1](operands[1], operands[2]);

        exp = exp.replace(match, val);
      })
    }
  }

  return parseInt(exp);
}


function trimWhiteSpace(expression) {
  return expression.replace(/ /g,'');
}

function insertOperators(numString) {
  var combos = [numString];

  var head, tail;
  for(var i = 1; i < numString.length; i++) {
    head = numString.substring(0, i);
    tail = numString.substring(i);

    insertOperators(tail).forEach(function(val) {
      for(var j = 0; j < operators.length; j++) {
        combos.push(head + operators[j][0] + val);
      }
    })
  }

  return combos;
}

// var input = "314159265358";
// console.time('y')
// var x = insertOperators('12345678901');
// console.timeEnd('y');
// console.log('x:', x);



// var test = "3 + 1 - 415 * 92 + 65358"
// console.log('eval', eval(test));
// console.log('evaluateString', evaluateString(test));




// var x = f('6319', 8);
// console.log('x:', x);

// a:
// for (var i = 0; i < 8; i++) {
//   console.log('i:', i);

//   b:
//   for(var j = 0; j < 10; j++) {
//     break b;
//     console.log('j', j);
//     if(j === 3 && i === 2) {
//     }
//   }
// }
