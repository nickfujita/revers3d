var MID_TILE = 11;
var RADIUS = 37.55634918610404;
var EDGE_DISTANCE = 29.77817459305202;
var CORNER_DISTANCE = 27.685449728701347;

var state = {};

// ***********FACES
gameState.a1 = faces[ -MID_TILE ][ RADIUS ][ MID_TILE ];
gameState.a2 = faces[ MID_TILE ][ RADIUS ][ MID_TILE ];
gameState.a3 = faces[ -MID_TILE ][ RADIUS ][ -MID_TILE ];
gameState.a4 = faces[ MID_TILE ][ RADIUS ][ -MID_TILE ];
gameState.a5 = edges[ -MID_TILE ][ EDGE_DISTANCE ][ -EDGE_DISTANCE ];
gameState.a6 = edges[ MID_TILE ][ EDGE_DISTANCE ][ -EDGE_DISTANCE ];
gameState.a7 = corners[ CORNER_DISTANCE ][ CORNER_DISTANCE ][ -CORNER_DISTANCE ];
gameState.a8 = edges[ EDGE_DISTANCE ][ EDGE_DISTANCE ][ -MID_TILE ];
gameState.b1 = edges[ EDGE_DISTANCE ][ EDGE_DISTANCE ][ MID_TILE ];
gameState.b2 = corners[ CORNER_DISTANCE ][ CORNER_DISTANCE ][ CORNER_DISTANCE ];
gameState.b3 = edges[ MID_TILE ][ EDGE_DISTANCE ][ EDGE_DISTANCE ];
gameState.b4 = edges[ -MID_TILE ][ EDGE_DISTANCE ][ EDGE_DISTANCE ];
gameState.b5 = corners[ -CORNER_DISTANCE ][ CORNER_DISTANCE ][ CORNER_DISTANCE ];
gameState.b6 = edges[ -EDGE_DISTANCE ][ EDGE_DISTANCE ][ MID_TILE ];
gameState.b7 = edges[ -EDGE_DISTANCE ][ EDGE_DISTANCE ][ -MID_TILE ];
gameState.b8 = corners[ -CORNER_DISTANCE ][ CORNER_DISTANCE ][ -CORNER_DISTANCE ];
gameState.c1 = faces[ -MID_TILE ][ MID_TILE ][ -RADIUS ];
gameState.c2 = faces[ MID_TILE ][ MID_TILE ][ -RADIUS ];
gameState.c3 = edges[ EDGE_DISTANCE ][ MID_TILE ][ -EDGE_DISTANCE ];
gameState.c4 = faces[ RADIUS ][ -MID_TILE ][ -MID_TILE ];
gameState.c5 = faces[ RADIUS ][ MID_TILE ][ MID_TILE ];
gameState.c6 = edges[ EDGE_DISTANCE ][ MID_TILE ][ EDGE_DISTANCE ];
gameState.c7 = faces[ MID_TILE ][ MID_TILE ][ RADIUS ];
gameState.c8 = faces[ -MID_TILE ][ MID_TILE ][ RADIUS ];
gameState.d1 = edges[ -EDGE_DISTANCE ][ MID_TILE ][ EDGE_DISTANCE ];
gameState.d2 = faces[ -RADIUS ][ MID_TILE ][ MID_TILE ];
gameState.d3 = faces[ -RADIUS ][ MID_TILE ][ -MID_TILE ];
gameState.d4 = edges[ -EDGE_DISTANCE ][ MID_TILE ][ -EDGE_DISTANCE ];
gameState.d5 = faces[ -MID_TILE ][ -MID_TILE ][ -RADIUS ];
gameState.d6 = faces[ MID_TILE ][ -MID_TILE ][ -RADIUS ];
gameState.d7 = edges[ EDGE_DISTANCE ][ -MID_TILE ][ -EDGE_DISTANCE ];
gameState.d8 = faces[ RADIUS ][ -MID_TILE ][ MID_TILE ];
gameState.e1 = faces[ RADIUS ][ MID_TILE ][ -MID_TILE ];
gameState.e2 = edges[ EDGE_DISTANCE ][ -MID_TILE ][ EDGE_DISTANCE ];
gameState.e3 = faces[ MID_TILE ][ -MID_TILE ][ RADIUS ];
gameState.e4 = faces[ -MID_TILE ][ -MID_TILE ][ RADIUS ];
gameState.e5 = edges[ -EDGE_DISTANCE ][ -MID_TILE ][ EDGE_DISTANCE ];
gameState.e6 = faces[ -RADIUS ][ -MID_TILE ][ MID_TILE ];
gameState.e7 = faces[ -RADIUS ][ -MID_TILE ][ -MID_TILE ];
gameState.e8 = edges[ -EDGE_DISTANCE ][ -MID_TILE ][ -EDGE_DISTANCE ];
gameState.f1 = edges[ -MID_TILE ][ -EDGE_DISTANCE ][ -EDGE_DISTANCE ];
gameState.f2 = edges[ MID_TILE ][ -EDGE_DISTANCE ][ -EDGE_DISTANCE ];
gameState.f3 = corners[ CORNER_DISTANCE ][ -CORNER_DISTANCE ][ -CORNER_DISTANCE ];
gameState.f4 = edges[ EDGE_DISTANCE ][ -EDGE_DISTANCE ][ -MID_TILE ];
gameState.f5 = edges[ EDGE_DISTANCE ][ -EDGE_DISTANCE ][ MID_TILE ];
gameState.f6 = corners[ CORNER_DISTANCE ][ -CORNER_DISTANCE ][ CORNER_DISTANCE ];
gameState.f7 = edges[ MID_TILE ][ -EDGE_DISTANCE ][ EDGE_DISTANCE ];
gameState.f8 = edges[ -MID_TILE ][ -EDGE_DISTANCE ][ EDGE_DISTANCE ];
gameState.g1 = corners[ -CORNER_DISTANCE ][ -CORNER_DISTANCE ][ CORNER_DISTANCE ];
gameState.g2 = edges[ -EDGE_DISTANCE ][ -EDGE_DISTANCE ][ MID_TILE ];
gameState.g3 = edges[ -EDGE_DISTANCE ][ -EDGE_DISTANCE ][ -MID_TILE ];
gameState.g4 = corners[ -CORNER_DISTANCE ][ -CORNER_DISTANCE ][ -CORNER_DISTANCE ];
gameState.g5 = faces[ -MID_TILE ][ -RADIUS ][ -MID_TILE ];
gameState.g6 = faces[ MID_TILE ][ -RADIUS ][ -MID_TILE ];
gameState.g7 = faces[ -MID_TILE ][ -RADIUS ][ MID_TILE ];
gameState.g8 = faces[ MID_TILE ][ -RADIUS ][ MID_TILE ];