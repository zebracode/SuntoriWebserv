    'use strict';

// Recipients controller
angular.module('recipients').controller('RecipientsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipients',
  function ($scope, $stateParams, $location, Authentication, Recipients) {
    $scope.authentication = Authentication;

    // Create new Recipient
    $scope.create = function () {
      // Create new Recipient object
      var recipient = new Recipients({
        name: this.name,
        tel: this.tel,
        email: this.email,
        address: this.address,
        ampher: this.ampher,
        country: this.country,
        postcode: this.postcode,
        comment: this.comment
      });

      // Redirect after save
      recipient.$save(function (response) {
        $location.path('recipients');

        // Clear form fields
        $scope.name = '';
        $scope.tel = '';
        $scope.email = '';
        $scope.address = '';
        $scope.ampher = '';
        $scope.country = '';
        $scope.postcode = '';
        $scope.comment = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Recipient
    $scope.remove = function (recipient) {
      if (recipient) {
        recipient.$remove();

        for (var i in $scope.recipients) {
          if ($scope.recipients[i] === recipient) {
            $scope.recipients.splice(i, 1);
          }
        }
      } else {
        $scope.recipient.$remove(function () {
          $location.path('recipients');
        });
      }
    };

    // Update existing Recipient
    $scope.update = function () {
      var recipient = $scope.recipient;

      recipient.$update(function () {
        $location.path('recipients');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Recipients
    $scope.find = function () {
      $scope.recipients = Recipients.query();
    };

    // Find existing Recipient
    $scope.findOne = function () {
      $scope.recipient = Recipients.get({
        recipientId: $stateParams.recipientId
      });
    };

    // Pagination
    $scope.pagedItems = [];
    $scope.itemsPerPage = 5;
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    // Country
        $scope.states = ('กรุงเทพมหานคร กระบี่ กาญจนบุรี กาฬสินธุ์ กำแพงเพชร ขอนแก่น จันทบุรี ฉะเชิงเทรา ชลบุรี ชัยนาท ชัยภูมิ ชุมพร เชียงราย เชียงใหม่ ตรัง ตราด ตาก นครนายก นครปฐม นครพนม นครราชสีมา นครศรีธรรมราช นครสวรรค์ นนทบุรี นราธิวาส น่าน บึงกาฬ บุรีรัมย์ ปทุมธานี ประจวบคีรีขันธ์ ปราจีนบุรี ปัตตานี พระนครศรีอยุธยา พังงา พัทลุง พิจิตร พิษณุโลก เพชรบุรี เพชรบูรณ์ แพร่ พะเยา ภูเก็ต มหาสารคาม มุกดาหาร แม่ฮ่องสอน ยะลา ยโสธร ร้อยเอ็ด ระนอง ระยอง ราชบุรี ลพบุรี ลำปาง ลำพูน เลย ศรีสะเกษ สกลนคร สงขลา สตูล สมุทรปราการ สมุทรสงคราม สมุทรสาคร สระแก้ว สระบุรี สิงห์บุรี สุโขทัย สุพรรณบุรี สุราษฎร์ธานี สุรินทร์ หนองคาย หนองบัวลำภู อ่างทอง อุดรธานี อุทัยธานี อุตรดิตถ์ อุบลราชธานี อำนาจเจริญ').split(' ').map(function(state) {
                return {abbrev: state};
              });

  }
]);

// PopupCreateController
angular.module('recipients').controller('PopupReController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipients','$log', '$uibModal', '$uibModalStack',

  function ($scope, $stateParams, $location, Authentication, Recipients, $log, $uibModal, $uibModalStack) {

    $scope.authentication = Authentication;

// Popup Create Send
    $scope.animationsEnabled = true;

    $scope.CreateOpen = function (size) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'modules/recipients/views/create-recipient.client.view.html',
        controller: 'PopupReController',
        size: size,
        resolve: {
          recipient: function () {
            return $scope.recipient;
          }
        }
      });

    modalInstance.result.then(function (recipient) {
          $scope.recipient = recipient;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
      };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };

    $scope.ok = function (response) {
                $uibModalStack.dismissAll($scope.create);
                setTimeout(function() {
                      // Do something after 1 seconds
                      location.reload();//reload page
                }, 1000);
            };

        $scope.cancel = function () {
            $uibModalStack.dismissAll();
          };
      }
]);

// PopupCreateController
angular.module('recipients').controller('PopupPWController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipients','$log', '$uibModal', '$uibModalStack',

  function ($scope, $stateParams, $location, Authentication, Recipients, $log, $uibModal, $uibModalStack) {

    $scope.authentication = Authentication;

// Popup Create Send
    $scope.animationsEnabled = true;

    $scope.CreateOpen = function (size) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'modules/users/views/settings/change-password.client.view.html',
        controller: 'PopupPWController',
        size: size,
        resolve: {
          recipient: function () {
            return $scope.recipient;
          }
        }
      });

    modalInstance.result.then(function (recipient) {
          $scope.recipient = recipient;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
      };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };

    $scope.ok = function (response) {
                $uibModalStack.dismissAll($scope.create);
                setTimeout(function() {
                      // Do something after 1 seconds
                      location.reload();//reload page
                }, 1000);
            };

        $scope.cancel = function () {
            $uibModalStack.dismissAll();
          };
      }
]);
