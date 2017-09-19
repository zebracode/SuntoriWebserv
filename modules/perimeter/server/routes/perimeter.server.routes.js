'use strict';

module.exports = function(app) {
	var perimeter = require('../controllers/perimeter.server.controller');
	app.get('/listPerimeter', perimeter.list);
	app.get('/readPerimeter', perimeter.read);
	app.post('/createPerimeter', perimeter.create);
	app.put('/updatePerimeter', perimeter.update);
	app.delete('/deletePerimeter', perimeter.delete);
};