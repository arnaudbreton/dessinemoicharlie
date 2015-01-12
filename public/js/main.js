dessinemoicharlieApp = angular.module("dessinemoicharlie", [
  'dessinemoicharlieControllers', 
  'ngRoute',
  'angulartics', 'angulartics.google.analytics',
  'pascalprecht.translate'
]);

dessinemoicharlieApp.config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
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

    $translateProvider.useStaticFilesLoader({
      prefix: '/languages/',
      suffix: '.json'
    });

    $translateProvider.registerAvailableLanguageKeys(
        ['fr', 'en'],
        {
            'en*': 'en',
            'fr*': 'fr',
            '*': 'en' // must be last!
        }
    );
    $translateProvider.determinePreferredLanguage();
}]);

