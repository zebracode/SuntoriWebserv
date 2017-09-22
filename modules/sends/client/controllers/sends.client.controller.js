'use strict';

// Sends controller
angular.module('sends').controller('SendsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sends',

  function ($scope, $stateParams, $location, Authentication, Sends) {

    $scope.authentication = Authentication;

    // Create new Send
    $scope.create = function () {
      // Create new Send object
      var send = new Sends({
        name: this.name,
        tel: this.tel,
        email: this.email,
        address: this.address,
        country: this.country,
        ampher: this.ampher,
        postcode: this.postcode,
        idNumber: this.idNumber,
        product: this.product
      });

      // Redirect after save
      send.$save(function (response) {
        $location.path('sends');

        // Clear form fields
        $scope.name = '';
        $scope.tel = '';
        $scope.email = '';
        $scope.address = '';
        $scope.country = '';
        $scope.ampher = '';
        $scope.postcode = '';
        $scope.idNumber = '';
        $scope.product = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Send
    $scope.remove = function (send) {
      if (send) {
        send.$remove();

        for (var i in $scope.sends) {
          if ($scope.sends[i] === send) {
            $scope.sends.splice(i, 1);
          }
        }
      } else {
        $scope.send.$remove(function () {
          $location.path('sends');
        });
      }
    };

    // Update existing Send
    $scope.update = function () {
      var send = $scope.send;

      send.$update(function () {
        $location.path('sends');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Sends
    $scope.find = function () {
      $scope.sends = Sends.query();
    };

    // Find existing Send
    $scope.findOne = function () {
      $scope.send = Sends.get({
        sendId: $stateParams.sendId
      });
    };

    // Country
    $scope.states = ('กรุงเทพมหานคร กระบี่ กาญจนบุรี กาฬสินธุ์ กำแพงเพชร ขอนแก่น จันทบุรี ฉะเชิงเทรา ชลบุรี ชัยนาท ชัยภูมิ ชุมพร เชียงราย เชียงใหม่ ตรัง ตราด ตาก นครนายก นครปฐม นครพนม นครราชสีมา นครศรีธรรมราช นครสวรรค์ นนทบุรี นราธิวาส น่าน บึงกาฬ บุรีรัมย์ ปทุมธานี ประจวบคีรีขันธ์ ปราจีนบุรี ปัตตานี พระนครศรีอยุธยา พังงา พัทลุง พิจิตร พิษณุโลก เพชรบุรี เพชรบูรณ์ แพร่ พะเยา ภูเก็ต มหาสารคาม มุกดาหาร แม่ฮ่องสอน ยะลา ยโสธร ร้อยเอ็ด ระนอง ระยอง ราชบุรี ลพบุรี ลำปาง ลำพูน เลย ศรีสะเกษ สกลนคร สงขลา สตูล สมุทรปราการ สมุทรสงคราม สมุทรสาคร สระแก้ว สระบุรี สิงห์บุรี สุโขทัย สุพรรณบุรี สุราษฎร์ธานี สุรินทร์ หนองคาย หนองบัวลำภู อ่างทอง อุดรธานี อุทัยธานี อุตรดิตถ์ อุบลราชธานี อำนาจเจริญ').split(' ').map(function(state) {
            return {abbrev: state};
          });

    // Product
        $scope.products = ('เสื้อผ้าแฟชั่น เครื่องสำอางและความงาม ของเล่น ของสะสม ของที่ระลึก แม่และเด็ก ศิลปหัตถกรรม(ของทำมือ) ของใช้ ของตกแต่งบ้าน อาหารและสุขภาพ มือถือ คอมพิวเตอร์ เครื่องดนตรี อุปกรณ์สัตว์เลี้ยง หนังสือเครื่องเขียน อุปกรณ์สำนักงาน เครื่องมือช่าง ของเก่า กล้องและอุปกรณ์ อุปกรณ์กีฬา อื่นๆ').split(' ').map(function(product) {
                return {abbrev: product};
              });
  }
]);

// PopupCreateController
angular.module('sends').controller('PopupController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sends','$log', '$uibModal', '$uibModalStack',

  function ($scope, $stateParams, $location, Authentication, Sends, $log, $uibModal, $uibModalStack) {

    $scope.authentication = Authentication;

    $scope.animationsEnabled = true;

    $scope.CreateOpen = function (size) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'modules/sends/views/create-send.client.view.html',
        controller: 'PopupController',
        size: size,
        resolve: {
          send: function () {
            return $scope.send;
          }
        }
      });

    modalInstance.result.then(function (send) {
          $scope.send = send;
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

// PopupEditController
angular.module('sends').controller('PopupEditController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sends','$log', '$uibModal', '$uibModalStack', 'Socket',

  function ($scope, $stateParams, $location, Authentication, Sends, $log, $uibModal, $uibModalStack, Socket) {

    $scope.authentication = Authentication;

    // Find a list of Sends
    $scope.findOne = function () {
        Messages.query({
            username: $routeParams.username
        }).$promise.then(function (response) {
            $scope.messages = response;
        });

    };

// Popup Create Send
    $scope.animationsEnabled = true;

    $scope.EditOpen = function (size, selectedSend) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'modules/sends/views/edit-send.client.view.html',
        controller: function ($scope, $uibModalInstance, send) {
            $scope.send = send;
        },
        size: size,
        resolve: {
                send: function () {
                  return selectedSend;
                }
              }
            });

    modalInstance.result.then(function (send) {
          $scope.selected = selectedSend;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
      };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };

    $scope.ok = function (response) {
                $uibModalStack.dismissAll('closing');
                setTimeout(function() {
                      // Do something after 1 seconds
                      location.reload();//reload page
                }, 1000);
            };

        $scope.cancel = function () {
            $uibModalStack.dismissAll('closing');
          };
      }
]);


