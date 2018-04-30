(function () {
  'use strict';

  describe('Statements Route Tests', function () {
    // Initialize global variables
    var $scope,
      StatementsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _StatementsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      StatementsService = _StatementsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('statements');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/statements');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          StatementsController,
          mockStatement;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('statements.view');
          $templateCache.put('modules/statements/client/views/view-statement.client.view.html', '');

          // create mock Statement
          mockStatement = new StatementsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Statement Name'
          });

          // Initialize Controller
          StatementsController = $controller('StatementsController as vm', {
            $scope: $scope,
            statementResolve: mockStatement
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:statementId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.statementResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            statementId: 1
          })).toEqual('/statements/1');
        }));

        it('should attach an Statement to the controller scope', function () {
          expect($scope.vm.statement._id).toBe(mockStatement._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/statements/client/views/view-statement.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          StatementsController,
          mockStatement;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('statements.create');
          $templateCache.put('modules/statements/client/views/form-statement.client.view.html', '');

          // create mock Statement
          mockStatement = new StatementsService();

          // Initialize Controller
          StatementsController = $controller('StatementsController as vm', {
            $scope: $scope,
            statementResolve: mockStatement
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.statementResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/statements/create');
        }));

        it('should attach an Statement to the controller scope', function () {
          expect($scope.vm.statement._id).toBe(mockStatement._id);
          expect($scope.vm.statement._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/statements/client/views/form-statement.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          StatementsController,
          mockStatement;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('statements.edit');
          $templateCache.put('modules/statements/client/views/form-statement.client.view.html', '');

          // create mock Statement
          mockStatement = new StatementsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Statement Name'
          });

          // Initialize Controller
          StatementsController = $controller('StatementsController as vm', {
            $scope: $scope,
            statementResolve: mockStatement
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:statementId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.statementResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            statementId: 1
          })).toEqual('/statements/1/edit');
        }));

        it('should attach an Statement to the controller scope', function () {
          expect($scope.vm.statement._id).toBe(mockStatement._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/statements/client/views/form-statement.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
