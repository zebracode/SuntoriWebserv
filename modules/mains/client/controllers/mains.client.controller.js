'use strict';

// Mains controller
angular.module('mains').controller('MainsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mains', '$http',
  function ($scope, $stateParams, $location, Authentication, Mains, $http) {
    $scope.authentication = Authentication;
    $scope.totalPrice = 0;
    $scope.balanceAmount =  250;
    // Create new Main
    $scope.create = function () {
      // Create new Main object
      var main = new Mains({
        s_name: this.s_name,
        s_tel: this.s_tel,
        s_address: this.s_address,
        s_country: this.s_country,
        s_postcode: this.s_postcode,
        r_name: this.r_name,
        r_tel: this.r_tel,
        r_address: this.r_address,
        r_country: this.r_country,
        r_postcode: this.r_postcode,
        order: this.order,
        invoice: this.invoice,
        price: this.price,
        weight: this.weight,
        detail: this.detail,
        barcode: this.barcode,
        s_idNumber: this.s_idNumber
      });

      // Redirect after save
      main.$save(function (response) {
        $location.path('mains/create');

        // Clear form fields
//        $scope.s_name = '';
//        $scope.s_tel = '';
//        $scope.s_address = '';
//        $scope.s_country = '';
//        $scope.s_postcode = '';
        $scope.r_name = '';
        $scope.r_tel = '';
        $scope.r_address = '';
        $scope.r_country = '';
        $scope.r_postcode = '';
        $scope.order = '';
        $scope.invoice = '';
        $scope.price = '';
        $scope.weight = '';
        $scope.detail = '';
        $scope.barcode = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Main
    $scope.remove = function (main) {
      if (main) {
        main.$remove();

        for (var i in $scope.mains) {
          if ($scope.mains[i] === main) {
            $scope.mains.splice(i, 1);
          }
        }
      } else {
        $scope.main.$remove(function () {
          $location.path('mains');
        });
      }
    };

    // Update existing Main
    $scope.update = function () {
      var main = $scope.main;

      main.$update(function () {
        $location.path('mains');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Mains
    $scope.find = function () {
      $scope.mains = Mains.query();
    };

    // Find existing Main
    $scope.findOne = function () {
      $scope.main = Mains.get({
        mainId: $stateParams.mainId
      });
    };

    $scope.options = [
        {
          name: 'เลือกกล่อง/น้ำหนัก',
          value: '0',
          price: '0'
        },
        {
         name: 'น้ำหนัก 0 - 1 กก.',
          value: '500-1,000',
          price: '60'
        },
        {
          name: '- กล่อง เบอร์ 0',
          value: '500-1,000',
          price: '60'
        },
        {
          name: '- กล่อง เบอร์ AA',
          value: '500-1,000',
          price: '100',
          price: '60'
        },
        {
          name: '- กล่อง เบอร์ AA+4',
          value: '500-1,000',
          price: '60'
        },
        {
          name: '- กล่อง เบอร์ A (ก)',
          value: '500-1,000',
          price: '60'
        },
        {
          name: 'น้ำหนัก 1 - 3 กก.',
          value: '1,000-3,000',
          price: '80'
        },
        {
          name: '- กล่อง เบอร์ CD',
          value: '1,000-3,000',
          price: '80'
        },
        {
          name: '- กล่อง เบอร์ 2A',
          value: '1,000-3,000',
          price: '80'
        },
        {
          name: '- กล่อง เบอร์ B (ข)',
          value: '1,000-3,000',
          price: '80'
        },
        {
          name: '- กล่อง เบอร์ BH',
          value: '1,000-3,000',
          price: '80'
        },
        {
          name: '- กล่อง เบอร์ 2B',
          value: '1,000-3,000',
          price: '80'
        },
        {
          name: 'น้ำหนัก 3 - 5 กก.',
          value: '3,000-5,000',
          price: '90'
        },
        {
          name: '- กล่อง เบอร์ C (ค)',
          value: '3,000-5,000',
          price: '90'
        },
        {
          name: '- กล่อง เบอร์ C+8',
          value: '3,000-5,000',
          price: '90'
        },
        {
          name: '- กล่อง เบอร์ D (ง)',
          value: '3,000-5,000',
          price: '90'

        },
        {
          name: 'น้ำหนัก 3 - 5 กก.',
          value: '5,000-10,000',
          price: '130'
        },
        {
          name: '- กล่อง เบอร์ F (สั้น)',
          value: '5,000-10,000',
          price: '130'
        },
        {
          name: '- กล่อง เบอร์ E (จ)',
          value: '5,000-10,000',
          price: '130'
        },
        {
          name: '- กล่อง เบอร์ F (ฉ)',
          value: '5,000-10,000',
          price: '130'

        },
        {
          name: 'น้ำหนัก 10 - 15 กก.',
          value: '10,000-15,000',
          price: '220'
        },
        {
          name: '- กล่อง เบอร์ G (ยาว)',
          value: '10,000-15,000',
          price: '220'
        },
        {
          name: 'น้ำหนัก 15 - 20 กก.',
          value: '15,000-20,000',
          price: '260'
        },
        {
          name: '- 50*50*50 cm',
          value: '15,000-20,000',
          price: '260'
        }
      ];

      $scope.selectedOption = $scope.options[0];
      $scope.reset = function() {
          $scope.options = {เลือกขนาดกล่อง};
      }
      
      $scope.getSenderName = function(searchText) {
          return $http
            .get('/api/send/findByName?searchText=' + searchText)
            .then(function(response) {
              return response.data;
            });
      };
      
      $scope.setSenderData = function() {
        if ($scope.selectedSender) {
            $scope.s_name = $scope.selectedSender.name;
            $scope.s_tel = $scope.selectedSender.tel;
            $scope.s_address = $scope.selectedSender.address;
            $scope.s_country = $scope.selectedSender.country;
            $scope.s_postcode = $scope.selectedSender.postcode;
        }
      };
      
      $scope.getRecipients = function(search) {
          return $http
            .get('/api/recipient/findByName?searchText=' + search)
            .then(function(response) {
              return response.data;
            });
      };
      
      $scope.setRecipientData = function() {
        if ($scope.selectedRecipient) {
            $scope.r_name = $scope.selectedRecipient.name;
            $scope.r_tel = $scope.selectedRecipient.tel;
            $scope.r_address = $scope.selectedRecipient.address;
            $scope.r_country = $scope.selectedRecipient.country;
            $scope.r_postcode = $scope.selectedRecipient.postcode;
        }
      };
      
      //Calculate Total Price
      $scope.calTotalPrice = function(){
        return 600;
      };
      
      $scope.addPrice = function(price){
          $scope.totalPrice = Number($scope.totalPrice) | 0;
          $scope.totalPrice = $scope.totalPrice + Number(price);
      };
      
       $scope.minusPrice = function(price){
          $scope.totalPrice = Number($scope.totalPrice) | 0;
          $scope.totalPrice = $scope.totalPrice - Number(price);
      };
  }
]);

