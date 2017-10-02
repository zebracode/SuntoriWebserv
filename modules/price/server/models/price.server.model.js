var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PriceSchema = new Schema({
	weight: String,
	price: String,
	charge: String
});

mongoose.model('Price', PriceSchema);

