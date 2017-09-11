'use strict';

// Mains controller
angular.module('mains').controller('MainsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mains', '$http', '$mdDialog','ThailandPost', 
  function ($scope, $stateParams, $location, Authentication, Mains, $http, $mdDialog, ThailandPost) {
    $scope.authentication = Authentication;
    $scope.totalPrice = 0;
    $scope.balanceAmount =  1000;
    $scope.thailandPost = new ThailandPost();
    $scope.selectedMains = [];
    // Create new Main
    $scope.create = function () {
            
      // Create new Main object
      var main = new Mains({
        s_name: this.s_name,
        s_tel: this.s_tel,
        s_address: this.s_address,
        s_ampher: this.s_ampher,
        s_country: this.s_country,
        s_postcode: this.s_postcode,
        r_name: this.r_name,
        r_tel: this.r_tel,
        r_address: this.r_address,
        r_ampher: this.r_ampher,
        r_country: this.r_country,
        r_postcode: this.r_postcode,
        order: this.order,
        invoice: this.invoice,
        price: this.price,
        weight: this.weight,
        detail: this.detail,
        barcode: this.barcode,
        s_idNumber: this.s_idNumber,
        total: this.selectedOption.price,
        status: "ยังไม่ได้ชำระเงิน"
      });

      // Redirect after save
      main.$save(function (response) {
        $location.path('mains/create');

        // Clear form fields
//        $scope.s_name = '';
//        $scope.s_tel = '';
//        $scope.s_address = '';
//        $scope.s_ampher = '';
//        $scope.s_country = '';
//        $scope.s_postcode = '';
        $scope.r_name = '';
        $scope.r_tel = '';
        $scope.r_address = '';
        $scope.r_country = '';
        $scope.r_ampher = '';
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
      $scope.mains = Mains.getMain({user: Authentication.user, status: 'ยังไม่ได้ชำระเงิน'}, function(result){
        var firstTotalPrice = 0;
        for (var i=0; i<result.length; i++){
            firstTotalPrice += parseInt(result[i].total);
            $scope.selectedMains.push(result[i]);
        }
      $scope.totalPrice = firstTotalPrice;
      setDisbled($scope.balanceAmount - $scope.totalPrice);
      });
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
          name: 'น้ำหนักไม่เกิน 0.5 กก.',
          value: '500',
          price: '40'
        },
        {
         name: 'น้ำหนัก 0.5 - 1 กก.',
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
            $scope.s_ampher = $scope.selectedSender.ampher;
            $scope.s_country = $scope.selectedSender.country;
            $scope.s_postcode = $scope.selectedSender.postcode;
            $scope.s_idNumber = $scope.selectedSender.idNumber;
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
            $scope.r_ampher = $scope.selectedRecipient.ampher;
            $scope.r_country = $scope.selectedRecipient.country;
            $scope.r_postcode = $scope.selectedRecipient.postcode;
        }
      };
      
      $scope.addPrice = function(total){
          $scope.firstTotalPrice = 0;
          $scope.totalPrice = Number($scope.totalPrice) | 0;
          $scope.totalPrice = $scope.totalPrice + Number(total);
          setDisbled($scope.balanceAmount - $scope.totalPrice);
      };
      
      $scope.minusPrice = function(total){
          $scope.totalPrice = Number($scope.totalPrice) | 0;
          $scope.totalPrice = $scope.totalPrice - Number(total);
          setDisbled($scope.balanceAmount - $scope.totalPrice);
      };
        
    function setBarcode(selectedMain, inc) {
        var prefix = "EY";
        var suffix = "TH";
        var number = "";
        var weight = "";
        var barcode = "";
        var checkDigit = "";

        $http.get("/lastNumber").then(function (response) {
            console.log("getLastNumber: ", response.data);
            number = parseInt(response.data.number) + inc + "";
            weight = response.data.weight;
            checkDigit = getCheckDigit(number, weight);
            barcode = prefix + number + checkDigit + suffix;  
            
            var req = {
                    method: 'POST',
                    url: '/api/update/barcode',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    data: {
                        invoice : selectedMain.invoice,
                        barcode : barcode,
                        status : "ชำระเงินแล้ว"
                    }
                };
            
            $http(req).then(function (response) {
                console.log("updateBarcode: ", response);
                createOrder(selectedMain, barcode);
            });
        });

        function getCheckDigit(number, weight) {

            var sum = 0;
            var mod = 0;
            var checkDigit = "";
            for(var i=0; i<number.length; i++) {
                sum += parseInt(number.charAt(i)) * parseInt(weight.charAt(i));
            }

            mod = sum % 11;

            if(mod === 0){
                checkDigit = "5";
            } else if (mod === 1) {
                checkDigit = "0";    
            } else {
                checkDigit = (11 - mod) + "";
            }

            return checkDigit;
        }
    };
    
    $scope.selectedInvoices = [];
    $scope.addSelectInvoice = function (invoiceNo) {
        $scope.selectedInvoices.push(invoiceNo);
        //console.log("invoices: ", $scope.selectedInvoices);
    };

    $scope.removeSelectInvoice = function (invoiceNo) {
        for (var i=0; i < $scope.selectedInvoices.length; i++) {
            if ($scope.selectedInvoices[i] === invoiceNo) {
                $scope.selectedInvoices.splice(i, 1);
                break;
            }
        }
        
        //console.log("invoices: ", $scope.selectedInvoices);
    };
      
    
    function setDisbled(amount) {
      $scope.disabled = false;
      if (amount < 0) {
        $scope.disabled = true;
      }
    }
    
    $scope.addSelectMain = function(main){
      $scope.selectedMains.push(main);
      console.log("add main: ", $scope.selectedMains);
    };
    
    $scope.removeSelectMain = function(main){
      for (var i = 0; i < $scope.selectedMains.length; i++) {
        if ($scope.selectedMains[i].invoice === main.invoice) {
          $scope.selectedMains.splice(i, 1);
          break;
        }
      }
      console.log("remove main: ", $scope.selectedMains);
      
    };
    
    function createOrder(selectedMain, barcode){
        ThailandPost.createOrder(selectedMain, barcode);
    };
    
    $scope.retrieveMain = function(){
      var result = Mains.retrieveMain(Authentication.user);
      console.log("Result: ", result);
    };
    
    $scope.setBalanceAmt = function(){
        $http.get("/api/balance?userId=" + $scope.authentication.user._id)
            .then(function(res) {
               if (res.data !== null) {
                   $scope.balanceAmount = res.data.balanceAmt;
            }
        });
    };
    
    $scope.updateBalance = function (balanceAmt) {
        var data = { userId: $scope.authentication.user._id, balanceAmt: balanceAmt};
        $scope.balanceAmount = balanceAmt;
        $http.put('/api/balance',data).then(function(){
        });      
    };
    
    /************************** Dialog Zone ****************************/
    $scope.showConfirm = function (ev, selectedMains) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('ยืนยันการชำระเงิน')
        .textContent('กรุณายืนยันการชำระเงิน')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('ยืนยัน')
        .cancel('ยกเลิก');

      $mdDialog.show(confirm).then(function () {
        $scope.status = 'Confirm';
        
        //update balance amount
        $scope.updateBalance(parseInt($scope.balanceAmount) - parseInt($scope.totalPrice));
        
        selectedMains.sort();
        for(var i=0; i<selectedMains.length; i++){
            setBarcode(selectedMains[i], i);
        }
        
        
        var inc = selectedMains.length;
        
        $http.get("/lastNumber").then(function (response) {
          var req = {
            method: 'PUT',
            url: '/lastNumber',
            headers: {
                'Content-Type' : 'application/json'
            },
            data: {
                number : parseInt(response.data.number) + inc + ""
            }
          };

          $http(req).then(function (response) {
            $scope.find();   
          });
        });        
      }, function () {
        $scope.status = 'Cancel';
      });
    };
    
    $scope.showTopUpPromt = function(event) {
    // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
          .title('เติมเงิน')
          .textContent('ระบุจำนวนเงินที่ต้องการเติม')
          .placeholder('จำนวนเงิน')
          .ariaLabel('')
          .initialValue('')
          .targetEvent(event)
          .ok('ตกลง')
          .cancel('ยกเลิก');

          $mdDialog.show(confirm).then(function(result) {
            $scope.setPaymentForm(result);
            $scope.showConfirmTopUp(event, result);
            //$scope.payment();
            $scope.status = 'You decided to name your dog ' + result + '.';
          }, function() {
            $scope.status = 'You didn\'t name your dog.';
          });
    };    
    
    $scope.showConfirmTopUp = function(event, amount) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('ยืนยันการเติมเงิน')
              .textContent('ยอดเติมเงิน ' + amount)
              .ariaLabel('Lucky day')
              .targetEvent(event)
              .ok('ตกลง')
              .cancel('ยกเลิก');

        $mdDialog.show(confirm).then(function() {
          $scope.payment();
          }, function() {
            $scope.status = 'You decided to keep your debt.';
        });
    };
    
    // Set 2P2C request parameter
    $scope.setPaymentForm = function(amount){
        var formatedAmount = formatAmount(amount, 10);
        console.log("$scope.authentication", $scope.authentication);
        var topUpUser = $scope.authentication.user.firstName + ' ' + $scope.authentication.user.lastName;
        var data = {
          amount: formatedAmount,
          paymentDescription: 'Top-up by ' + topUpUser
        };

        $http.post("/payment", data)
        .then(function(response) {
            $scope.version = response.data.version;
            $scope.merchant_id = response.data.merchantId;
            $scope.payment_description = response.data.paymentDescription;
            $scope.order_id = response.data.orderId;
            $scope.invoice_no = response.data.invoiceNo;
            $scope.amount = response.data.amount;
            $scope.result_url_1 = response.data.resultUrl1;
            $scope.result_url_2 = response.data.resultUrl2;
            $scope.default_lang = response.data.defaultLang;
            $scope.hash_value = response.data.hashValue;
            console.log("version", $scope.version);
            console.log("merchant_id", $scope.merchant_id);
            console.log("order_id", $scope.order_id);
            console.log("amount", $scope.amount);
            console.log("hash_value", $scope.hash_value);
        });

        function formatAmount(amount, length) {
          var str = '' + amount;
          while (str.length < length) {
            str = '0' + str;
          }

          return str + '00';
        }
    };
    
    $scope.payment = function(){
        document.authForm.submit();        
    };


  }
]);


