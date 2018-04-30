'use strict';

//Mains service used for communicating with the mains REST endpoints
angular.module('mains').factory('ThailandPost', ['$resource',
  function ($resource) {
    
    var resource = $resource('/api/thailandpost/createOrder', 
    {
      id: '@_id'
    }, 
    {
      save: {
        method:'POST',
        isArray:true
      },
      update: {
        method: 'PUT',
      }
    });
    
    resource.createOrder = function (main, barcode) {
      return this.save(
        {
          "orderId": main.order,
          "invNo": main.invoice,
          "barcode": barcode,
          "cusName": main.r_name,
          "cusAdd": main.r_address,
          "cusAmp": main.r_ampher,
          "cusProv": main.r_country,
          "cusZipcode": main.r_postcode,
          "cusTel": main.r_tel,
          "productPrice": main.price,
          "productInbox": main.detail,
          "productWeight": main.weight,
          "orderType": "D",
          "manifestNo": main.barcode,
          "merchantId": "SUN001",
          "merchantZipcode": main.s_postcode,
          "storeLocationNo": "",
          "insurance": main.insurance
        }
      );
    };
    
    return resource;
  }
]);
