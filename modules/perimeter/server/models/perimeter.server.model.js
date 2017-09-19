var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PerimeterSchema = new Schema({
	provinceName: {
		type: String, unique: true, index: true
	}
});

mongoose.model('Perimeter', PerimeterSchema);