'use strict';

(function () {
  // Mains Controller Spec
  describe('Mains Controller Tests', function () {
    // Initialize global variables
    var MainsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Mains,
      mockMain;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Mains_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Mains = _Mains_;

      // create mock main
      mockMain = new Mains({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Main about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Mains controller.
      MainsController = $controller('MainsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one main object fetched from XHR', inject(function (Mains) {
      // Create a sample mains array that includes the new main
      var sampleMains = [mockMain];

      // Set GET response
      $httpBackend.expectGET('api/mains').respond(sampleMains);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.mains).toEqualData(sampleMains);
    }));

    it('$scope.findOne() should create an array with one main object fetched from XHR using a mainId URL parameter', inject(function (Mains) {
      // Set the URL parameter
      $stateParams.mainId = mockMain._id;

      // Set GET response
      $httpBackend.expectGET(/api\/mains\/([0-9a-fA-F]{24})$/).respond(mockMain);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.main).toEqualData(mockMain);
    }));

    describe('$scope.craete()', function () {
      var sampleMainPostData;

      beforeEach(function () {
        // Create a sample main object
        sampleMainPostData = new Mains({
          title: 'An Main about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Main about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Mains) {
        // Set POST response
        $httpBackend.expectPOST('api/mains', sampleMainPostData).respond(mockMain);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the main was created
        expect($location.path.calls.mostRecent().args[0]).toBe('mains/' + mockMain._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/mains', sampleMainPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock main in scope
        scope.main = mockMain;
      });

      it('should update a valid main', inject(function (Mains) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/mains\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/mains/' + mockMain._id);
      }));

      it('should set scope.error to error response message', inject(function (Mains) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/mains\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(main)', function () {
      beforeEach(function () {
        // Create new mains array and include the main
        scope.mains = [mockMain, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/mains\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockMain);
      });

      it('should send a DELETE request with a valid mainId and remove the main from the scope', inject(function (Mains) {
        expect(scope.mains.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.main = mockMain;

        $httpBackend.expectDELETE(/api\/mains\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to mains', function () {
        expect($location.path).toHaveBeenCalledWith('mains');
      });
    });
  });
}());
