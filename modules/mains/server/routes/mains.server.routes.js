'use strict';

/**
 * Module dependencies.
 */
var mainsPolicy = require('../policies/mains.server.policy'),
  multer = require('multer'),
  mains = require('../controllers/mains.server.controller');

module.exports = function (app) {
  // Mains collection routes
  app.route('/api/mains').all(mainsPolicy.isAllowed)
    .get(mains.list)
    .post(mains.create);

  // Single main routes
  app.route('/api/mains/:mainId').all(mainsPolicy.isAllowed)
    .get(mains.read)
    .put(mains.update)
    .delete(mains.delete);

  app.get('/api/mainByUserAndStatus', mains.mainByUserAndStatus);

  app.get('/api/mainsTotal', mains.totalMains);

  // Finish by binding the main middleware
  app.param('mainId', mains.mainByID);

  app.route('/api/main/findByName')
    .get(mains.findByName);
  
  app.post('/api/update/mains', mains.updateByBarcode).all(mainsPolicy.isAllowed);
  
  app.post('/api/update/barcode', mains.setBarcode).all(mainsPolicy.isAllowed);
  
  app.get('/print/all', mains.printAll);
  app.get('/print/bill', mains.printBill);
  app.get('/print/slip', mains.printSlip);

  app.route('/api/upload/shipping')//.all(mainsPolicy.isAllowed)
    .post(mains.uploadShipping);

  // Boonchuay 2 August 2018
  app.get('/api/mainByBarcode', mains.findByBarcode);
  // Boonchuay 2 August 2018

  // Boonchuay 6 August 2018 Start
  // Export Summary as Excel
  app.get('/api/excel/summary', mains.exportSummary);
  // Boonchuay 6 August 2018 End

  // Boonchuay 19 August 2018 Start
  app.get('/api/findMains', mains.findMains);
  // Boonchuay 19 August 2018 End


  app.post('/api/update/mainById', mains.updateById).all(mainsPolicy.isAllowed);
};
