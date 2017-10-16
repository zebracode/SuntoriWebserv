'use strict';

(function () {
  // Sends Controller Spec
  describe('Sends Controller Tests', function () {
    // Initialize global variables
    var SendsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Sends,
      mockSend;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Sends_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Sends = _Sends_;

      // create mock send
      mockSend = new Sends({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Send about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Sends controller.
      SendsController = $controller('SendsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one send object fetched from XHR', inject(function (Sends) {
      // Create a sample sends array that includes the new send
      var sampleSends = [mockSend];

      // Set GET response
      $httpBackend.expectGET('api/sends').respond(sampleSends);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.sends).toEqualData(sampleSends);
    }));

    it('$scope.findOne() should create an array with one send object fetched from XHR using a sendId URL parameter', inject(function (Sends) {
      // Set the URL parameter
      $stateParams.sendId = mockSend._id;

      // Set GET response
      $httpBackend.expectGET(/api\/sends\/([0-9a-fA-F]{24})$/).respond(mockSend);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.send).toEqualData(mockSend);
    }));

    describe('$scope.craete()', function () {
      var sampleSendPostData;

      beforeEach(function () {
        // Create a sample send object
        sampleSendPostData = new Sends({
          title: 'An Send about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Send about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Sends) {
        // Set POST response
        $httpBackend.expectPOST('api/sends', sampleSendPostData).respond(mockSend);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the send was created
        expect($location.path.calls.mostRecent().args[0]).toBe('sends/' + mockSend._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/sends', sampleSendPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock send in scope
        scope.send = mockSend;
      });

      it('should update a valid send', inject(function (Sends) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/sends\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/sends/' + mockSend._id);
      }));

      it('should set scope.error to error response message', inject(function (Sends) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/sends\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(send)', function () {
      beforeEach(function () {
        // Create new sends array and include the send
        scope.sends = [mockSend, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/sends\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockSend);
      });

      it('should send a DELETE request with a valid sendId and remove the send from the scope', inject(function (Sends) {
        expect(scope.sends.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.send = mockSend;

        $httpBackend.expectDELETE(/api\/sends\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to sends', function () {
        expect($location.path).toHaveBeenCalledWith('sends');
      });
    });
  });
}());
