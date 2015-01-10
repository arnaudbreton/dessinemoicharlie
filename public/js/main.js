dessinemoicharlieApp = angular.module("dessinemoicharlie", [
  'dessinemoicharlieControllers', 
  'ngRoute',
  'angulartics', 'angulartics.google.analytics'
]);

dessinemoicharlieApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/html/partials/drawing-list.html',
        controller: 'DrawingListController'
      }).
      when('/add-drawing', {
        templateUrl: '/html/partials/drawing-add.html',
        controller: 'DrawingAddController'
      }).
      when('/add-drawing-success', {
        templateUrl: '/html/partials/drawing-add-success.html',
      }).
      otherwise({
        redirectTo: '/'
      });
}]);

