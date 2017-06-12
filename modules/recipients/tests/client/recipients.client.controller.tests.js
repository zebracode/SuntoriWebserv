'use strict';

(function () {
  // Recipients Controller Spec
  describe('Recipients Controller Tests', function () {
    // Initialize global variables
    var RecipientsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Recipients,
      mockRecipient;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Recipients_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Recipients = _Recipients_;

      // create mock recipient
      mockRecipient = new Recipients({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Recipient about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Recipients controller.
      RecipientsController = $controller('RecipientsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one recipient object fetched from XHR', inject(function (Recipients) {
      // Create a sample recipients array that includes the new recipient
      var sampleRecipients = [mockRecipient];

      // Set GET response
      $httpBackend.expectGET('api/recipients').respond(sampleRecipients);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.recipients).toEqualData(sampleRecipients);
    }));

    it('$scope.findOne() should create an array with one recipient object fetched from XHR using a recipientId URL parameter', inject(function (Recipients) {
      // Set the URL parameter
      $stateParams.recipientId = mockRecipient._id;

      // Set GET response
      $httpBackend.expectGET(/api\/recipients\/([0-9a-fA-F]{24})$/).respond(mockRecipient);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.recipient).toEqualData(mockRecipient);
    }));

    describe('$scope.craete()', function () {
      var sampleRecipientPostData;

      beforeEach(function () {
        // Create a sample recipient object
        sampleRecipientPostData = new Recipients({
          title: 'An Recipient about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Recipient about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Recipients) {
        // Set POST response
        $httpBackend.expectPOST('api/recipients', sampleRecipientPostData).respond(mockRecipient);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the recipient was created
        expect($location.path.calls.mostRecent().args[0]).toBe('recipients/' + mockRecipient._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/recipients', sampleRecipientPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock recipient in scope
        scope.recipient = mockRecipient;
      });

      it('should update a valid recipient', inject(function (Recipients) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/recipients\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/recipients/' + mockRecipient._id);
      }));

      it('should set scope.error to error response message', inject(function (Recipients) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/recipients\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(recipient)', function () {
      beforeEach(function () {
        // Create new recipients array and include the recipient
        scope.recipients = [mockRecipient, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/recipients\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockRecipient);
      });

      it('should send a DELETE request with a valid recipientId and remove the recipient from the scope', inject(function (Recipients) {
        expect(scope.recipients.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.recipient = mockRecipient;

        $httpBackend.expectDELETE(/api\/recipients\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to recipients', function () {
        expect($location.path).toHaveBeenCalledWith('recipients');
      });
    });
  });
}());
