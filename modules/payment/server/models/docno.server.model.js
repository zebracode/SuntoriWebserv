var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DocNoSchema = new Schema({
	prefix : {type: String, unique: true},
	nextNumber: String
});

mongoose.model('DocNo', DocNoSchema);

