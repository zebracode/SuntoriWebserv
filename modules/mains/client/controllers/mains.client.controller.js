'use strict';

// Mains controller
angular.module('mains').controller('MainsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mains', '$http',
	'$mdDialog', 'ThailandPost', "$filter", 'Recipients', '$mdSidenav', 'WarrantyPrice',
	'StatementsService', 'UserPricesService', 'Upload', '$window',
	function ($scope, $stateParams, $location, Authentication, Mains, $http, $mdDialog, ThailandPost, $filter, Recipients, $mdSidenav,
		WarrantyPrice, StatementsService, UserPricesService, Upload, $window) {

		// Default
		$scope.codAmount = 0;
		$scope.insuranceAmount = 0;
		$scope.grandTotal = 0;
		$scope.isManualEms = false;
		$scope.shippingPrice = 0;
		var userPrices = [];
		var perimeter = ['กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ'];


		$scope.authentication = Authentication;
		$scope.totalPrice = 0;
		$scope.thailandPost = new ThailandPost();
		$scope.selectedMains = [];
		$scope.price = 0;
		$scope.order = Date.now();
		$scope.invoice = Date.now();

		$scope.toggleLeft = buildToggler('left');
		$scope.toggleRight = buildToggler('right');

		// Start get user prices
		if (Authentication.user._id) {
			UserPricesService.get({
				userId: Authentication.user._id
			}, function (userPrice) {
				userPrices.push({ weight: 500, bkPrice: userPrice.bkPrice1, ctPrice: userPrice.ctPrice1 });
				userPrices.push({ weight: 1000, bkPrice: userPrice.bkPrice2, ctPrice: userPrice.ctPrice2 });
				userPrices.push({ weight: 3000, bkPrice: userPrice.bkPrice3, ctPrice: userPrice.ctPrice3 });
				userPrices.push({ weight: 5000, bkPrice: userPrice.bkPrice4, ctPrice: userPrice.ctPrice4 });
				userPrices.push({ weight: 10000, bkPrice: userPrice.bkPrice5, ctPrice: userPrice.ctPrice5 });
				userPrices.push({ weight: 15000, bkPrice: userPrice.bkPrice6, ctPrice: userPrice.ctPrice6 });
				userPrices.push({ weight: 20000, bkPrice: userPrice.bkPrice7, ctPrice: userPrice.ctPrice7 });
			});
		}
		// Eng get user prices

		function buildToggler(componentId) {
			return function () {
				$mdSidenav(componentId).toggle();
			};
		}

		// Create new Main
		$scope.create = function () {

			// Recipient Data
			var recipientData = {
				name: $scope.r_name,
				postcode: $scope.r_postcode,
				country: $scope.r_country,
				ampher: $scope.r_ampher,
				address: $scope.r_address,
				email: $scope.r_email,
				tel: $scope.r_tel
			};

			// Recipients
			Recipients.query(function (response) {
				var recipient;
				for (var i = 0; i < response.length; i++) {
					if (response[i].user) {
						if (Authentication.user._id === response[i].user._id && $scope.r_name === response[i].name) {
							recipient = response[i];
						}
					}
				}

				// Update Recipients
				if (recipient) {
					$scope.recipient = Recipients.get({
						recipientId: recipient._id
					}, function () {
						$scope.recipient._id = recipient._id;
						$scope.recipient.postcode = recipientData.postcode;
						$scope.recipient.country = recipientData.country;
						$scope.recipient.ampher = recipientData.ampher;
						$scope.recipient.address = recipientData.address;
						$scope.recipient.email = recipientData.email;
						$scope.recipient.tel = recipientData.tel;
						$scope.recipient.$update();
					});

					// Add Recipients
				} else {
					if ($scope.r_name) {
						var newRecipient = new Recipients(recipientData);
						newRecipient.$save();
					}
				}
			});

			var total = $filter("provincePrice")(this.selectedOption.price, this.s_country, this.r_country, this.selectedOption.weight);
			// Create new Main object
			var main = new Mains({
				s_name: this.s_name,
				s_tel: this.s_tel,
				s_email: this.s_email,
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
				weight: this.selectedOption.value,
				detail: this.detail,
				detail_Product: this.detail_Product,
				insurance: this.cbWarranty ? "Y" : "N",
				barcode: this.barcode,
				s_idNumber: this.s_idNumber,
				total: total,
				status: "ยังไม่ได้ชำระเงิน",
				isCod: this.cbCod,
				codAmnt: this.codAmount,
				insuranceAmnt: this.insuranceAmount,
				codVatAmnt: this.codAmount * 0.07,
				insuranceVatAmnt: this.insuranceAmount * 0.07,
				totalVatAmnt: (this.codAmount * 0.07) + (this.insuranceAmount * 0.07),
				grandTotalAmnt: this.grandTotal
			});

			// Redirect after save
			main.$save(function (response) {
				$location.path('mains/create');
				$scope.r_name = '';
				$scope.r_tel = '';
				$scope.r_email = '';
				$scope.r_address = '';
				$scope.r_country = '';
				$scope.r_ampher = '';
				$scope.r_postcode = '';
				$scope.r_comment = '';
				$scope.order = Date.now();
				$scope.invoice = Date.now();
				$scope.price = 0;
				$scope.detail_Product = '';
				$scope.insurance = '';
				$scope.weight = '';
				$scope.barcode = '';
				$scope.cbCod = false;
				$scope.cbWarranty = false;
				$scope.codAmount = 0;
				$scope.insuranceAmount = 0;
				$scope.selectedOption.price = 0;
				$scope.grandTotal = 0;
				$scope.showAlert();
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.showAlert();
			});

			//Update Receiptent Address

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
			//$scope.mains = Mains.getMain({user: Authentication.user, status: 'ยังไม่ได้ชำระเงิน'}, function(result){
			$scope.mains = Mains.query({ user: Authentication.user._id }, function (result) {
				var firstTotalPrice = 0;
				$scope.selectedMains = [];
				for (var i = 0; i < result.length; i++) {
					if (result[i].user === null) {
						continue;
					}
					if (Authentication.user._id === result[i].user._id && result[i].status === 'ยังไม่ได้ชำระเงิน') {
						firstTotalPrice += Number(result[i].grandTotalAmnt);
						$scope.selectedMains.push(result[i]);
					}
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

		//Pagination
		$scope.totalItems = 10;
		$scope.currentPage = 1;

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.pageChanged = function () {
			$log.log('Page changed to: ' + $scope.currentPage);
		};

		$scope.maxSize = 10;
		$scope.bigTotalItems = 175;
		$scope.bigCurrentPage = 1;

		// Country
		$scope.states = ('กรุงเทพมหานคร กระบี่ กาญจนบุรี กาฬสินธุ์ กำแพงเพชร ขอนแก่น จันทบุรี ฉะเชิงเทรา ชลบุรี ชัยนาท ชัยภูมิ ชุมพร เชียงราย เชียงใหม่ ตรัง ตราด ตาก นครนายก นครปฐม นครพนม นครราชสีมา นครศรีธรรมราช นครสวรรค์ นนทบุรี นราธิวาส น่าน บึงกาฬ บุรีรัมย์ ปทุมธานี ประจวบคีรีขันธ์ ปราจีนบุรี ปัตตานี พระนครศรีอยุธยา พังงา พัทลุง พิจิตร พิษณุโลก เพชรบุรี เพชรบูรณ์ แพร่ พะเยา ภูเก็ต มหาสารคาม มุกดาหาร แม่ฮ่องสอน ยะลา ยโสธร ร้อยเอ็ด ระนอง ระยอง ราชบุรี ลพบุรี ลำปาง ลำพูน เลย ศรีสะเกษ สกลนคร สงขลา สตูล สมุทรปราการ สมุทรสงคราม สมุทรสาคร สระแก้ว สระบุรี สิงห์บุรี สุโขทัย สุพรรณบุรี สุราษฎร์ธานี สุรินทร์ หนองคาย หนองบัวลำภู อ่างทอง อุดรธานี อุทัยธานี อุตรดิตถ์ อุบลราชธานี อำนาจเจริญ').split(' ').map(function (state) {
			return { abbrev: state };
		});

		$scope.options = [
			{
				name: '--น้ำหนัก/ขนาด--',
				value: '',
				price: '0'
			},
			{
				name: 'น้ำหนักไม่เกิน 0.5 กก.',
				value: '500',
				price: '40',
				weight: 500
			},
			{
				name: '- กล่อง เบอร์ 0',
				value: '0-500',
				price: '40',
				weight: 500
			},
			{
				name: '- กล่อง เบอร์ AA',
				value: '0-500',
				price: '40',
				weight: 500
			},
			{
				name: 'น้ำหนัก 0.5 - 1 กก.',
				value: '500-1,000',
				price: '60',
				weight: 1000
			},
			{
				name: '- กล่อง เบอร์ AA+4',
				value: '500-1,000',
				price: '60',
				weight: 1000
			},
			{
				name: '- กล่อง เบอร์ A (ก)',
				value: '500-1,000',
				price: '60',
				weight: 1000
			},
			{
				name: 'น้ำหนัก 1 - 3 กก.',
				value: '1,000-3,000',
				price: '80',
				weight: 3000
			},
			{
				name: '- กล่อง เบอร์ CD',
				value: '1,000-3,000',
				price: '80',
				weight: 3000
			},
			{
				name: '- กล่อง เบอร์ 2A',
				value: '1,000-3,000',
				price: '80',
				weight: 3000
			},
			{
				name: '- กล่อง เบอร์ B (ข)',
				value: '1,000-3,000',
				price: '80',
				weight: 3000
			},
			{
				name: '- กล่อง เบอร์ BH',
				value: '1,000-3,000',
				price: '80',
				weight: 3000
			},
			{
				name: '- กล่อง เบอร์ 2B',
				value: '1,000-3,000',
				price: '80',
				weight: 3000
			},
			{
				name: 'น้ำหนัก 3 - 5 กก.',
				value: '3,000-5,000',
				price: '90',
				weight: 5000
			},
			{
				name: '- กล่อง เบอร์ C (ค)',
				value: '3,000-5,000',
				price: '90',
				weight: 5000
			},
			{
				name: '- กล่อง เบอร์ C+8',
				value: '3,000-5,000',
				price: '90',
				weight: 5000
			},
			{
				name: '- กล่อง เบอร์ D (ง)',
				value: '3,000-5,000',
				price: '90',
				weight: 5000
			},
			{
				name: 'น้ำหนัก 5 - 10 กก.',
				value: '5,000-10,000',
				price: '130',
				weight: 10000
			},
			{
				name: '- กล่อง เบอร์ F (สั้น)',
				value: '5,000-10,000',
				price: '130',
				weight: 10000
			},
			{
				name: '- กล่อง เบอร์ E (จ)',
				value: '5,000-10,000',
				price: '130',
				weight: 10000
			},
			{
				name: '- กล่อง เบอร์ F (ฉ)',
				value: '5,000-10,000',
				price: '130',
				weight: 10000

			},
			{
				name: 'น้ำหนัก 10 - 15 กก.',
				value: '10,000-15,000',
				price: '220',
				weight: 15000
			},
			{
				name: '- กล่อง เบอร์ G (ยาว)',
				value: '10,000-15,000',
				price: '220',
				weight: 15000
			},
			{
				name: 'น้ำหนัก 15 - 20 กก.',
				value: '15,000-20,000',
				price: '260',
				weight: 20000
			},
			{
				name: '- 50*50*50 cm',
				value: '15,000-20,000',
				price: '260',
				weight: 20000
			}
		];

		$scope.insurances = [
			{
				name: '--มูลค่าสินค้า--',
				value: '0',
				charge: '0'
			},
			{
				name: '2,001 - 5,000 บาท',
				value: '5000',
				charge: '10'
			},
			{
				name: '5,001 - 10,000 บาท',
				value: '10000',
				charge: '20'
			},
			{
				name: '10,001 - 15,000 บาท',
				value: '15000',
				charge: '30'
			},
			{
				name: '15,001 - 20,000 บาท',
				value: '20000',
				charge: '40'
			},
			{
				name: '20,001 - 25,000 บาท',
				value: '25000',
				charge: '50'
			},
			{
				name: '25,001 - 30,000 บาท',
				value: '30000',
				charge: '60'
			},
			{
				name: '30,000 - 35,000 บาท',
				value: '35000',
				charge: '70'
			},
			{
				name: '35,001 - 40,000 บาท',
				value: '40000',
				charge: '80'
			},
			{
				name: '40,001 - 45,000 บาท',
				value: '45000',
				charge: '90'
			},
			{
				name: '45,001 - 50,000 บาท',
				value: '50000',
				charge: '100'
			}
		];

		$scope.selectedInsurance = $scope.insurances[0];
		$scope.selectedOption = $scope.options[0];
		$scope.reset = function () {
			$scope.options = { เลือกกล่องน้ำหนัก }
			$scope.insurances = { มูลค่าสินค้า }
		};


		// Autocomplete
		$scope.getSenderName = function (searchText) {
			return $http
				.get('/api/send/findByName?searchText=' + searchText + '&userId=' + $scope.authentication.user._id)
				.then(function (response) {
					return response.data;
				});
		};

		$scope.setSenderData = function () {
			if ($scope.selectedSender) {
				$scope.s_name = $scope.selectedSender.name;
				$scope.s_tel = $scope.selectedSender.tel;
				$scope.s_email = $scope.selectedSender.email;
				$scope.s_address = $scope.selectedSender.address;
				$scope.s_ampher = $scope.selectedSender.ampher;
				$scope.s_country = $scope.selectedSender.country;
				$scope.s_postcode = $scope.selectedSender.postcode;
				$scope.s_idNumber = $scope.selectedSender.idNumber;
				$scope.detail = $scope.selectedSender.product;
			}
		};

		// Autocomplete Recipients
		$scope.getRecipients = function (search) {
			return $http
				.get('/api/recipient/findByName?searchText=' + search + '&userId=' + $scope.authentication.user._id)
				.then(function (response) {
					return response.data;
				});
		};

		$scope.setRecipientData = function () {
			if ($scope.selectedRecipient) {
				$scope.r_name = $scope.selectedRecipient.name;
				$scope.r_tel = $scope.selectedRecipient.tel;
				$scope.r_email = $scope.selectedRecipient.email;
				$scope.r_address = $scope.selectedRecipient.address;
				$scope.r_ampher = $scope.selectedRecipient.ampher;
				$scope.r_country = $scope.selectedRecipient.country;
				$scope.r_postcode = $scope.selectedRecipient.postcode;
				$scope.r_comment = $scope.selectedRecipient.comment;
			}
		};

		$scope.addPrice = function (total) {
			$scope.firstTotalPrice = 0;
			$scope.totalPrice = Number($scope.totalPrice) | 0;
			$scope.totalPrice = $scope.totalPrice + Number(total);
			setDisbled($scope.balanceAmount - $scope.totalPrice);
		};

		$scope.minusPrice = function (total) {
			$scope.totalPrice = Number($scope.totalPrice) | 0;
			$scope.totalPrice = $scope.totalPrice - Number(total);
			setDisbled($scope.balanceAmount - $scope.totalPrice);
		};

		function setBarcode(selectedMain, rcpDocNo, inc, currentnumber, weight) {
			var barcode = "";
			var prefix = "EY";
			var suffix = "TH";
			var number = "";
			var checkDigit = "";
			var now = Date.now();

			if (selectedMain.barcode) {
				barcode = selectedMain.barcode;
			} else {
				number = Number(currentnumber) + inc + "";
				checkDigit = getCheckDigit(number, weight);
				barcode = prefix + number + checkDigit + suffix;
			}

			var req = {
				method: 'POST',
				url: '/api/update/barcode',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					invoice: selectedMain.invoice,
					barcode: barcode,
					status: "กำลังดำเนินการ",
					rcpDocNo: rcpDocNo,
					receiptDate: now
				}
			};

			$http(req).then(function (response) {
				$scope.find();
				createOrder(selectedMain, barcode);
			});

			function getCheckDigit(number, weight) {
				var sum = 0;
				var mod = 0;
				var checkDigit = "";
				for (var i = 0; i < number.length; i++) {
					sum += Number(number.charAt(i)) * Number(weight.charAt(i));
				}

				mod = sum % 11;

				if (mod === 0) {
					checkDigit = "5";
				} else if (mod === 1) {
					checkDigit = "0";
				} else {
					checkDigit = (11 - mod) + "";
				}
				return checkDigit;
			}
			// Shipping Amount
			saveStatement($scope.authentication.user, Number(selectedMain.total) * (-1), "ค่าส่งสินค้า " + barcode, barcode + '_1');
			
			// COD Amount
			if(selectedMain.codAmnt >= 0) {
				saveStatement($scope.authentication.user, Number(selectedMain.codAmnt) * (-1), "ค่า COD " + barcode, barcode + '_2');
			}

			// Insurance Amount
			if(selectedMain.insuranceAmnt >= 0) {
				saveStatement($scope.authentication.user, Number(selectedMain.insuranceAmnt) * (-1), "ค่าประกัน " + barcode, barcode + '_3');
			}

			// VAT Amount
			if(selectedMain.totalVatAmnt >= 0) {
				saveStatement($scope.authentication.user, Number(selectedMain.totalVatAmnt) * (-1), "ค่าภาษีมูลค่าเพิ่ม " + barcode, barcode + '_4');
			}

		};

		$scope.selectedInvoices = [];

		$scope.addSelectInvoice = function (invoiceNo) {
			$scope.selectedInvoices.push(invoiceNo);
			//console.log("invoices: ", $scope.selectedInvoices);
		};
		$scope.removeSelectInvoice = function (invoiceNo) {
			for (var i = 0; i < $scope.selectedInvoices.length; i++) {
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

		$scope.addSelectMain = function (main) {
			$scope.selectedMains.push(main);
			console.log("add main: ", $scope.selectedMains);
		};

		$scope.removeSelectMain = function (main) {
			for (var i = 0; i < $scope.selectedMains.length; i++) {
				if ($scope.selectedMains[i].invoice === main.invoice) {
					$scope.selectedMains.splice(i, 1);
					break;
				}
			}
			console.log("remove main: ", $scope.selectedMains);

		};

		function createOrder(selectedMain, barcode) {
			ThailandPost.createOrder(selectedMain, barcode);
		};

		$scope.retrieveMain = function () {
			var result = Mains.retrieveMain(Authentication.user);
			console.log("Result: ", result);
		};

		$scope.setBalanceAmt = function () {
			$http.get("/api/balance?userId=" + $scope.authentication.user._id)
				.then(function (res) {
					if (res.data !== null) {
						$scope.balanceAmount = res.data.balanceAmt;
					} else {
						$scope.balanceAmount = '0';
					}
				});
		};

		$scope.updateBalance = function (balanceAmt) {
			var data = { userId: $scope.authentication.user._id, balanceAmt: balanceAmt };
			$scope.balanceAmount = balanceAmt;
			$http.put('/api/balance', data).then(function () {
			});
		};

		$scope.showAddlist = function (ev, selectedMains) {
			// Appending dialog to document.body to cover sidenav in docs app
			var confirm = $mdDialog.confirm()
				.title('เพิ่มข้อมูลสำเร็จ')
				.textContent('กลับไปสู่หน้าเพิ่มรายการ')
				.ariaLabel('Lucky day')
				.targetEvent(ev)
				.ok('ยืนยัน')
				.cancel('ตกลง');

			$mdDialog.show(confirm).then(function () {
				$scope.status = 'Confirm';
			});
		};

		$scope.showAlert = function (ev) {
			// Appending dialog to document.body to cover sidenav in docs app
			// Modal dialogs should fully cover application
			// to prevent interaction outside of dialog
			$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.title('ส่งข้อมูลสำเร็จ')
					.textContent('ข้อมูลถูกส่งไปในรายการค้างชำระเพื่อรอชำระเงินเรียบร้อยแล้ว.')
					.ariaLabel('Alert Dialog Demo')
					.ok('OK')
					.targetEvent(ev)
			);
		};

		// Set 2P2C request parameter
		$scope.setPaymentForm = function (amount) {
			var formatedAmount = formatAmount(amount, 10);
			console.log("$scope.authentication", $scope.authentication);
			var topUpUser = $scope.authentication.user.firstName + ' ' + $scope.authentication.user.lastName;
			var data = {
				amount: formatedAmount,
				paymentDescription: 'Top-up by ' + topUpUser
			};

			$http.post("/payment", data)
				.then(function (response) {
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
				});

			function formatAmount(amount, length) {
				var str = '' + amount;
				while (str.length < length) {
					str = '0' + str;
				}

				return str + '00';
			}
		};

		$scope.payment = function () {
			document.authForm.submit();
		};

		$scope.retrieveMain = function () {
			var result = Mains.retrieveMain(Authentication.user);
			console.log("Result: ", result);
		};

		$scope.setBalanceAmt = function () {
			$http.get("/api/balance?userId=" + $scope.authentication.user._id)
				.then(function (res) {
					if (res.data !== null) {
						$scope.balanceAmount = res.data.balanceAmt;
					} else {
						$scope.balanceAmount = '0';
					}
				});
		};

		$scope.updateBalance = function (balanceAmt) {
			var data = { userId: $scope.authentication.user._id, balanceAmt: balanceAmt };
			$scope.balanceAmount = balanceAmt;
			$http.put('/api/balance', data).then(function () {
			});
		};

		/************************** Dialog Zone ****************************/
		$scope.showConfirm = function (ev, selectedMains) {
			// Appending dialog to document.body to cover sidenav in docs app
			var confirm = $mdDialog.confirm()
				.title('ยืนยันการชำระเงิน')
				.textContent('กรุณายืนยันการชำระเงิน')
				.targetEvent(ev)
				.ok('ยืนยัน')
				.cancel('ยกเลิก');

			$mdDialog.show(confirm).then(function () {
				$scope.status = 'Confirm';

				//update balance amount
				$scope.updateBalance(Number($scope.balanceAmount) - Number($scope.totalPrice));

				// Get next document number of bill (RCP)
				$http.get('/docno/RCP').then(function (response) {
					var rcpDocNo = response.data.prefix + response.data.nextNumber;
					$scope.rcpDocNo = rcpDocNo;

					var inc = selectedMains.length;

					$http.get("/lastNumber").then(function (response) {

						var req = {
							method: 'PUT',
							url: '/lastNumber',
							headers: {
								'Content-Type': 'application/json'
							},
							data: {
								number: Number(response.data.number) + inc + ""
							}
						};

						$http(req).then(function (response) {
							selectedMains.sort();
							for (var i = 0; i < selectedMains.length; i++) {
								setBarcode(selectedMains[i], rcpDocNo, i, response.data.number, response.data.weight);
							}
						});
					});


				});

			}, function () {
				$scope.status = 'Cancel';
			});
		};

		$scope.showTopUpPromt = function (event) {
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

			$mdDialog.show(confirm).then(function (result) {
				$scope.setPaymentForm(result);
				$scope.showConfirmTopUp(event, result);
				//$scope.payment();
				$scope.status = 'You decided to name your dog ' + result + '.';

			}, function () {
				$scope.status = 'You didn\'t name your dog.';
			});
		};

		$scope.showConfirmTopUp = function (event, amount) {
			// Appending dialog to document.body to cover sidenav in docs app
			var confirm = $mdDialog.confirm()
				.title('ยืนยันการเติมเงิน')
				.textContent('ยอดเติมเงิน ' + amount)
				.ariaLabel('Lucky day')
				.targetEvent(event)
				.ok('ตกลง')
				.cancel('ยกเลิก');

			$mdDialog.show(confirm).then(function () {
				$scope.payment();
				//saveStatement(Authentication.user, Number(amount), "เติมเงินผ่าน 2P2C");
			}, function () {
				$scope.status = 'You decided to keep your debt.';
			});
		};

		$scope.showPrintAllAndBill = function ($event) {
			var parentEl = angular.element(document.body);
			$mdDialog.show({
				parent: parentEl,
				targetEvent: $event,
				clickOutsideToClose: true,
				template:
					'<md-dialog>' +
					'  <md-dialog-content class="md-dialog-content">' +
					'    <h2 class="md-title ng-bi55nding">พิมพ์รายการ และใบเสร็จรับเงิน</h2>' +
					'  </md-dialog-content>' +
					'  <md-dialog-actions>' +
					'    <md-button class="md-primary" href="/print/all?rcpDocNo={{items}}" target="_blank">' +
					'      พิมพ์รายการ' +
					'    </md-button>' +
					'    <md-button class="md-primary" href="/print/bill?rcpDocNo={{items}}" target="_blank">' +
					'      พิมพ์ใบเสร็จ' +
					'    </md-button>' +
					'  </md-dialog-actions>' +
					'</md-dialog>',
				locals: {
					items: $scope.rcpDocNo
				},
				controller: DialogController
			});
			function DialogController($scope, $mdDialog, items) {
				$scope.items = items;
				var nextNumber = items.substring(3);
				var req = {
					method: 'PUT',
					url: '/docno/RCP',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						nextNumber: Number(nextNumber) + 1 + ""
					}
				};

				$http(req).then(function (response) {

				});
			}
		};



		// Set 2P2C request parameter
		$scope.setPaymentForm = function (amount) {
			var formatedAmount = formatAmount(amount, 10);
			var topUpUser = $scope.authentication.user.firstName + ' ' + $scope.authentication.user.lastName;
			var data = {
				amount: formatedAmount,
				paymentDescription: 'Top-up by ' + topUpUser
			};

			$http.post("/payment", data)
				.then(function (response) {
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
				});

			function formatAmount(amount, length) {
				var str = '' + amount;
				while (str.length < length) {
					str = '0' + str;
				}

				return str + '00';
			}
		};

		$scope.payment = function () {
			document.authForm.submit();
		};

		$scope.cbCodChanged = function () {
			$scope.codAmount = 0;
			if ($scope.cbCod) {
				$scope.codAmount = 60;
				$scope.setGrandTotal();
			}
		};

		// Execute when product price is changed.
		$scope.productPriceChanged = function (productPrice) {
			$scope.codAmount = 0;
			$scope.grandTotal = 0;

			// Product Price 1-4000, COD = 60
			if (productPrice >= 1 && productPrice <= 4000) {
				$scope.codAmount = 60;
			} else {
				$scope.codAmount = Math.floor(productPrice * 0.015);
			}
			$scope.setGrandTotal();
		};

		// Set Insurance Amount
		$scope.calInsurance = function (selectedInsurance) {
			$scope.insuranceAmount = Number(selectedInsurance.charge);
			$scope.setGrandTotal();
		};

		// Start set grand total
		$scope.setGrandTotal = function () {
			var isPerimeter = false;

			// Use shiping price from user prices
			if (userPrices.length > 0) {
				for (var i = 0; i < perimeter.length; i++) {
					if ($scope.r_country === perimeter[i]) {
						isPerimeter = true;
						break;
					}
				}

				for (var i = 0; i <= userPrices.length; i++) {
					if (userPrices[i].weight === $scope.selectedOption.weight) {
						if (isPerimeter) {
							$scope.shippingPrice = userPrices[i].bkPrice;
						} else {
							$scope.shippingPrice = userPrices[i].ctPrice;
						}
						break;
					}
				}
				// Use default price
			} else {
				$scope.shippingPrice = $filter("provincePrice")($scope.selectedOption.price, $scope.s_country, $scope.r_country, $scope.selectedOption.weight);
			}
			$scope.grandTotal = Number($scope.shippingPrice) + Number($scope.codAmount * 1.07) + Number($scope.insuranceAmount * 1.07);
		}
		// End set grund total


		$scope.manualEmsChanged = function () {
			if ($scope.isManualEms) {
				document.getElementById("barcode").disabled = false;
			} else {
				document.getElementById("barcode").disabled = true;
			}

		}

		//Add to statement
		function saveStatement(item, amount, name, refNumber) {
			var statement = new StatementsService({
				name: name,
				amountIn: amount > 0 ? Math.abs(amount) : 0,
				amountOut: amount < 0 ? Math.abs(amount) : 0,
				balanceAmount: Number($scope.balanceAmount),
				owner: item,
				refNumber: refNumber
			});

			statement.$save(function (response) {

			}, function (errorResponse) {

			});
		}

		/****************************************************************************************
		 *                            Upload Excel of Shipping                                  *
		/****************************************************************************************/
		$scope.importExcel = function () {
			Upload.upload({
				url: 'api/upload/shipping', //webAPI exposed to upload the file
				data: { file: $scope.excelFile } //pass file as data, should be user ng-model
			}).then(function (resp) { //upload function returns a promise
				if (resp.data.error_code === 0) { //validate success
					//$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
					for (var i = 0; i <= resp.data.data.length; i++) {
						var excel = resp.data.data[i];
						var shipping = new Mains({
							s_name: excel.sender,
							s_tel: excel.sender_tel,
							s_email: excel.sender_email,
							s_idNumber: excel.sender_id_card,
							s_address: excel.sender_address,
							s_ampher: excel.sender_amphur,
							s_country: excel.sender_province,
							s_postcode: excel.sender_zipcode,
							r_name: excel.receiver,
							r_tel: excel.receiver_tel,
							r_email: excel.receiver_email,
							r_comment: excel.receiver_comment,
							r_address: excel.receiver_address,
							r_ampher: excel.receiver_amphur,
							r_country: excel.receiver_province,
							r_postcode: excel.receiver_zipcode,
							barcode: excel.barcode,
							order: excel.order_no,
							invoice: excel.inv_no,
							detail_Product: excel.product_in_box,
							detail: excel.product_comment,
							weight: excel.weight,
							price: excel.price,
							isCod: excel.cod ==="Y",
							codAmnt: Number(excel.cod_price),
							insurance: excel.insure ==="Y",
							insuranceAmnt: Number(excel.insure_price),
							total: excel.price,
							status: "ยังไม่ได้ชำระเงิน",
							codVatAmnt: Number(excel.cod_price) * 0.07,
							insuranceVatAmnt: Number(excel.insure_price) * 0.07,
							totalVatAmnt: (Number(excel.cod_price) * 0.07) + (Number(excel.insure_price) * 0.07),
							grandTotalAmnt: Number(excel.price) + (Number(excel.cod_price) * 1.07) + (Number(excel.insure_price) * 1.07),
							source: 'import'
						});
						shipping.$save(function(response){
							$scope.import = 'Success !!!';
							$scope.error = null;
						}, function(errResponse){
							$scope.error = errResponse.data.message;
							$scope.import = null;
						});
					}
				} else {
					$window.alert('an error occured');
				}
			}, function (resp) { //catch error
				console.log('Error status: ' + resp.status);
				$window.alert('Error status: ' + resp.status);
			}, function (evt) {
				console.log(evt);
				//var progressPercentage = Number(100.0 * evt.loaded / evt.total);
				//console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
				//vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
			});
		};

		/*************************************************/
		/******      Dialog Zone     *********************/
		/*************************************************/
		$scope.showAlert = function (ev) {
			var confirm = $mdDialog.confirm()
				.title($scope.error ? 'ส่งข้อมูลไม่สำเร็จ' : 'ส่งข้อมูลสำเร็จ')
				.textContent($scope.error ? $scope.error : 'ข้อมูลถูกส่งไปในรายการค้างชำระเพื่อรอชำระเงินเรียบร้อยแล้ว')
				.ariaLabel('Lucky day')
				.targetEvent(ev)
				.ok('OK');

			$mdDialog.show(confirm).then(function () {
				$scope.error = null;
			}, function () {
				$scope.error = null;
			});

		};
	}
]);




