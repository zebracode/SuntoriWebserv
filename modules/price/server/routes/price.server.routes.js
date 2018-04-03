'use strict';

module.exports = function(app) {
	var price = require('../controllers/price.server.controller');

	var warrantyPrice = require('../controllers/warrantyprice.server.controller');

	app.route('/price')
		.get(price.list)
		.post(price.create);
	app.route('/price/:weight')
		.get(price.read)
		.put(price.update)
		.delete(price.delete);
	app.param('weight', price.priceByWeight);


	//Warranty Price Routes
	app.route('/api/warrantyprice')
	.get(warrantyPrice.list)
	.post(warrantyPrice.create);

	app.route('/api/warrantyprice/:warrantypriceId')
	.get(warrantyPrice.read)
	.put(warrantyPrice.update)
	.delete(warrantyPrice.delete);

	app.param('warrantypriceId', warrantyPrice.warrantyPriceById);
};
