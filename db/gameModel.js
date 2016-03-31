// # Mongoose Board Model & Schema
var mongoose = require('mongoose');
var db = require('./config');

var gameRoom = new mongoose.Schema({
  moves: Array,
  players: Array,
  private: Boolean,
  roomId: String,
});

module.exports.gameModel = mongoose.model('games', gameRoom);
