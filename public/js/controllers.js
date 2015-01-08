dessinemoicharlieControllers = angular.module('dessinemoicharlieControllers', []);
dessinemoicharlieControllers
    .controller("DrawingListController", function($scope, $http) {
        $scope.random = function () {
          return $http.get('/api/drawing/random').success(function (data) {
                $scope.currentImg = data;
            });
        }

        $scope.currentImg = {};

        $scope.helloTo = {};
        $scope.helloTo.title = "World, AngularJS";

        $scope.random();
    })
    .controller("DrawingAddController", function ($scope, $http, $location) {
        $scope.drawing = {};

        $scope.submit = function () {
            return $http.post('/api/drawing', {
                title: $scope.drawing.title,
                description: $scope.drawing.description,
                url: $scope.drawing.url
            }).success(function () {
                $location.path('/add-drawing-success');
            });
        }
    });
