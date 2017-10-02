'use strict';

module.exports = function(app) {
	var price = require('../controllers/price.server.controller');
	app.route('/price')
		.get(price.list)
		.post(price.create);
	app.route('/price/:weight')
		.get(price.read)
		.put(price.update)
		.delete(price.delete);
	app.param('weight', price.priceByWeight);
};
