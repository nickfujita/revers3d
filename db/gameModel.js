// # Mongoose Board Model & Schema
var mongoose = require('mongoose');
var db = require('./config');

var gameRoom = new mongoose.Schema({
  roomId: String,
  private: Boolean,
  moves: Array,
});

module.exports.gameModel = mongoose.model('games', gameRoom);
