(function () {
  'use strict';

  angular
    .module('statements')
    .controller('StatementsListController', StatementsListController);

  StatementsListController.$inject = ['StatementsService', '$location', 'Authentication'];

  function StatementsListController(StatementsService, $location, Authentication) {

    var vm = this;

    var isAdmin = false;

    // Check role is admin or not
    if (Authentication.user){
      for(var i=0; i<Authentication.user.roles.length; i++){
        if(Authentication.user.roles[i] === "admin"){
          isAdmin = true;
          break;
        }
      }
    }

    if(isAdmin) {
      vm.statements = StatementsService.query();
    } else {
      vm.statements = StatementsService.query(
        function(response){
          var userStatements = [];
          for(var i=0; i<response.length; i++){
            if(response[i].user._id === Authentication.user._id){
              userStatements.push(vm.statements[i]);
            }
          }
          vm.statements = userStatements;
        }
      );
    }
    
    vm.exportExcel = exportExcel;

    // Export Excel
    function exportExcel() {
      window.location.href = '/api/excel/statements'
    }

  }
}());
