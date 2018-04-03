var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WarrantyPriceSchema = new Schema({
	productPrice: {
        type: Number,
        default: 0
    },
	warrantyPrice: {
        type: Number,
        default: 0
    }
});

mongoose.model('WarrantyPrice', WarrantyPriceSchema);

