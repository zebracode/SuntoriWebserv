var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TpLastNumber = new Schema({
   number: String,
   weight: String
});

mongoose.model('TpLastNumber', TpLastNumber);
