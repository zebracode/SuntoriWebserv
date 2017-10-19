angular.module('core').filter('startFrom', function() {
    return function(input, currentPage, itemPerPage) {
        currentPage = +currentPage; //parse to int
        itemPerPage = +itemPerPage; //parse to int
        var newInput = input.slice(currentPage, currentPage + itemPerPage);
        return input.slice(currentPage, currentPage + itemPerPage);;
    }
});