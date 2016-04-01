/**
* @param {string[][]} tickets
* @return {string[]}
*/

var numInstances = function (arr, str) {
   return arr.reduce(function(memo, current) {
       if (current === str) {
           return memo + 1;
       }
       return memo;
   }, 0);
}

var concatTo = function (prepend) {
   return function (append) {
       return prepend.concat(append);
   };
};

var lexicalSort = function (a, b) {
 return a > b;
};

var pushTo = function (arr) {
   return function (item) {
       arr.push(item);
   };
};

var findItinerary = function(tickets) {
   var ITINERARY_LENGTH = tickets.length + 1;

   if (tickets.length === 0) return [];

   var availableDest = function (outbound, dest) {
       return outbound && outbound.indexOf(dest) === -1;
   };

   var hasAvailableVisits = function (tripSoFar) {
       return function (dest) {
           return numInstances(tripSoFar, dest) < numConnectionsTo[dest];
       }
   };

   var numConnectionsTo = {};
   var connectingFlights = {};
   tickets.forEach(function(ticket) {
       var from    = ticket[0],
           to      = ticket[1];
       if (availableDest(connectingFlights[from], to)) {
           connectingFlights[from].push(to);
       } else {
           connectingFlights[from] = connectingFlights[from] ? connectingFlights[from] : [to];
       }
       numConnectionsTo[to] = ~~numConnectionsTo[to] + 1;
   });
   console.log('connectingFlights:', connectingFlights);


   var queue = [ ["JFK"] ];

   var count = 0;

   while (queue[0] && count++ < 100000) {
       var tripSoFar = queue.shift();
       var lastStop = tripSoFar[tripSoFar.length - 1];
       var outbound = connectingFlights[lastStop];
       // console.log('tripSoFar.length, tripSoFar.length < ITINERARY_LENGTH:', tripSoFar.length, tripSoFar.length < ITINERARY_LENGTH);

       if (tripSoFar.length === ITINERARY_LENGTH) {
           return tripSoFar;
       }
       if (outbound) {
           outbound
               .sort(lexicalSort)
               .filter(hasAvailableVisits(tripSoFar))
               .map(concatTo(tripSoFar))
               .forEach(pushTo(queue));
       }
       // console.log('queue[0]:', queue[0]);

   }

   console.log('ITINERARY_LENGTH:', ITINERARY_LENGTH);
};

var infItin = [["EZE","TIA"],["EZE","HBA"],["AXA","TIA"],["JFK","AXA"],["ANU","JFK"],["ADL","ANU"],["TIA","AUA"],["ANU","AUA"],["ADL","EZE"],["ADL","EZE"],["EZE","ADL"],["AXA","EZE"],["AUA","AXA"],["JFK","AXA"],["AXA","AUA"],["AUA","ADL"],["ANU","EZE"],["TIA","ADL"],["EZE","ANU"],["AUA","ANU"]]

// var brokenItin = [['JFK', 'SFO'], ['SFO', 'SJC'], ['SJC', 'DFW'], ['DFW', 'CLE'], ['CLE', 'SJC'], ['SJC', 'LAX']];

var fourteen = [['JFK', 'SJC'],['SJC', 'SFO'],['SFO', 'SJC'],['SJC', 'SFO'],['SFO', 'SJC'],['SJC', 'SFO'],['SFO', 'SJC'],['SJC', 'SFO'],['SFO', 'SJC'],['SJC', 'SFO'],['SFO', 'SJC'],['SJC', 'SFO'],['SFO', 'SJC']]

console.log('RESULT', findItinerary(infItin));
